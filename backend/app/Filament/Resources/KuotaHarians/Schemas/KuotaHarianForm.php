<?php

namespace App\Filament\Resources\KuotaHarians\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class KuotaHarianForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                DatePicker::make('tanggal')
                    ->required(),
                TextInput::make('kuota_maksimal')
                    ->required()
                    ->numeric()
                    ->default(5000),
                TextInput::make('kuota_terpakai')
                    ->required()
                    ->numeric()
                    ->default(0),
                Select::make('status_kawasan')
                    ->options([
                        'Buka' => 'Buka',
                        'Tutup' => 'Tutup',
                    ])
                    ->required()
                    ->default('Buka'),
            ]);
    }
}
