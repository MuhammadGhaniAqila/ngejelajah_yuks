<?php

namespace App\Filament\Resources\KulinerFnbs\Pages;

use App\Filament\Resources\KulinerFnbs\KulinerFnbResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListKulinerFnbs extends ListRecords
{
    protected static string $resource = KulinerFnbResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
