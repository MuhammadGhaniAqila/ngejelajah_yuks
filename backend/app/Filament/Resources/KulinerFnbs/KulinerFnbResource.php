<?php

namespace App\Filament\Resources\KulinerFnbs;

use App\Filament\Resources\KulinerFnbs\Pages\CreateKulinerFnb;
use App\Filament\Resources\KulinerFnbs\Pages\EditKulinerFnb;
use App\Filament\Resources\KulinerFnbs\Pages\ListKulinerFnbs;
use App\Filament\Resources\KulinerFnbs\Schemas\KulinerFnbForm;
use App\Filament\Resources\KulinerFnbs\Tables\KulinerFnbsTable;
use App\Models\KulinerFnb;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class KulinerFnbResource extends Resource
{
    protected static ?string $model = KulinerFnb::class;

    protected static ?string $navigationLabel = 'Kuliner F&B';

    protected static ?string $modelLabel = 'Kuliner F&B';

    protected static ?string $pluralModelLabel = 'Kuliner F&B';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return KulinerFnbForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return KulinerFnbsTable::configure($table);
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
            'index' => ListKulinerFnbs::route('/'),
            'create' => CreateKulinerFnb::route('/create'),
            'edit' => EditKulinerFnb::route('/{record}/edit'),
        ];
    }
}
