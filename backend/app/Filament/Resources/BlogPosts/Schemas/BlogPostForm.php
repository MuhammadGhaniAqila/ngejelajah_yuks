<?php

namespace App\Filament\Resources\BlogPosts\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class BlogPostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('judul')
                    ->required(),
                Select::make('kategori')
                    ->options([
                        'Panduan Kunjungan' => 'Panduan Kunjungan',
                        'Tips Wahana' => 'Tips Wahana',
                        'Kuliner & Menginap' => 'Kuliner & Menginap',
                    ])
                    ->required(),
                TextInput::make('tanggal_terbit')
                    ->required(),
                TextInput::make('waktu_baca')
                    ->required(),
                Textarea::make('ringkasan')
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('isi')
                    ->label('Isi Artikel (Pisahkan paragraf dengan baris baru)')
                    ->rows(6)
                    ->formatStateUsing(fn ($state) => is_array($state) ? implode("\n\n", $state) : (string) $state)
                    ->dehydrateStateUsing(fn (?string $state) => array_values(array_filter(array_map('trim', preg_split('/\R+/', (string) $state)))))
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('gambar_url')
                    ->label('Path / URL Gambar')
                    ->required()
                    ->default('/photos/hero-ancol.jpg'),
                Toggle::make('is_published')
                    ->default(true)
                    ->required(),
            ]);
    }
}
