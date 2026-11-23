<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Acara extends Model
{
    protected $fillable = [
        'judul',
        'kategori',
        'lokasi',
        'jadwal',
        'jam',
        'ringkasan',
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
