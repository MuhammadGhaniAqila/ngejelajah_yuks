<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AntreanVirtual;
use App\Models\ReservasiTiket;
use App\Models\Wahana;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AntreanVirtualController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $list = AntreanVirtual::with('wahana')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('waktu_daftar')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $list,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'wahana_id' => ['required', 'exists:wahanas,id'],
        ]);

        $user = $request->user();
        $wahana = Wahana::findOrFail($validated['wahana_id']);

        if ($wahana->status_lampu === 'Maintenance') {
            return response()->json([
                'success' => false,
                'message' => 'Wahana sedang dalam pemeliharaan (Maintenance) dan tidak membuka antrean.',
            ], 422);
        }

        $reservasiAktif = ReservasiTiket::with('paket')
            ->where('user_id', $user->id)
            ->where('status_pembayaran', 'Lunas')
            ->where('status_kunjungan', 'Aktif di Kawasan')
            ->latest('id')
            ->first();

        if (! $reservasiAktif) {
            return response()->json([
                'success' => false,
                'message' => 'Kamu belum memiliki tiket yang aktif di kawasan. Pesan tiket dan lakukan validasi check-in di gerbang (atau Panel Operator) terlebih dahulu.',
            ], 422);
        }

        $existingOnRide = AntreanVirtual::where('user_id', $user->id)
            ->where('wahana_id', $wahana->id)
            ->whereIn('status_antrean', ['Menunggu', 'Dipanggil'])
            ->first();

        if ($existingOnRide) {
            return response()->json([
                'success' => false,
                'message' => "Kamu sudah memiliki antrean aktif ({$existingOnRide->nomor_antrean}) di wahana ini.",
            ], 422);
        }

        $activeCount = AntreanVirtual::where('user_id', $user->id)
            ->whereIn('status_antrean', ['Menunggu', 'Dipanggil'])
            ->count();

        $jatahMax = $reservasiAktif->paket?->jatah_antrean_aktif ?? 2;
        if ($activeCount >= $jatahMax) {
            return response()->json([
                'success' => false,
                'message' => "Batas maksimal paketmu adalah {$jatahMax} antrean virtual aktif secara bersamaan.",
            ], 422);
        }

        $antrean = DB::transaction(function () use ($user, $wahana, $reservasiAktif) {
            $waitingCount = AntreanVirtual::where('wahana_id', $wahana->id)
                ->whereIn('status_antrean', ['Menunggu', 'Dipanggil'])
                ->lockForUpdate()
                ->count();

            $totalCountToday = AntreanVirtual::where('wahana_id', $wahana->id)->count();
            $prefix = strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $wahana->nama_wahana), 0, 1) ?: 'W');
            $nomorAntrean = sprintf('#%s-%03d', $prefix, $totalCountToday + 1);

            $kapasitas = max(1, $wahana->kapasitas_kloter);
            $offsetKloter = (int) floor($waitingCount / $kapasitas) + 1;
            $nomorKloter = $wahana->kloter_berjalan + $offsetKloter;
            $estimasiTunggu = max($wahana->durasi_menit, $offsetKloter * $wahana->durasi_menit);

            $created = AntreanVirtual::create([
                'user_id' => $user->id,
                'reservasi_id' => $reservasiAktif->id,
                'wahana_id' => $wahana->id,
                'nomor_antrean' => $nomorAntrean,
                'nomor_kloter' => $nomorKloter,
                'estimasi_tunggu_menit' => $estimasiTunggu,
                'status_antrean' => 'Menunggu',
                'waktu_daftar' => now(),
            ]);

            $wahana->syncCrowdMeter();

            return $created;
        });

        $antrean->load('wahana');

        return response()->json([
            'success' => true,
            'message' => 'Nomor antrean virtual berhasil diambil.',
            'data' => $antrean,
        ], 201);
    }

    public function batal(Request $request, AntreanVirtual $antrean): JsonResponse
    {
        if ($antrean->user_id !== $request->user()->id) {
            abort(403, 'Kamu tidak berhak mengubah antrean pengguna lain.');
        }

        if ($antrean->status_antrean !== 'Menunggu') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya antrean berstatus Menunggu yang dapat dibatalkan.',
            ], 422);
        }

        $antrean->update([
            'status_antrean' => 'Dibatalkan',
            'waktu_selesai' => now(),
        ]);

        $antrean->wahana?->syncCrowdMeter();

        return response()->json([
            'success' => true,
            'message' => 'Antrean virtual berhasil dibatalkan.',
            'data' => $antrean->fresh('wahana'),
        ]);
    }

    public function panggilKloter(Request $request, Wahana $wahana): JsonResponse
    {
        $role = $request->user()?->role;
        abort_unless(
            in_array($role, ['admin', 'operator'], true),
            403,
            'Akses khusus petugas operator atau admin.'
        );

        DB::transaction(function () use ($wahana) {
            $wahana->antreanVirtuals()
                ->where('status_antrean', 'Dipanggil')
                ->update([
                    'status_antrean' => 'Selesai',
                    'waktu_selesai' => now(),
                ]);

            $nextKloter = $wahana->kloter_berjalan + 1;
            $wahana->update([
                'kloter_berjalan' => $nextKloter,
                'status_lampu' => 'Hijau',
            ]);

            $wahana->antreanVirtuals()
                ->where('status_antrean', 'Menunggu')
                ->where('nomor_kloter', '<=', $nextKloter)
                ->update(['status_antrean' => 'Dipanggil']);

            $wahana->syncCrowdMeter();
        });

        return response()->json([
            'success' => true,
            'message' => 'Kloter berikutnya berhasil dipanggil.',
            'data' => $wahana->fresh(),
        ]);
    }
}
