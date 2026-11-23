<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KuotaHarian;
use App\Models\PaketTiket;
use App\Models\ReservasiTiket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ReservasiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $reservasi = ReservasiTiket::with('paket')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $reservasi,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'paket_id' => ['required', 'exists:paket_tikets,id'],
            'tanggal_kunjungan' => ['required', 'date', 'after_or_equal:today'],
            'jumlah_tiket' => ['required', 'integer', 'min:1', 'max:10'],
            'metode_pembayaran' => ['required', 'string', 'max:50'],
        ], [
            'tanggal_kunjungan.after_or_equal' => 'Tanggal kunjungan tidak boleh di masa lalu.',
        ]);

        $paket = PaketTiket::where('id', $validated['paket_id'])
            ->where('is_active', true)
            ->firstOrFail();

        $reservasi = DB::transaction(function () use ($request, $validated, $paket) {
            $kuota = KuotaHarian::whereDate('tanggal', $validated['tanggal_kunjungan'])
                ->lockForUpdate()
                ->first();

            if (! $kuota) {
                $kuota = KuotaHarian::create([
                    'tanggal' => $validated['tanggal_kunjungan'],
                    'kuota_maksimal' => 5000,
                    'kuota_terpakai' => 0,
                    'status_kawasan' => 'Buka',
                ]);
            }

            if ($kuota->status_kawasan !== 'Buka') {
                abort(422, 'Kawasan tutup pada tanggal yang dipilih.');
            }

            if ($kuota->sisa_kuota < $validated['jumlah_tiket']) {
                abort(422, 'Sisa kuota harian pada tanggal tersebut tidak mencukupi.');
            }

            $kuota->increment('kuota_terpakai', $validated['jumlah_tiket']);

            $datePart = str_replace('-', '', $validated['tanggal_kunjungan']);
            $suffix = strtoupper(Str::random(4));
            $kodeBooking = "JLJ-{$datePart}-{$suffix}";
            $qrToken = 'JLJ-QR-' . strtoupper(Str::random(12));

            return ReservasiTiket::create([
                'user_id' => $request->user()->id,
                'paket_id' => $paket->id,
                'tanggal_kunjungan' => $validated['tanggal_kunjungan'],
                'jumlah_tiket' => $validated['jumlah_tiket'],
                'total_harga' => $paket->harga * $validated['jumlah_tiket'],
                'metode_pembayaran' => $validated['metode_pembayaran'],
                'kode_booking' => $kodeBooking,
                'qr_token' => $qrToken,
                'status_pembayaran' => 'Lunas',
                'status_kunjungan' => 'Belum Check-in',
            ]);
        });

        $reservasi->load('paket');

        return response()->json([
            'success' => true,
            'message' => 'Tiket berhasil dipesan dan E-Ticket QR telah terbit.',
            'data' => $reservasi,
        ], 201);
    }

    public function checkIn(Request $request): JsonResponse
    {
        $role = $request->user()?->role;
        abort_unless(
            in_array($role, ['admin', 'operator'], true),
            403,
            'Hanya petugas operator/admin yang dapat melakukan validasi gerbang.'
        );

        $validated = $request->validate([
            'kode' => ['required', 'string'],
        ]);

        $kode = trim($validated['kode']);
        $reservasi = ReservasiTiket::with(['user', 'paket'])
            ->where('qr_token', $kode)
            ->orWhere('kode_booking', $kode)
            ->first();

        if (! $reservasi) {
            return response()->json([
                'success' => false,
                'message' => 'Tiket tidak ditemukan untuk kode tersebut.',
            ], 404);
        }

        if ($reservasi->status_pembayaran !== 'Lunas') {
            return response()->json([
                'success' => false,
                'message' => 'Pembayaran tiket belum lunas.',
            ], 422);
        }

        $reservasi->update([
            'status_kunjungan' => 'Aktif di Kawasan',
            'waktu_checkin' => $reservasi->waktu_checkin ?? now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Check-in gerbang berhasil. Tiket aktif di kawasan.',
            'data' => $reservasi->fresh(['user', 'paket']),
        ]);
    }
}
