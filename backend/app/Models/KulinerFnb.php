<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KulinerFnb extends Model
{
    protected $table = 'kuliner_fnbs';

    protected $fillable = [
        'nama',
        'kategori',
        'area',
        'jam_buka',
        'kisaran_harga',
        'menu_andalan',
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
