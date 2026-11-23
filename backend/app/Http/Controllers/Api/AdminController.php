<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AntreanVirtual;
use App\Models\KuotaHarian;
use App\Models\ReservasiTiket;
use App\Models\Wahana;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function overview(Request $request): JsonResponse
    {
        $this->authorizeStaff($request);

        $today = Carbon::today()->format('Y-m-d');
        $hariIni = KuotaHarian::firstOrCreate(
            ['tanggal' => $today],
            [
                'kuota_maksimal' => 5000,
                'kuota_terpakai' => 0,
                'status_kawasan' => 'Buka',
            ]
        );

        $kalenderKuota = KuotaHarian::whereDate('tanggal', '>=', $today)
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

        $reservasiTerbaru = ReservasiTiket::with([
            'user:id,name,email,no_wa',
            'paket:id,nama_paket,jatah_antrean_aktif',
        ])
            ->latest('id')
            ->limit(25)
            ->get()
            ->map(fn (ReservasiTiket $r) => [
                'id' => $r->id,
                'kode_booking' => $r->kode_booking,
                'qr_token' => $r->qr_token,
                'tanggal_kunjungan' => $r->tanggal_kunjungan?->format('Y-m-d') ?? $today,
                'jumlah_tiket' => $r->jumlah_tiket,
                'total_harga' => $r->total_harga,
                'metode_pembayaran' => $r->metode_pembayaran,
                'status_pembayaran' => $r->status_pembayaran,
                'status_kunjungan' => $r->status_kunjungan,
                'waktu_checkin' => $r->waktu_checkin?->format('d M Y H:i'),
                'pengunjung_nama' => $r->user?->name ?? 'Pengunjung',
                'pengunjung_email' => $r->user?->email ?? '-',
                'nama_paket' => $r->paket?->nama_paket ?? '-',
            ])
            ->values();

        $antreanAktifList = AntreanVirtual::with([
            'user:id,name,email',
            'wahana:id,nama_wahana,zona',
        ])
            ->whereIn('status_antrean', ['Menunggu', 'Dipanggil'])
            ->orderByDesc('waktu_daftar')
            ->limit(30)
            ->get()
            ->map(fn (AntreanVirtual $a) => [
                'id' => $a->id,
                'nomor_antrean' => $a->nomor_antrean,
                'nomor_kloter' => $a->nomor_kloter,
                'estimasi_tunggu_menit' => $a->estimasi_tunggu_menit,
                'status_antrean' => $a->status_antrean,
                'pengunjung_nama' => $a->user?->name ?? 'Pengunjung',
                'nama_wahana' => $a->wahana?->nama_wahana ?? '-',
                'zona' => $a->wahana?->zona ?? '-',
            ])
            ->values();

        $totalTiketTerjual = (int) ReservasiTiket::where('status_pembayaran', 'Lunas')->sum('jumlah_tiket');
        $totalPendapatan = (int) ReservasiTiket::where('status_pembayaran', 'Lunas')->sum('total_harga');
        $tiketAktifKawasan = ReservasiTiket::where('status_kunjungan', 'Aktif di Kawasan')->count();
        $antreanAktif = AntreanVirtual::whereIn('status_antrean', ['Menunggu', 'Dipanggil'])->count();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'kuota_hari_ini' => $hariIni->toApiArray(),
                    'total_tiket_terjual' => $totalTiketTerjual,
                    'total_pendapatan' => $totalPendapatan,
                    'tiket_aktif_kawasan' => $tiketAktifKawasan,
                    'antrean_aktif' => $antreanAktif,
                    'wahana_hijau' => $wahana->where('status_lampu', 'Hijau')->count(),
                    'wahana_merah' => $wahana->where('status_lampu', 'Merah')->count(),
                    'wahana_maintenance' => $wahana->where('status_lampu', 'Maintenance')->count(),
                ],
                'wahana' => $wahana,
                'reservasi_terbaru' => $reservasiTerbaru,
                'antrean_aktif_list' => $antreanAktifList,
                'kalender_kuota' => $kalenderKuota,
            ],
        ]);
    }

    public function updateKuota(Request $request, string $tanggal): JsonResponse
    {
        $this->authorizeStaff($request);

        $validated = $request->validate([
            'kuota_maksimal' => ['required', 'integer', 'min:1', 'max:50000'],
            'status_kawasan' => ['required', 'in:Buka,Tutup'],
        ]);

        $kuota = KuotaHarian::updateOrCreate(
            ['tanggal' => $tanggal],
            [
                'kuota_maksimal' => $validated['kuota_maksimal'],
                'status_kawasan' => $validated['status_kawasan'],
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Kuota harian berhasil diperbarui.',
            'data' => $kuota->fresh()->toApiArray(),
        ]);
    }

    private function authorizeStaff(Request $request): void
    {
        $role = $request->user()?->role;
        abort_unless(
            in_array($role, ['admin', 'operator'], true),
            403,
            'Akses khusus petugas admin atau operator.'
        );
    }
}
