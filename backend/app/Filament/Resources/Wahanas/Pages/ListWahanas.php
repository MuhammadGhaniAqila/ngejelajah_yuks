<?php

namespace App\Filament\Resources\Wahanas\Pages;

use App\Filament\Resources\Wahanas\WahanaResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListWahanas extends ListRecords
{
    protected static string $resource = WahanaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
