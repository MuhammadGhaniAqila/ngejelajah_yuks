<?php

namespace App\Filament\Base;

use App\Models\User;

abstract class OperatorResource extends RoleResource
{
    public static function canAccess(): bool
    {
        $user = auth()->user();

        return $user instanceof User
            && $user->isOperator()
            && (bool) ($user->is_active ?? true);
    }
}
