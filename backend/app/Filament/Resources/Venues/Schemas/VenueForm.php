<?php

namespace App\Filament\Resources\Venues\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class VenueForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('nama')
                    ->required(),
                Select::make('kategori')
                    ->options([
                        'Resort' => 'Resort',
                        'Hotel' => 'Hotel',
                        'Venue Acara' => 'Venue Acara',
                    ])
                    ->required(),
                TextInput::make('area')
                    ->required(),
                TextInput::make('harga_mulai')
                    ->required(),
                TextInput::make('fasilitas')
                    ->required(),
                Textarea::make('ringkasan')
                    ->required()
                    ->columnSpanFull(),
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
