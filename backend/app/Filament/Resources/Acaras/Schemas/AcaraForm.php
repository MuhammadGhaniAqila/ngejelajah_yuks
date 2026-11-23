<?php

namespace App\Filament\Resources\Acaras\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class AcaraForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('judul')
                    ->required(),
                Select::make('kategori')
                    ->options([
                        'Parade' => 'Parade',
                        'Pertunjukan' => 'Pertunjukan',
                        'Musik' => 'Musik',
                    ])
                    ->required(),
                TextInput::make('lokasi')
                    ->required(),
                TextInput::make('jadwal')
                    ->required(),
                TextInput::make('jam')
                    ->required(),
                Textarea::make('ringkasan')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('gambar_url')
                    ->label('Path / URL Gambar')
                    ->required()
                    ->default('/photos/unit-dufan.jpg'),
                Toggle::make('is_active')
                    ->default(true)
                    ->required(),
            ]);
    }
}
