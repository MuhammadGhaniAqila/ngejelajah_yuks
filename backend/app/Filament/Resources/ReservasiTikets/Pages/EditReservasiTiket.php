<?php

namespace App\Filament\Resources\ReservasiTikets\Pages;

use App\Filament\Resources\ReservasiTikets\ReservasiTiketResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditReservasiTiket extends EditRecord
{
    protected static string $resource = ReservasiTiketResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
