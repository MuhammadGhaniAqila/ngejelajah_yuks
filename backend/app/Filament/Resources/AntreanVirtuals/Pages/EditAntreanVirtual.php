<?php

namespace App\Filament\Resources\AntreanVirtuals\Pages;

use App\Filament\Resources\AntreanVirtuals\AntreanVirtualResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditAntreanVirtual extends EditRecord
{
    protected static string $resource = AntreanVirtualResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
