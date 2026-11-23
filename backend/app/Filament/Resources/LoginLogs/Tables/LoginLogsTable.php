<?php

namespace App\Filament\Resources\LoginLogs\Tables;

use App\Models\LoginLog;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class LoginLogsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('logged_in_at', 'desc')
            ->columns([
                TextColumn::make('logged_in_at')
                    ->label('Waktu Login')
                    ->dateTime('d M Y H:i:s')
                    ->sortable(),
                TextColumn::make('user.name')
                    ->label('Nama Akun')
                    ->placeholder('Tidak Dikenal')
                    ->searchable(),
                TextColumn::make('email')
                    ->label('Email')
                    ->searchable()
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
                    ->label('Jalur Login')
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
                    ->label('IP Address')
                    ->placeholder('-')
                    ->copyable(),
                TextColumn::make('user_agent')
                    ->label('Perangkat / Browser')
                    ->limit(42)
                    ->tooltip(fn (LoginLog $record): ?string => $record->user_agent)
                    ->placeholder('-'),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'Berhasil' => 'Berhasil',
                        'Gagal' => 'Gagal',
                        'Ditolak' => 'Ditolak',
                    ]),
                SelectFilter::make('channel')
                    ->label('Jalur Login')
                    ->options([
                        'Filament CMS' => 'Filament CMS',
                        'API Web' => 'API Web',
                        'API Registrasi' => 'API Registrasi',
                    ]),
                SelectFilter::make('role')
                    ->label('Role')
                    ->options([
                        'admin' => 'Admin',
                        'operator' => 'Operator',
                        'wisatawan' => 'Wisatawan',
                    ]),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
