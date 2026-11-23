<?php

namespace App\Filament\Resources\Wahanas\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class WahanaForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('nama_wahana')
                    ->label('Nama Wahana')
                    ->required(),
                Select::make('zona')
                    ->label('Zona Wahana')
                    ->options([
                        'Ekstrem' => 'Ekstrem',
                        'Keluarga' => 'Keluarga',
                        'Air' => 'Air',
                    ])
                    ->required(),
                Textarea::make('deskripsi')
                    ->label('Deskripsi Singkat')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('gambar_url')
                    ->label('Path / URL Gambar')
                    ->required()
                    ->default('/photos/unit-wahana.jpg'),
                TextInput::make('tinggi_minimal_cm')
                    ->label('Tinggi Minimal (cm)')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('kategori_usia')
                    ->label('Kategori Usia')
                    ->required()
                    ->default('Semua Usia'),
                TextInput::make('kapasitas_kloter')
                    ->label('Kapasitas per Kloter')
                    ->required()
                    ->numeric()
                    ->default(24),
                TextInput::make('durasi_menit')
                    ->label('Durasi Main (Menit)')
                    ->required()
                    ->numeric()
                    ->default(5),
                Select::make('status_lampu')
                    ->label('Status Lampu Wahana')
                    ->options([
                        'Hijau' => 'Hijau (Siap Naik)',
                        'Merah' => 'Merah (Sedang Bermain)',
                        'Maintenance' => 'Maintenance (Tutup)',
                    ])
                    ->required()
                    ->default('Hijau'),
                Select::make('crowd_meter')
                    ->label('Crowd Meter')
                    ->options([
                        'Sepi' => 'Sepi (<10 mnt)',
                        'Sedang' => 'Sedang (10-25 mnt)',
                        'Padat' => 'Padat (>30 mnt)',
                    ])
                    ->required()
                    ->default('Sepi'),
                TextInput::make('kloter_berjalan')
                    ->label('Kloter Berjalan Saat Ini')
                    ->required()
                    ->numeric()
                    ->default(1),
            ]);
    }
}
