<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AntreanVirtual extends Model
{
    protected $fillable = [
        'user_id',
        'reservasi_id',
        'wahana_id',
        'nomor_antrean',
        'nomor_kloter',
        'estimasi_tunggu_menit',
        'status_antrean',
        'waktu_daftar',
        'waktu_selesai',
    ];

    protected function casts(): array
    {
        return [
            'nomor_kloter' => 'integer',
            'estimasi_tunggu_menit' => 'integer',
            'waktu_daftar' => 'datetime',
            'waktu_selesai' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reservasi(): BelongsTo
    {
        return $this->belongsTo(ReservasiTiket::class, 'reservasi_id');
    }

    public function wahana(): BelongsTo
    {
        return $this->belongsTo(Wahana::class);
    }
}
