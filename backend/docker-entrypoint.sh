#!/bin/sh
set -e

PORT_VALUE="${PORT:-80}"
sed -ri "s/^Listen [0-9]+/Listen ${PORT_VALUE}/g" /etc/apache2/ports.conf
sed -ri "s/<VirtualHost \*:[0-9]+>/<VirtualHost *:${PORT_VALUE}>/g" /etc/apache2/sites-available/000-default.conf

cd /var/www/html

if [ -z "${APP_KEY:-}" ]; then
  echo "WARNING: APP_KEY is not set. Generating an ephemeral runtime key; configure a persistent APP_KEY in your host dashboard."
  export APP_KEY
  APP_KEY="$(php -r 'echo "base64:" . base64_encode(random_bytes(32));')"
fi

mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

php artisan optimize:clear || true
php artisan storage:link || true

ATTEMPTS=0
until php -r '
require "vendor/autoload.php";
$app = require "bootstrap/app.php";
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
try {
    Illuminate\Support\Facades\DB::connection()->getPdo();
    exit(0);
} catch (Throwable $e) {
    fwrite(STDERR, $e->getMessage() . "\n");
    exit(1);
}
'; do
  ATTEMPTS=$((ATTEMPTS + 1))
  if [ "$ATTEMPTS" -ge 10 ]; then
    echo "ERROR: Could not connect to PostgreSQL after 10 attempts."
    exit 1
  fi
  echo "Waiting for PostgreSQL ($ATTEMPTS/10)..."
  sleep 2
done

php artisan migrate --force

if [ "${AUTO_SEED:-auto}" = "true" ]; then
  php artisan db:seed --force
elif [ "${AUTO_SEED:-auto}" = "auto" ]; then
  IS_EMPTY="$(php -r '
  require "vendor/autoload.php";
  $app = require "bootstrap/app.php";
  $app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
  echo App\Models\User::count() === 0 ? "yes" : "no";
  ')"
  if [ "$IS_EMPTY" = "yes" ]; then
    echo "Empty database detected; running initial seed..."
    php artisan db:seed --force
  fi
fi

exec apache2-foreground
