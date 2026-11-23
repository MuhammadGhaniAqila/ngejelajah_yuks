<?php

namespace App\Filament\Resources\Wahanas\Tables;

use App\Models\Wahana;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class WahanasTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('nama_wahana')
                    ->label('Wahana')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('zona')
                    ->badge()
                    ->color('info'),
                TextColumn::make('tinggi_minimal_cm')
                    ->label('Min. Tinggi')
                    ->suffix(' cm')
                    ->sortable(),
                TextColumn::make('status_lampu')
                    ->label('Lampu')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Hijau' => 'success',
                        'Merah' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('crowd_meter')
                    ->label('Crowd')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Sepi' => 'success',
                        'Sedang' => 'warning',
                        'Padat' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('kloter_berjalan')
                    ->label('Kloter')
                    ->numeric()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('zona')->options([
                    'Ekstrem' => 'Ekstrem',
                    'Keluarga' => 'Keluarga',
                    'Air' => 'Air',
                ]),
                SelectFilter::make('status_lampu')->options([
                    'Hijau' => 'Hijau',
                    'Merah' => 'Merah',
                    'Maintenance' => 'Maintenance',
                ]),
            ])
            ->recordActions([
                Action::make('setHijau')
                    ->label('Set Hijau')
                    ->color('success')
                    ->visible(fn (Wahana $record): bool => $record->status_lampu !== 'Hijau')
                    ->action(function (Wahana $record): void {
                        $record->update(['status_lampu' => 'Hijau']);
                    }),
                Action::make('setMerah')
                    ->label('Set Merah')
                    ->color('danger')
                    ->visible(fn (Wahana $record): bool => $record->status_lampu !== 'Merah')
                    ->action(function (Wahana $record): void {
                        $record->update(['status_lampu' => 'Merah']);
                    }),
                Action::make('panggilKloter')
                    ->label('Panggil Kloter Berikutnya')
                    ->color('warning')
                    ->action(function (Wahana $record): void {
                        $record->antreanVirtuals()
                            ->where('status_antrean', 'Dipanggil')
                            ->update([
                                'status_antrean' => 'Selesai',
                                'waktu_selesai' => now(),
                            ]);

                        $nextKloter = $record->kloter_berjalan + 1;
                        $record->update([
                            'kloter_berjalan' => $nextKloter,
                            'status_lampu' => 'Hijau',
                        ]);

                        $record->antreanVirtuals()
                            ->where('status_antrean', 'Menunggu')
                            ->where('nomor_kloter', '<=', $nextKloter)
                            ->update(['status_antrean' => 'Dipanggil']);

                        $record->syncCrowdMeter();
                    }),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
