<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\LoginLogs\LoginLogResource;
use App\Models\LoginLog;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class RecentLoginLogsWidget extends TableWidget
{
    protected static ?int $sort = 2;

    protected int | string | array $columnSpan = 'full';

    public static function canView(): bool
    {
        $user = auth()->user();

        return $user instanceof User && $user->isAdmin();
    }

    public function table(Table $table): Table
    {
        return $table
            ->heading('Aktivitas Login Terbaru')
            ->description('Memantau siapa saja yang login lewat Website/API maupun Panel CMS.')
            ->query(
                LoginLog::query()
                    ->with('user')
                    ->latest('logged_in_at')
                    ->limit(10)
            )
            ->paginated(false)
            ->headerActions([
                Action::make('lihatSemua')
                    ->label('Buka Semua Riwayat')
                    ->url(fn (): string => LoginLogResource::getUrl('index')),
            ])
            ->columns([
                TextColumn::make('logged_in_at')
                    ->label('Waktu')
                    ->dateTime('d M Y H:i:s'),
                TextColumn::make('user.name')
                    ->label('Pengguna')
                    ->placeholder('Tidak Dikenal'),
                TextColumn::make('email')
                    ->label('Email')
                    ->copyable(),
                TextColumn::make('role')
                    ->label('Role')
                    ->badge()
                    ->color(fn (?string $state): string => match ($state) {
                        'admin' => 'danger',
                        'operator' => 'warning',
                        'wisatawan' => 'info',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (?string $state): string => match ($state) {
                        'admin' => 'Admin',
                        'operator' => 'Operator',
                        'wisatawan' => 'Wisatawan',
                        default => '-',
                    })
                    ->placeholder('-'),
                TextColumn::make('channel')
                    ->label('Jalur')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Filament CMS' => 'primary',
                        'API Web' => 'info',
                        'API Registrasi' => 'success',
                        default => 'gray',
                    }),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Berhasil' => 'success',
                        'Ditolak' => 'warning',
                        'Gagal' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('ip_address')
                    ->label('IP')
                    ->placeholder('-'),
            ]);
    }
}
