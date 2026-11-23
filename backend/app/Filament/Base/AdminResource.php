<?php

namespace App\Filament\Base;

use App\Models\User;

abstract class AdminResource extends RoleResource
{
    public static function canAccess(): bool
    {
        $user = auth()->user();

        return $user instanceof User
            && $user->isAdmin()
            && (bool) ($user->is_active ?? true);
    }
}
