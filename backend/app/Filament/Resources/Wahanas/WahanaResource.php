<?php

namespace App\Filament\Resources\Wahanas;

use App\Filament\Resources\Wahanas\Pages\CreateWahana;
use App\Filament\Resources\Wahanas\Pages\EditWahana;
use App\Filament\Resources\Wahanas\Pages\ListWahanas;
use App\Filament\Resources\Wahanas\Schemas\WahanaForm;
use App\Filament\Resources\Wahanas\Tables\WahanasTable;
use App\Models\Wahana;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class WahanaResource extends Resource
{
    protected static ?string $model = Wahana::class;

    protected static ?string $navigationLabel = 'Wahana';

    protected static ?string $modelLabel = 'Wahana';

    protected static ?string $pluralModelLabel = 'Wahana';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return WahanaForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return WahanasTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListWahanas::route('/'),
            'create' => CreateWahana::route('/create'),
            'edit' => EditWahana::route('/{record}/edit'),
        ];
    }
}
