<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaketTiket extends Model
{
    protected $fillable = [
        'nama_paket',
        'deskripsi',
        'harga',
        'jatah_antrean_aktif',
        'is_bundle',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'harga' => 'integer',
            'jatah_antrean_aktif' => 'integer',
            'is_bundle' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function reservasiTikets(): HasMany
    {
        return $this->hasMany(ReservasiTiket::class, 'paket_id');
    }
}
