<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kuota_harians', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal')->unique();
            $table->unsignedInteger('kuota_maksimal')->default(5000);
            $table->unsignedInteger('kuota_terpakai')->default(0);
            $table->string('status_kawasan', 20)->default('Buka');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kuota_harians');
    }
};
