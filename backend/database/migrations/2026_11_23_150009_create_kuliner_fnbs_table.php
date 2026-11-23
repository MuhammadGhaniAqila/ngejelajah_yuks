<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kuliner_fnbs', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('kategori', 60);
            $table->string('area');
            $table->string('jam_buka', 60);
            $table->string('kisaran_harga', 100);
            $table->string('menu_andalan');
            $table->string('gambar_url')->default('/photos/resort-kuliner.jpg');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kuliner_fnbs');
    }
};
