<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('role');
            $table->unsignedInteger('login_count')->default(0)->after('is_active');
            $table->timestamp('last_login_at')->nullable()->after('login_count');
            $table->string('last_login_ip', 45)->nullable()->after('last_login_at');
            $table->string('last_login_channel', 40)->nullable()->after('last_login_ip');
        });

        Schema::create('login_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('email')->index();
            $table->string('role', 20)->nullable()->index();
            $table->string('channel', 40)->index();
            $table->string('status', 30)->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('logged_in_at')->useCurrent()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('login_logs');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'is_active',
                'login_count',
                'last_login_at',
                'last_login_ip',
                'last_login_channel',
            ]);
        });
    }
};
