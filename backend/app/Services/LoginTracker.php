<?php

namespace App\Services;

use App\Models\LoginLog;
use App\Models\User;
use Illuminate\Http\Request;

class LoginTracker
{
    public static function recordSuccess(User $user, string $channel, ?Request $request = null): LoginLog
    {
        $now = now();
        $ip = $request?->ip();
        $userAgent = static::truncateUserAgent($request?->userAgent());

        $user->forceFill([
            'login_count' => (int) ($user->login_count ?? 0) + 1,
            'last_login_at' => $now,
            'last_login_ip' => $ip,
            'last_login_channel' => $channel,
        ])->save();

        return LoginLog::create([
            'user_id' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
            'channel' => $channel,
            'status' => 'Berhasil',
            'ip_address' => $ip,
            'user_agent' => $userAgent,
            'logged_in_at' => $now,
        ]);
    }

    public static function recordFailure(
        ?User $user,
        string $email,
        string $channel,
        string $status = 'Gagal',
        ?Request $request = null,
    ): LoginLog {
        return LoginLog::create([
            'user_id' => $user?->id,
            'email' => $email !== '' ? $email : ($user?->email ?? '-'),
            'role' => $user?->role,
            'channel' => $channel,
            'status' => $status,
            'ip_address' => $request?->ip(),
            'user_agent' => static::truncateUserAgent($request?->userAgent()),
            'logged_in_at' => now(),
        ]);
    }

    private static function truncateUserAgent(?string $userAgent): ?string
    {
        if ($userAgent === null || $userAgent === '') {
            return null;
        }

        return mb_substr($userAgent, 0, 500);
    }
}
