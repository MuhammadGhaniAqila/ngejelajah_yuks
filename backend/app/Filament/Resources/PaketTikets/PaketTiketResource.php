<?php

namespace App\Filament\Resources\PaketTikets;

use App\Filament\Base\OperatorResource;
use App\Filament\Resources\PaketTikets\Pages\CreatePaketTiket;
use App\Filament\Resources\PaketTikets\Pages\EditPaketTiket;
use App\Filament\Resources\PaketTikets\Pages\ListPaketTikets;
use App\Filament\Resources\PaketTikets\Schemas\PaketTiketForm;
use App\Filament\Resources\PaketTikets\Tables\PaketTiketsTable;
use App\Models\PaketTiket;
use BackedEnum;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class PaketTiketResource extends OperatorResource
{
    protected static ?string $model = PaketTiket::class;

    protected static ?string $navigationLabel = 'Paket Tiket';

    protected static ?string $modelLabel = 'Paket Tiket';

    protected static ?string $pluralModelLabel = 'Paket Tiket';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return PaketTiketForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PaketTiketsTable::configure($table);
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
            'index' => ListPaketTikets::route('/'),
            'create' => CreatePaketTiket::route('/create'),
            'edit' => EditPaketTiket::route('/{record}/edit'),
        ];
    }
}
