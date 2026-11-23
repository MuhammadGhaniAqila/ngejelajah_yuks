<?php

namespace App\Filament\Resources\AntreanVirtuals;

use App\Filament\Resources\AntreanVirtuals\Pages\CreateAntreanVirtual;
use App\Filament\Resources\AntreanVirtuals\Pages\EditAntreanVirtual;
use App\Filament\Resources\AntreanVirtuals\Pages\ListAntreanVirtuals;
use App\Filament\Resources\AntreanVirtuals\Schemas\AntreanVirtualForm;
use App\Filament\Resources\AntreanVirtuals\Tables\AntreanVirtualsTable;
use App\Models\AntreanVirtual;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class AntreanVirtualResource extends Resource
{
    protected static ?string $model = AntreanVirtual::class;

    protected static ?string $navigationLabel = 'Antrean Virtual';

    protected static ?string $modelLabel = 'Antrean Virtual';

    protected static ?string $pluralModelLabel = 'Antrean Virtual';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return AntreanVirtualForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return AntreanVirtualsTable::configure($table);
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
            'index' => ListAntreanVirtuals::route('/'),
            'create' => CreateAntreanVirtual::route('/create'),
            'edit' => EditAntreanVirtual::route('/{record}/edit'),
        ];
    }
}
