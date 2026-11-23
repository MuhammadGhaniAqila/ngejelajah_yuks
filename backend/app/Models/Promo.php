<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promo extends Model
{
    protected $fillable = [
        'judul',
        'kategori',
        'diskon_badge',
        'periode',
        'kode_promo',
        'ringkasan',
        'ketentuan',
        'gambar_url',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
