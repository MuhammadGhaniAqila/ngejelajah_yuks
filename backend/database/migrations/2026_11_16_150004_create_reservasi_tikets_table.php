<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservasi_tikets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('paket_id')->constrained('paket_tikets')->restrictOnDelete();
            $table->date('tanggal_kunjungan');
            $table->unsignedSmallInteger('jumlah_tiket');
            $table->unsignedInteger('total_harga');
            $table->string('metode_pembayaran', 50)->default('QRIS Instan');
            $table->string('kode_booking', 40)->unique();
            $table->string('qr_token', 80)->unique();
            $table->string('status_pembayaran', 20)->default('Lunas');
            $table->string('status_kunjungan', 30)->default('Belum Check-in');
            $table->timestamp('waktu_checkin')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservasi_tikets');
    }
};
