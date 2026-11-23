<?php

namespace App\Filament\Resources\Users\Tables;

use App\Models\User;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('last_login_at', 'desc')
            ->columns([
                TextColumn::make('name')
                    ->label('Nama')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('email')
                    ->label('Email')
                    ->searchable()
                    ->copyable(),
                TextColumn::make('role')
                    ->label('Role')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'admin' => 'danger',
                        'operator' => 'warning',
                        default => 'info',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'admin' => 'Admin',
                        'operator' => 'Operator',
                        'wisatawan' => 'Wisatawan',
                        default => $state,
                    })
                    ->sortable(),
                TextColumn::make('is_active')
                    ->label('Status')
                    ->badge()
                    ->color(fn (bool $state): string => $state ? 'success' : 'danger')
                    ->formatStateUsing(fn (bool $state): string => $state ? 'Aktif' : 'Nonaktif')
                    ->sortable(),
                TextColumn::make('last_login_at')
                    ->label('Terakhir Login')
                    ->dateTime('d M Y H:i')
                    ->placeholder('Belum pernah')
                    ->sortable(),
                TextColumn::make('last_login_channel')
                    ->label('Jalur Login')
                    ->badge()
                    ->color(fn (?string $state): string => match ($state) {
                        'Filament CMS' => 'primary',
                        'API Web' => 'info',
                        'API Registrasi' => 'success',
                        default => 'gray',
                    })
                    ->placeholder('-'),
                TextColumn::make('last_login_ip')
                    ->label('IP Terakhir')
                    ->placeholder('-')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('login_count')
                    ->label('Total Login')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('reservasi_tikets_count')
                    ->label('Reservasi')
                    ->counts('reservasiTikets')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('role')
                    ->label('Filter Role')
                    ->options([
                        'admin' => 'Admin',
                        'operator' => 'Operator',
                        'wisatawan' => 'Wisatawan',
                    ]),
                TernaryFilter::make('is_active')
                    ->label('Status Akun'),
            ])
            ->recordActions([
                EditAction::make(),
                Action::make('toggleActive')
                    ->label(fn (User $record): string => $record->is_active ? 'Nonaktifkan' : 'Aktifkan')
                    ->color(fn (User $record): string => $record->is_active ? 'danger' : 'success')
                    ->hidden(fn (User $record): bool => $record->id === auth()->id())
                    ->requiresConfirmation()
                    ->action(function (User $record): void {
                        $nextStatus = ! (bool) $record->is_active;
                        $record->update(['is_active' => $nextStatus]);

                        if (! $nextStatus) {
                            $record->tokens()->delete();
                            DB::table('sessions')->where('user_id', $record->id)->delete();
                        }

                        Notification::make()
                            ->title($nextStatus ? 'Akun diaktifkan kembali.' : 'Akun dinonaktifkan & sesi diputus.')
                            ->success()
                            ->send();
                    }),
                Action::make('revokeSessions')
                    ->label('Putus Sesi')
                    ->color('warning')
                    ->hidden(fn (User $record): bool => $record->id === auth()->id())
                    ->requiresConfirmation()
                    ->action(function (User $record): void {
                        $record->tokens()->delete();
                        DB::table('sessions')->where('user_id', $record->id)->delete();

                        Notification::make()
                            ->title('Seluruh token & sesi aktif akun diputus.')
                            ->success()
                            ->send();
                    }),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()
                        ->action(function (Collection $records): void {
                            $records
                                ->reject(fn (User $record): bool => $record->id === auth()->id())
                                ->each
                                ->delete();
                        }),
                ]),
            ]);
    }
}
