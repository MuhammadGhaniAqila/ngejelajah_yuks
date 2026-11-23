<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('kategori', 60);
            $table->string('tanggal_terbit', 60);
            $table->string('waktu_baca', 40);
            $table->text('ringkasan');
            $table->json('isi');
            $table->string('gambar_url')->default('/photos/hero-ancol.jpg');
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blog_posts');
    }
};
