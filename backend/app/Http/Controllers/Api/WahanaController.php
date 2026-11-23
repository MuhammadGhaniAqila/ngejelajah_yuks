<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wahana;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WahanaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Wahana::query()
            ->withCount([
                'antreanVirtuals as jumlah_antrean_aktif' => function ($q) {
                    $q->whereIn('status_antrean', ['Menunggu', 'Dipanggil']);
                },
            ])
            ->orderBy('id');

        if ($zona = $request->query('zona')) {
            if ($zona !== 'Semua') {
                $query->where('zona', $zona);
            }
        }

        if ($crowd = $request->query('crowd')) {
            if ($crowd !== 'Semua') {
                $query->where('crowd_meter', $crowd);
            }
        }

        if ($tinggi = $request->query('tinggi')) {
            $query->where('tinggi_minimal_cm', '<=', (int) $tinggi);
        }

        if ($q = $request->query('q')) {
            $term = '%' . mb_strtolower(trim($q)) . '%';
            $query->whereRaw('LOWER(nama_wahana) LIKE ?', [$term]);
        }

        return response()->json([
            'success' => true,
            'data' => $query->get(),
        ]);
    }

    public function show(Wahana $wahana): JsonResponse
    {
        $wahana->loadCount([
            'antreanVirtuals as jumlah_antrean_aktif' => function ($q) {
                $q->whereIn('status_antrean', ['Menunggu', 'Dipanggil']);
            },
        ]);

        return response()->json([
            'success' => true,
            'data' => $wahana,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorizeOperator($request);

        $validated = $request->validate([
            'nama_wahana' => ['required', 'string', 'max:255'],
            'zona' => ['required', 'in:Ekstrem,Keluarga,Air'],
            'deskripsi' => ['required', 'string'],
            'gambar_url' => ['nullable', 'string', 'max:255'],
            'tinggi_minimal_cm' => ['required', 'integer', 'min:0', 'max:220'],
            'kategori_usia' => ['required', 'string', 'max:100'],
            'kapasitas_kloter' => ['required', 'integer', 'min:1'],
            'durasi_menit' => ['required', 'integer', 'min:1'],
            'status_lampu' => ['nullable', 'in:Hijau,Merah,Maintenance'],
            'crowd_meter' => ['nullable', 'in:Sepi,Sedang,Padat'],
        ]);

        $wahana = Wahana::create([
            ...$validated,
            'gambar_url' => $validated['gambar_url'] ?? '/photos/unit-dufan.jpg',
            'status_lampu' => $validated['status_lampu'] ?? 'Hijau',
            'crowd_meter' => $validated['crowd_meter'] ?? 'Sepi',
            'kloter_berjalan' => 1,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Wahana baru berhasil ditambahkan.',
            'data' => $wahana,
        ], 201);
    }

    public function update(Request $request, Wahana $wahana): JsonResponse
    {
        $this->authorizeOperator($request);

        $validated = $request->validate([
            'nama_wahana' => ['sometimes', 'string', 'max:255'],
            'zona' => ['sometimes', 'in:Ekstrem,Keluarga,Air'],
            'deskripsi' => ['sometimes', 'string'],
            'gambar_url' => ['sometimes', 'string', 'max:255'],
            'tinggi_minimal_cm' => ['sometimes', 'integer', 'min:0', 'max:220'],
            'kategori_usia' => ['sometimes', 'string', 'max:100'],
            'kapasitas_kloter' => ['sometimes', 'integer', 'min:1'],
            'durasi_menit' => ['sometimes', 'integer', 'min:1'],
            'status_lampu' => ['sometimes', 'in:Hijau,Merah,Maintenance'],
            'crowd_meter' => ['sometimes', 'in:Sepi,Sedang,Padat'],
            'kloter_berjalan' => ['sometimes', 'integer', 'min:1'],
        ]);

        $wahana->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data wahana berhasil diperbarui.',
            'data' => $wahana->fresh(),
        ]);
    }

    public function updateOperasional(Request $request, Wahana $wahana): JsonResponse
    {
        $this->authorizeOperator($request);

        $validated = $request->validate([
            'status_lampu' => ['sometimes', 'in:Hijau,Merah,Maintenance'],
            'crowd_meter' => ['sometimes', 'in:Sepi,Sedang,Padat'],
            'kloter_berjalan' => ['sometimes', 'integer', 'min:1'],
        ]);

        $wahana->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Status operasional wahana diperbarui.',
            'data' => $wahana->fresh(),
        ]);
    }

    public function destroy(Request $request, Wahana $wahana): JsonResponse
    {
        $this->authorizeOperator($request);

        $wahana->delete();

        return response()->json([
            'success' => true,
            'message' => 'Wahana berhasil dihapus.',
        ]);
    }

    private function authorizeOperator(Request $request): void
    {
        $role = $request->user()?->role;
        abort_unless(
            in_array($role, ['admin', 'operator'], true),
            403,
            'Akses khusus petugas operator atau admin.'
        );
    }
}
