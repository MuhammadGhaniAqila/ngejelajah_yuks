<?php

namespace App\Providers;

use App\Models\User;
use App\Services\LoginTracker;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->environment('production') || str_starts_with((string) config('app.url'), 'https://')) {
            URL::forceScheme('https');
        }

        Event::listen(Login::class, function (Login $event): void {
            if ($event->guard !== 'web' || ! $event->user instanceof User) {
                return;
            }

            LoginTracker::recordSuccess($event->user, 'Filament CMS', request());
        });

        Event::listen(Failed::class, function (Failed $event): void {
            if ($event->guard !== 'web') {
                return;
            }

            $email = (string) ($event->credentials['email'] ?? '-');
            $user = $event->user instanceof User ? $event->user : User::where('email', $email)->first();

            $status = 'Gagal';
            if ($user && (! ($user->is_active ?? true) || ! in_array($user->role, ['admin', 'operator'], true))) {
                $status = 'Ditolak';
            }

            LoginTracker::recordFailure($user, $email, 'Filament CMS', $status, request());
        });
    }
}
