<?php

namespace App\Filament\Resources\ReservasiTikets\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ReservasiTiketForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->label('Wisatawan')
                    ->relationship('user', 'name')
                    ->required(),
                Select::make('paket_id')
                    ->label('Paket Tiket')
                    ->relationship('paket', 'nama_paket')
                    ->required(),
                DatePicker::make('tanggal_kunjungan')
                    ->required(),
                TextInput::make('jumlah_tiket')
                    ->required()
                    ->numeric(),
                TextInput::make('total_harga')
                    ->required()
                    ->numeric(),
                TextInput::make('metode_pembayaran')
                    ->required()
                    ->default('QRIS Instan'),
                TextInput::make('kode_booking')
                    ->required(),
                TextInput::make('qr_token')
                    ->label('QR Token')
                    ->required(),
                Select::make('status_pembayaran')
                    ->options([
                        'Menunggu' => 'Menunggu',
                        'Lunas' => 'Lunas',
                        'Dibatalkan' => 'Dibatalkan',
                    ])
                    ->required()
                    ->default('Lunas'),
                Select::make('status_kunjungan')
                    ->options([
                        'Belum Check-in' => 'Belum Check-in',
                        'Aktif di Kawasan' => 'Aktif di Kawasan',
                        'Selesai' => 'Selesai',
                    ])
                    ->required()
                    ->default('Belum Check-in'),
                DateTimePicker::make('waktu_checkin'),
            ]);
    }
}
