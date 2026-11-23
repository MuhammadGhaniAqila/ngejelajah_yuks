<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    protected $table = 'blog_posts';

    protected $fillable = [
        'judul',
        'kategori',
        'tanggal_terbit',
        'waktu_baca',
        'ringkasan',
        'isi',
        'gambar_url',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'isi' => 'array',
            'is_published' => 'boolean',
        ];
    }

    public function toApiArray(): array
    {
        return [
            'id' => $this->id,
            'judul' => $this->judul,
            'kategori' => $this->kategori,
            'tanggal' => $this->tanggal_terbit,
            'tanggal_terbit' => $this->tanggal_terbit,
            'waktu_baca' => $this->waktu_baca,
            'ringkasan' => $this->ringkasan,
            'isi' => $this->isi ?? [],
            'gambar_url' => $this->gambar_url,
            'is_published' => $this->is_published,
        ];
    }
}
