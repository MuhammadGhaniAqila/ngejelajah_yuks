<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wahana extends Model
{
    protected $fillable = [
        'nama_wahana',
        'zona',
        'deskripsi',
        'gambar_url',
        'tinggi_minimal_cm',
        'kategori_usia',
        'kapasitas_kloter',
        'durasi_menit',
        'status_lampu',
        'crowd_meter',
        'kloter_berjalan',
    ];

    protected function casts(): array
    {
        return [
            'tinggi_minimal_cm' => 'integer',
            'kapasitas_kloter' => 'integer',
            'durasi_menit' => 'integer',
            'kloter_berjalan' => 'integer',
        ];
    }

    public function antreanVirtuals(): HasMany
    {
        return $this->hasMany(AntreanVirtual::class);
    }

    public function syncCrowdMeter(): void
    {
        $waiting = $this->antreanVirtuals()
            ->whereIn('status_antrean', ['Menunggu', 'Dipanggil'])
            ->count();

        if ($waiting >= 12) {
            $this->crowd_meter = 'Padat';
        } elseif ($waiting >= 4) {
            $this->crowd_meter = 'Sedang';
        } else {
            $this->crowd_meter = 'Sepi';
        }

        $this->save();
    }
}
