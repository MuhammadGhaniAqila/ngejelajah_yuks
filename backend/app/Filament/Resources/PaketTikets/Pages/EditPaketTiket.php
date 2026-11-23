<?php

namespace App\Filament\Resources\PaketTikets\Pages;

use App\Filament\Resources\PaketTikets\PaketTiketResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditPaketTiket extends EditRecord
{
    protected static string $resource = PaketTiketResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
