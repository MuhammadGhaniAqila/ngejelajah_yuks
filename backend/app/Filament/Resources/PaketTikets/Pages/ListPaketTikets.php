<?php

namespace App\Filament\Resources\PaketTikets\Pages;

use App\Filament\Resources\PaketTikets\PaketTiketResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPaketTikets extends ListRecords
{
    protected static string $resource = PaketTiketResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
