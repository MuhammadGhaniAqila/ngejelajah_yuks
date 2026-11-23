<?php

namespace App\Filament\Resources\KuotaHarians;

use App\Filament\Base\OperatorResource;
use App\Filament\Resources\KuotaHarians\Pages\CreateKuotaHarian;
use App\Filament\Resources\KuotaHarians\Pages\EditKuotaHarian;
use App\Filament\Resources\KuotaHarians\Pages\ListKuotaHarians;
use App\Filament\Resources\KuotaHarians\Schemas\KuotaHarianForm;
use App\Filament\Resources\KuotaHarians\Tables\KuotaHariansTable;
use App\Models\KuotaHarian;
use BackedEnum;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class KuotaHarianResource extends OperatorResource
{
    protected static ?string $model = KuotaHarian::class;

    protected static ?string $navigationLabel = 'Kuota Harian';

    protected static ?string $modelLabel = 'Kuota Harian';

    protected static ?string $pluralModelLabel = 'Kuota Harian';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return KuotaHarianForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return KuotaHariansTable::configure($table);
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
            'index' => ListKuotaHarians::route('/'),
            'create' => CreateKuotaHarian::route('/create'),
            'edit' => EditKuotaHarian::route('/{record}/edit'),
        ];
    }
}
