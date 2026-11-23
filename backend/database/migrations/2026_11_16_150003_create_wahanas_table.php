<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wahanas', function (Blueprint $table) {
            $table->id();
            $table->string('nama_wahana');
            $table->string('zona', 30);
            $table->text('deskripsi');
            $table->string('gambar_url')->default('/images/rides/bianglala.svg');
            $table->unsignedSmallInteger('tinggi_minimal_cm')->default(0);
            $table->string('kategori_usia')->default('Semua Usia');
            $table->unsignedSmallInteger('kapasitas_kloter')->default(24);
            $table->unsignedSmallInteger('durasi_menit')->default(5);
            $table->string('status_lampu', 20)->default('Hijau');
            $table->string('crowd_meter', 20)->default('Sepi');
            $table->unsignedInteger('kloter_berjalan')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wahanas');
    }
};
