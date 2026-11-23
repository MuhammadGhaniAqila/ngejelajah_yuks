<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\LoginTracker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'nik' => ['required', 'digits:16'],
            'no_wa' => ['required', 'string', 'min:9', 'max:20'],
        ], [
            'email.unique' => 'Email tersebut sudah terdaftar.',
            'nik.digits' => 'NIK harus tepat 16 digit angka.',
            'password.min' => 'Kata sandi minimal 8 karakter.',
        ]);

        $user = User::create([
            'name' => $validated['nama_lengkap'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'nik' => $validated['nik'],
            'no_wa' => $validated['no_wa'],
            'role' => 'wisatawan',
            'is_active' => true,
        ]);

        $token = $user->createToken('jelajahin-client')->plainTextToken;
        LoginTracker::recordSuccess($user, 'API Registrasi', $request);

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran akun berhasil.',
            'data' => [
                'token' => $token,
                'user' => $user->fresh()->toApiArray(),
            ],
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            LoginTracker::recordFailure($user, $validated['email'], 'API Web', 'Gagal', $request);

            return response()->json([
                'success' => false,
                'message' => 'Email atau kata sandi tidak sesuai.',
            ], 401);
        }

        if (! ($user->is_active ?? true)) {
            LoginTracker::recordFailure($user, $user->email, 'API Web', 'Ditolak', $request);

            return response()->json([
                'success' => false,
                'message' => 'Akun Anda sedang dinonaktifkan oleh Admin.',
            ], 403);
        }

        $token = $user->createToken('jelajahin-client')->plainTextToken;
        LoginTracker::recordSuccess($user, 'API Web', $request);

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'data' => [
                'token' => $token,
                'user' => $user->fresh()->toApiArray(),
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()->toApiArray(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil keluar dari akun.',
        ]);
    }
}
