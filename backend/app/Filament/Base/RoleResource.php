<?php

namespace App\Filament\Base;

use Filament\Facades\Filament;
use Filament\Navigation\NavigationItem;
use Filament\Resources\Resource;

abstract class RoleResource extends Resource
{
    public static function registerNavigationItems(): void
    {
        if (filled(static::getCluster())) {
            return;
        }

        if (! static::shouldRegisterNavigation()) {
            return;
        }

        if (static::getParentResourceRegistration()) {
            return;
        }

        Filament::getCurrentOrDefaultPanel()
            ->navigationItems(static::getNavigationItems());
    }

    /**
     * @return array<NavigationItem>
     */
    public static function getNavigationItems(): array
    {
        return array_map(
            fn (NavigationItem $item): NavigationItem => $item->visible(static::canAccess(...)),
            parent::getNavigationItems(),
        );
    }
}
