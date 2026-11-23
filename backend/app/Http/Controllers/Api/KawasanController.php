<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KuotaHarian;
use App\Models\PaketTiket;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KawasanController extends Controller
{
    public function info(Request $request): JsonResponse
    {
        $today = Carbon::today()->format('Y-m-d');
        $targetDate = $request->query('tanggal', $today);

        $hariIni = KuotaHarian::firstOrCreate(
            ['tanggal' => $targetDate],
            [
                'kuota_maksimal' => 5000,
                'kuota_terpakai' => 0,
                'status_kawasan' => 'Buka',
            ]
        );

        $kalender = KuotaHarian::whereDate('tanggal', '>=', $today)
            ->orderBy('tanggal')
            ->limit(14)
            ->get()
            ->map(fn (KuotaHarian $k) => $k->toApiArray())
            ->values();

        return response()->json([
            'success' => true,
            'data' => [
                'nama_kawasan' => 'Jelajahin Theme Park',
                'jam_buka' => '09:00',
                'jam_tutup' => '18:00',
                'hari_ini' => $hariIni->toApiArray(),
                'kalender_kuota' => $kalender,
            ],
        ]);
    }

    public function paketTiket(): JsonResponse
    {
        $paket = PaketTiket::where('is_active', true)
            ->orderBy('harga')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $paket,
        ]);
    }
}
