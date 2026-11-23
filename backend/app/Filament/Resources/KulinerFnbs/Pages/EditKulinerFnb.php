<?php

namespace App\Filament\Resources\KulinerFnbs\Pages;

use App\Filament\Resources\KulinerFnbs\KulinerFnbResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditKulinerFnb extends EditRecord
{
    protected static string $resource = KulinerFnbResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
