<?php

namespace App\Filament\Resources\AntreanVirtuals\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class AntreanVirtualForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->label('Wisatawan')
                    ->relationship('user', 'name')
                    ->required(),
                Select::make('reservasi_id')
                    ->label('Kode Booking')
                    ->relationship('reservasi', 'kode_booking')
                    ->required(),
                Select::make('wahana_id')
                    ->label('Wahana')
                    ->relationship('wahana', 'nama_wahana')
                    ->required(),
                TextInput::make('nomor_antrean')
                    ->required(),
                TextInput::make('nomor_kloter')
                    ->required()
                    ->numeric(),
                TextInput::make('estimasi_tunggu_menit')
                    ->required()
                    ->numeric()
                    ->default(10),
                Select::make('status_antrean')
                    ->options([
                        'Menunggu' => 'Menunggu',
                        'Dipanggil' => 'Dipanggil',
                        'Selesai' => 'Selesai',
                        'Dibatalkan' => 'Dibatalkan',
                    ])
                    ->required()
                    ->default('Menunggu'),
                DateTimePicker::make('waktu_daftar')
                    ->required(),
                DateTimePicker::make('waktu_selesai'),
            ]);
    }
}
