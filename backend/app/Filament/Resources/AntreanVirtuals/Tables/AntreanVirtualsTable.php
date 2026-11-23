<?php

namespace App\Filament\Resources\AntreanVirtuals\Tables;

use App\Models\AntreanVirtual;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class AntreanVirtualsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('nomor_antrean')
                    ->label('No. Antrean')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('wahana.nama_wahana')
                    ->label('Wahana')
                    ->searchable(),
                TextColumn::make('user.name')
                    ->label('Pengunjung')
                    ->searchable(),
                TextColumn::make('nomor_kloter')
                    ->label('Kloter')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('estimasi_tunggu_menit')
                    ->label('Estimasi')
                    ->suffix(' mnt')
                    ->sortable(),
                TextColumn::make('status_antrean')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Menunggu' => 'warning',
                        'Dipanggil' => 'info',
                        'Selesai' => 'success',
                        default => 'gray',
                    }),
                TextColumn::make('waktu_daftar')
                    ->dateTime('d M H:i')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status_antrean')->options([
                    'Menunggu' => 'Menunggu',
                    'Dipanggil' => 'Dipanggil',
                    'Selesai' => 'Selesai',
                    'Dibatalkan' => 'Dibatalkan',
                ]),
            ])
            ->recordActions([
                Action::make('panggil')
                    ->label('Panggil')
                    ->color('info')
                    ->visible(fn (AntreanVirtual $record): bool => $record->status_antrean === 'Menunggu')
                    ->action(function (AntreanVirtual $record): void {
                        $record->update(['status_antrean' => 'Dipanggil']);
                    }),
                Action::make('selesai')
                    ->label('Selesai')
                    ->color('success')
                    ->visible(fn (AntreanVirtual $record): bool => in_array($record->status_antrean, ['Menunggu', 'Dipanggil'], true))
                    ->action(function (AntreanVirtual $record): void {
                        $record->update([
                            'status_antrean' => 'Selesai',
                            'waktu_selesai' => now(),
                        ]);
                        $record->wahana?->syncCrowdMeter();
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
