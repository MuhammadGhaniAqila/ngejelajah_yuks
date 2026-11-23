<?php

namespace App\Filament\Resources\Users;

use App\Filament\Base\AdminResource;
use App\Filament\Resources\Users\Pages\CreateUser;
use App\Filament\Resources\Users\Pages\EditUser;
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Filament\Resources\Users\Schemas\UserForm;
use App\Filament\Resources\Users\Tables\UsersTable;
use App\Models\User;
use BackedEnum;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class UserResource extends AdminResource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationLabel = 'Akun Pengguna';

    protected static ?string $modelLabel = 'Akun Pengguna';

    protected static ?string $pluralModelLabel = 'Akun Pengguna';

    protected static string | UnitEnum | null $navigationGroup = 'Manajemen Akun';

    protected static ?int $navigationSort = 1;

    protected static string | BackedEnum | null $navigationIcon = Heroicon::OutlinedUsers;

    public static function form(Schema $schema): Schema
    {
        return UserForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return UsersTable::configure($table);
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
            'index' => ListUsers::route('/'),
            'create' => CreateUser::route('/create'),
            'edit' => EditUser::route('/{record}/edit'),
        ];
    }
}
