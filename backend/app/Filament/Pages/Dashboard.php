<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\AdminAccountStatsWidget;
use App\Filament\Widgets\RecentLoginLogsWidget;
use App\Models\User;
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Widgets\AccountWidget;
use Filament\Widgets\FilamentInfoWidget;
use Illuminate\Contracts\Support\Htmlable;

class Dashboard extends BaseDashboard
{
    public function getTitle(): string | Htmlable
    {
        $user = auth()->user();

        if ($user instanceof User && $user->isAdmin()) {
            return 'Dashboard Admin';
        }

        if ($user instanceof User && $user->isOperator()) {
            return 'Dashboard Operator';
        }

        return 'Dashboard';
    }

    public function getSubheading(): string | Htmlable | null
    {
        $user = auth()->user();

        if ($user instanceof User && $user->isAdmin()) {
            return 'Akses penuh seluruh manajemen operasional, konten kawasan, database akun pengguna, dan pemantauan aktivitas login.';
        }

        if ($user instanceof User && $user->isOperator()) {
            return 'Kelola operasional wahana, antrean virtual, kuota harian, reservasi tiket, promo, acara, dan konten kawasan.';
        }

        return null;
    }

    public function getColumns(): int | array
    {
        $user = auth()->user();

        return ($user instanceof User && $user->isAdmin()) ? 1 : 2;
    }

    public function getWidgets(): array
    {
        $user = auth()->user();

        if ($user instanceof User && $user->isAdmin()) {
            return [
                AccountWidget::class,
                AdminAccountStatsWidget::class,
                RecentLoginLogsWidget::class,
            ];
        }

        return [
            AccountWidget::class,
            FilamentInfoWidget::class,
        ];
    }
}
