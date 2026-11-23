<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KuotaHarian extends Model
{
    protected $fillable = [
        'tanggal',
        'kuota_maksimal',
        'kuota_terpakai',
        'status_kawasan',
    ];

    protected function casts(): array
    {
        return [
            'tanggal' => 'date:Y-m-d',
            'kuota_maksimal' => 'integer',
            'kuota_terpakai' => 'integer',
        ];
    }

    public function getSisaKuotaAttribute(): int
    {
        return max(0, $this->kuota_maksimal - $this->kuota_terpakai);
    }

    public function toApiArray(): array
    {
        return [
            'tanggal' => $this->tanggal->format('Y-m-d'),
            'kuota_maksimal' => $this->kuota_maksimal,
            'kuota_terpakai' => $this->kuota_terpakai,
            'sisa_kuota' => $this->sisa_kuota,
            'status_kawasan' => $this->status_kawasan,
        ];
    }
}
