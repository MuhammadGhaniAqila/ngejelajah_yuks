<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('antrean_virtuals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('reservasi_id')->constrained('reservasi_tikets')->cascadeOnDelete();
            $table->foreignId('wahana_id')->constrained('wahanas')->cascadeOnDelete();
            $table->string('nomor_antrean', 20);
            $table->unsignedInteger('nomor_kloter');
            $table->unsignedSmallInteger('estimasi_tunggu_menit')->default(10);
            $table->string('status_antrean', 20)->default('Menunggu');
            $table->timestamp('waktu_daftar');
            $table->timestamp('waktu_selesai')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('antrean_virtuals');
    }
};
