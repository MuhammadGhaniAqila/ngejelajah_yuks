<?php

namespace App\Filament\Resources\ReservasiTikets;

use App\Filament\Resources\ReservasiTikets\Pages\CreateReservasiTiket;
use App\Filament\Resources\ReservasiTikets\Pages\EditReservasiTiket;
use App\Filament\Resources\ReservasiTikets\Pages\ListReservasiTikets;
use App\Filament\Resources\ReservasiTikets\Schemas\ReservasiTiketForm;
use App\Filament\Resources\ReservasiTikets\Tables\ReservasiTiketsTable;
use App\Models\ReservasiTiket;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ReservasiTiketResource extends Resource
{
    protected static ?string $model = ReservasiTiket::class;

    protected static ?string $navigationLabel = 'Reservasi Tiket';

    protected static ?string $modelLabel = 'Reservasi Tiket';

    protected static ?string $pluralModelLabel = 'Reservasi Tiket';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return ReservasiTiketForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ReservasiTiketsTable::configure($table);
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
            'index' => ListReservasiTikets::route('/'),
            'create' => CreateReservasiTiket::route('/create'),
            'edit' => EditReservasiTiket::route('/{record}/edit'),
        ];
    }
}
