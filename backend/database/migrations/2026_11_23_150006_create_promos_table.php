<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promos', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('kategori', 60);
            $table->string('diskon_badge', 60);
            $table->string('periode', 100);
            $table->string('kode_promo', 50);
            $table->text('ringkasan');
            $table->text('ketentuan');
            $table->string('gambar_url')->default('/photos/hero-jelajahin.jpg');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promos');
    }
};
