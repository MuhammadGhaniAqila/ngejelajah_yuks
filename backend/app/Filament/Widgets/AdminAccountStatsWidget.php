<?php

namespace App\Filament\Widgets;

use App\Models\LoginLog;
use App\Models\User;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class AdminAccountStatsWidget extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected ?string $heading = 'Ringkasan Database Akun & Login';

    public static function canView(): bool
    {
        $user = auth()->user();

        return $user instanceof User && $user->isAdmin();
    }

    protected function getStats(): array
    {
        $totalAkun = User::count();
        $totalAdmin = User::where('role', 'admin')->count();
        $totalOperator = User::where('role', 'operator')->count();
        $totalWisatawan = User::where('role', 'wisatawan')->count();

        $akunAktif = User::where('is_active', true)->count();
        $akunNonaktif = max(0, $totalAkun - $akunAktif);

        $loginHariIni = LoginLog::whereDate('logged_in_at', today())
            ->where('status', 'Berhasil')
            ->count();
        $gagalHariIni = LoginLog::whereDate('logged_in_at', today())
            ->whereIn('status', ['Gagal', 'Ditolak'])
            ->count();

        $tokenApiAktif = DB::table('personal_access_tokens')->count();
        $pernahLogin = User::whereNotNull('last_login_at')->count();

        return [
            Stat::make('Total Akun Database', (string) $totalAkun)
                ->description("{$totalAdmin} Admin · {$totalOperator} Operator · {$totalWisatawan} Wisatawan")
                ->descriptionIcon(Heroicon::OutlinedUsers)
                ->color('primary'),
            Stat::make('Status Akun Aktif', (string) $akunAktif)
                ->description($akunNonaktif > 0 ? "{$akunNonaktif} akun dinonaktifkan" : 'Semua akun aktif')
                ->descriptionIcon(Heroicon::OutlinedShieldCheck)
                ->color($akunNonaktif > 0 ? 'warning' : 'success'),
            Stat::make('Login Hari Ini', (string) $loginHariIni)
                ->description("{$gagalHariIni} percobaan gagal/ditolak hari ini")
                ->descriptionIcon(Heroicon::OutlinedClock)
                ->color($gagalHariIni > 0 ? 'warning' : 'info'),
            Stat::make('Token API Aktif', (string) $tokenApiAktif)
                ->description("{$pernahLogin} akun tercatat pernah login")
                ->descriptionIcon(Heroicon::OutlinedKey)
                ->color('success'),
        ];
    }
}
