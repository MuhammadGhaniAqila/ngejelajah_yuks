<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => config('app.name', 'Jelajahin API'),
        'status' => 'ok',
        'admin' => url('/admin'),
        'api' => url('/api/portal-home'),
    ]);
});
