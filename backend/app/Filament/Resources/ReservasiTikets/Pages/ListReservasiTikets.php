<?php

namespace App\Filament\Resources\ReservasiTikets\Pages;

use App\Filament\Resources\ReservasiTikets\ReservasiTiketResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListReservasiTikets extends ListRecords
{
    protected static string $resource = ReservasiTiketResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
