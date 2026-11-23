<?php

namespace App\Filament\Resources\Promos\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class PromoForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('judul')
                    ->required(),
                Select::make('kategori')
                    ->options([
                        'Tiket Hemat' => 'Tiket Hemat',
                        'Bundling' => 'Bundling',
                        'Member & Pelajar' => 'Member & Pelajar',
                    ])
                    ->required(),
                TextInput::make('diskon_badge')
                    ->required(),
                TextInput::make('periode')
                    ->required(),
                TextInput::make('kode_promo')
                    ->required(),
                Textarea::make('ringkasan')
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('ketentuan')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('gambar_url')
                    ->label('Path / URL Gambar')
                    ->required()
                    ->default('/photos/hero-jelajahin.jpg'),
                Toggle::make('is_active')
                    ->default(true)
                    ->required(),
            ]);
    }
}
