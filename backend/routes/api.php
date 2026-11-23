<?php

use App\Http\Controllers\Api\AntreanVirtualController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\KawasanController;
use App\Http\Controllers\Api\PortalController;
use App\Http\Controllers\Api\ReservasiController;
use App\Http\Controllers\Api\WahanaController;
use Illuminate\Support\Facades\Route;

// Public endpoints (Kawasan, Paket Tiket, Daftar Wahana & Konten Portal)
Route::get('/kawasan', [KawasanController::class, 'info']);
Route::get('/portal-home', [PortalController::class, 'home']);
Route::get('/paket-tiket', [KawasanController::class, 'paketTiket']);
Route::get('/wahana', [WahanaController::class, 'index']);
Route::get('/wahana/{wahana}', [WahanaController::class, 'show']);
Route::get('/promo', [PortalController::class, 'promos']);
Route::get('/acara', [PortalController::class, 'acaras']);
Route::get('/venue', [PortalController::class, 'venues']);
Route::get('/kuliner', [PortalController::class, 'kuliners']);
Route::get('/blog', [PortalController::class, 'blogs']);

// Authentication
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected endpoints (Wisatawan & Operator/Admin via Sanctum Bearer Token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Wisatawan: Reservasi Tiket & Antrean Virtual
    Route::get('/reservasi/saya', [ReservasiController::class, 'index']);
    Route::post('/reservasi', [ReservasiController::class, 'store']);

    Route::get('/antrean/saya', [AntreanVirtualController::class, 'index']);
    Route::post('/antrean', [AntreanVirtualController::class, 'store']);
    Route::patch('/antrean/{antrean}/batal', [AntreanVirtualController::class, 'batal']);

    // Operator & Admin endpoints
    Route::post('/operator/check-in', [ReservasiController::class, 'checkIn']);
    Route::post('/wahana', [WahanaController::class, 'store']);
    Route::put('/wahana/{wahana}', [WahanaController::class, 'update']);
    Route::patch('/wahana/{wahana}/operasional', [WahanaController::class, 'updateOperasional']);
    Route::delete('/wahana/{wahana}', [WahanaController::class, 'destroy']);
    Route::post('/operator/wahana/{wahana}/panggil-kloter', [AntreanVirtualController::class, 'panggilKloter']);
});
