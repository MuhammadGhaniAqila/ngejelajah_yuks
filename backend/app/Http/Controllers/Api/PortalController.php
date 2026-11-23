<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Acara;
use App\Models\BlogPost;
use App\Models\KulinerFnb;
use App\Models\KuotaHarian;
use App\Models\PaketTiket;
use App\Models\Promo;
use App\Models\Venue;
use App\Models\Wahana;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PortalController extends Controller
{
    public function home(): JsonResponse
    {
        $today = Carbon::today()->format('Y-m-d');
        $hariIni = KuotaHarian::firstOrCreate(
            ['tanggal' => $today],
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

        $wahana = Wahana::query()
            ->withCount([
                'antreanVirtuals as jumlah_antrean_aktif' => function ($q) {
                    $q->whereIn('status_antrean', ['Menunggu', 'Dipanggil']);
                },
            ])
            ->orderBy('id')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'kawasan' => [
                    'nama_kawasan' => 'Jelajahin Theme Park',
                    'jam_buka' => '09:00',
                    'jam_tutup' => '18:00',
                    'hari_ini' => $hariIni->toApiArray(),
                    'kalender_kuota' => $kalender,
                ],
                'paket_tiket' => PaketTiket::where('is_active', true)->orderBy('harga')->get(),
                'wahana' => $wahana,
                'promo' => Promo::where('is_active', true)->orderBy('id')->get(),
                'acara' => Acara::where('is_active', true)->orderBy('id')->get(),
                'venue' => Venue::where('is_active', true)->orderBy('id')->get(),
                'kuliner' => KulinerFnb::where('is_active', true)->orderBy('id')->get(),
                'blog' => BlogPost::where('is_published', true)
                    ->orderBy('id')
                    ->get()
                    ->map(fn (BlogPost $post) => $post->toApiArray())
                    ->values(),
            ],
        ]);
    }

    public function promos(Request $request): JsonResponse
    {
        $query = Promo::where('is_active', true)->orderBy('id');

        if (($kategori = $request->query('kategori')) && $kategori !== 'Semua') {
            $query->where('kategori', $kategori);
        }

        return response()->json([
            'success' => true,
            'data' => $query->get(),
        ]);
    }

    public function acaras(Request $request): JsonResponse
    {
        $query = Acara::where('is_active', true)->orderBy('id');

        if (($kategori = $request->query('kategori')) && $kategori !== 'Semua') {
            $query->where('kategori', $kategori);
        }

        return response()->json([
            'success' => true,
            'data' => $query->get(),
        ]);
    }

    public function venues(Request $request): JsonResponse
    {
        $query = Venue::where('is_active', true)->orderBy('id');

        if (($kategori = $request->query('kategori')) && $kategori !== 'Semua') {
            $query->where('kategori', $kategori);
        }

        return response()->json([
            'success' => true,
            'data' => $query->get(),
        ]);
    }

    public function kuliners(Request $request): JsonResponse
    {
        $query = KulinerFnb::where('is_active', true)->orderBy('id');

        if (($kategori = $request->query('kategori')) && $kategori !== 'Semua') {
            $query->where('kategori', $kategori);
        }

        return response()->json([
            'success' => true,
            'data' => $query->get(),
        ]);
    }

    public function blogs(Request $request): JsonResponse
    {
        $query = BlogPost::where('is_published', true)->orderBy('id');

        if (($kategori = $request->query('kategori')) && $kategori !== 'Semua') {
            $query->where('kategori', $kategori);
        }

        return response()->json([
            'success' => true,
            'data' => $query->get()->map(fn (BlogPost $post) => $post->toApiArray())->values(),
        ]);
    }
}
