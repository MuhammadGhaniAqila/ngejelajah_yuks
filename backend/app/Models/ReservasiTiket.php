<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReservasiTiket extends Model
{
    protected $fillable = [
        'user_id',
        'paket_id',
        'tanggal_kunjungan',
        'jumlah_tiket',
        'total_harga',
        'metode_pembayaran',
        'kode_booking',
        'qr_token',
        'status_pembayaran',
        'status_kunjungan',
        'waktu_checkin',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_kunjungan' => 'date:Y-m-d',
            'jumlah_tiket' => 'integer',
            'total_harga' => 'integer',
            'waktu_checkin' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function paket(): BelongsTo
    {
        return $this->belongsTo(PaketTiket::class, 'paket_id');
    }

    public function antreanVirtuals(): HasMany
    {
        return $this->hasMany(AntreanVirtual::class, 'reservasi_id');
    }
}
