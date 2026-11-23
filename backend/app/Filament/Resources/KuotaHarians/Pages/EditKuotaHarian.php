<?php

namespace App\Filament\Resources\KuotaHarians\Pages;

use App\Filament\Resources\KuotaHarians\KuotaHarianResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditKuotaHarian extends EditRecord
{
    protected static string $resource = KuotaHarianResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
