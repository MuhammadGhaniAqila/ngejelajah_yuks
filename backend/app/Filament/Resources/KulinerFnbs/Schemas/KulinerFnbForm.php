<?php

namespace App\Filament\Resources\KulinerFnbs\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class KulinerFnbForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('nama')
                    ->required(),
                Select::make('kategori')
                    ->options([
                        'Restoran Keluarga' => 'Restoran Keluarga',
                        'Kafe & Minuman' => 'Kafe & Minuman',
                        'Tepi Pantai' => 'Tepi Pantai',
                    ])
                    ->required(),
                TextInput::make('area')
                    ->required(),
                TextInput::make('jam_buka')
                    ->required(),
                TextInput::make('kisaran_harga')
                    ->required(),
                TextInput::make('menu_andalan')
                    ->required(),
                TextInput::make('gambar_url')
                    ->label('Path / URL Gambar')
                    ->required()
                    ->default('/photos/resort-kuliner.jpg'),
                Toggle::make('is_active')
                    ->default(true)
                    ->required(),
            ]);
    }
}
