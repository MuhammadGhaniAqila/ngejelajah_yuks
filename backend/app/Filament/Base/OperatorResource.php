<?php

namespace App\Filament\Base;

use App\Models\User;

abstract class OperatorResource extends RoleResource
{
    public static function canAccess(): bool
    {
        $user = auth()->user();

        return $user instanceof User
            && $user->isStaff()
            && (bool) ($user->is_active ?? true);
    }
}
