<?php

namespace App\Filament\Resources\ReservasiTikets\Tables;

use App\Models\ReservasiTiket;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ReservasiTiketsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('kode_booking')
                    ->label('Kode Booking')
                    ->searchable()
                    ->copyable(),
                TextColumn::make('qr_token')
                    ->label('Token QR')
                    ->searchable()
                    ->copyable()
                    ->toggleable(),
                TextColumn::make('user.name')
                    ->label('Wisatawan')
                    ->searchable(),
                TextColumn::make('paket.nama_paket')
                    ->label('Paket Tiket')
                    ->limit(28),
                TextColumn::make('tanggal_kunjungan')
                    ->label('Tanggal')
                    ->date('d M Y')
                    ->sortable(),
                TextColumn::make('jumlah_tiket')
                    ->label('Qty')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('total_harga')
                    ->label('Total')
                    ->money('IDR')
                    ->sortable(),
                TextColumn::make('status_kunjungan')
                    ->label('Status Gerbang')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Aktif di Kawasan' => 'success',
                        'Belum Check-in' => 'warning',
                        default => 'gray',
                    }),
                TextColumn::make('waktu_checkin')
                    ->dateTime('d M H:i')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status_kunjungan')->options([
                    'Belum Check-in' => 'Belum Check-in',
                    'Aktif di Kawasan' => 'Aktif di Kawasan',
                    'Selesai' => 'Selesai',
                ]),
            ])
            ->recordActions([
                Action::make('validasiMasuk')
                    ->label('Validasi Masuk Gerbang')
                    ->color('success')
                    ->visible(fn (ReservasiTiket $record): bool => $record->status_kunjungan === 'Belum Check-in')
                    ->action(function (ReservasiTiket $record): void {
                        $record->update([
                            'status_pembayaran' => 'Lunas',
                            'status_kunjungan' => 'Aktif di Kawasan',
                            'waktu_checkin' => now(),
                        ]);
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
