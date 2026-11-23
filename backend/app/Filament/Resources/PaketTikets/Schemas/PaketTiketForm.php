<?php

namespace App\Filament\Resources\PaketTikets\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class PaketTiketForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('nama_paket')
                    ->required(),
                Textarea::make('deskripsi')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('harga')
                    ->required()
                    ->numeric(),
                TextInput::make('jatah_antrean_aktif')
                    ->required()
                    ->numeric()
                    ->default(2),
                Toggle::make('is_bundle')
                    ->required(),
                Toggle::make('is_active')
                    ->required(),
            ]);
    }
}
