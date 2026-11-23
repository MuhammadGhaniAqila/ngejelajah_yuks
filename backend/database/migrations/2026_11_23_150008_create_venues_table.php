<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('venues', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('kategori', 60);
            $table->string('area');
            $table->string('harga_mulai', 100);
            $table->string('fasilitas');
            $table->text('ringkasan');
            $table->string('gambar_url')->default('/photos/resort-kuliner.jpg');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('venues');
    }
};
