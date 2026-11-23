<?php

namespace App\Filament\Resources\Wahanas\Pages;

use App\Filament\Resources\Wahanas\WahanaResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditWahana extends EditRecord
{
    protected static string $resource = WahanaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
