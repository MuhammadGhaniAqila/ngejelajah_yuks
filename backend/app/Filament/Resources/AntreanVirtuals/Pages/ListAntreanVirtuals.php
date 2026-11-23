<?php

namespace App\Filament\Resources\AntreanVirtuals\Pages;

use App\Filament\Resources\AntreanVirtuals\AntreanVirtualResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListAntreanVirtuals extends ListRecords
{
    protected static string $resource = AntreanVirtualResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
