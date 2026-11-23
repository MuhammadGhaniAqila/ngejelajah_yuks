<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('acaras', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('kategori', 60);
            $table->string('lokasi');
            $table->string('jadwal', 100);
            $table->string('jam', 60);
            $table->text('ringkasan');
            $table->string('gambar_url')->default('/photos/unit-wahana.jpg');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('acaras');
    }
};
