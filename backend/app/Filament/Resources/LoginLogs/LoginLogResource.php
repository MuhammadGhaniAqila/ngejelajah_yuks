<?php

namespace App\Filament\Resources\LoginLogs;

use App\Filament\Base\AdminResource;
use App\Filament\Resources\LoginLogs\Pages\ListLoginLogs;
use App\Filament\Resources\LoginLogs\Tables\LoginLogsTable;
use App\Models\LoginLog;
use BackedEnum;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;
use UnitEnum;

class LoginLogResource extends AdminResource
{
    protected static ?string $model = LoginLog::class;

    protected static ?string $navigationLabel = 'Riwayat Login';

    protected static ?string $modelLabel = 'Riwayat Login';

    protected static ?string $pluralModelLabel = 'Riwayat Login';

    protected static string | UnitEnum | null $navigationGroup = 'Manajemen Akun';

    protected static ?int $navigationSort = 2;

    protected static string | BackedEnum | null $navigationIcon = Heroicon::OutlinedShieldCheck;

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canEdit(Model $record): bool
    {
        return false;
    }

    public static function table(Table $table): Table
    {
        return LoginLogsTable::configure($table);
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
            'index' => ListLoginLogs::route('/'),
        ];
    }
}
