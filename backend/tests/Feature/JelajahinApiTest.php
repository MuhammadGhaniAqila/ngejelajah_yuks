<?php

namespace Tests\Feature;

use App\Models\KuotaHarian;
use App\Models\LoginLog;
use App\Models\PaketTiket;
use App\Models\User;
use App\Models\Wahana;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class JelajahinApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_public_endpoints_and_filament_login_work(): void
    {
        $this->getJson('/api/kawasan')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.nama_kawasan', 'Jelajahin Theme Park');

        $this->getJson('/api/paket-tiket')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->getJson('/api/wahana')
            ->assertOk()
            ->assertJsonCount(6, 'data');

        // Filter tinggi badan 110 cm harus mengecualikan wahana minimal 125 cm
        $this->getJson('/api/wahana?tinggi=110')
            ->assertOk()
            ->assertJsonCount(4, 'data');

        // Portal content endpoints (Promo, Acara, Venue, Kuliner, Blog)
        $this->getJson('/api/promo')->assertOk()->assertJsonCount(4, 'data');
        $this->getJson('/api/acara')->assertOk()->assertJsonCount(4, 'data');
        $this->getJson('/api/venue')->assertOk()->assertJsonCount(4, 'data');
        $this->getJson('/api/kuliner')->assertOk()->assertJsonCount(4, 'data');
        $this->getJson('/api/blog')->assertOk()->assertJsonCount(3, 'data');
        $portalRes = $this->getJson('/api/portal-home')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(6, 'data.wahana')
            ->assertJsonCount(4, 'data.promo');

        $portalJson = strtolower((string) $portalRes->getContent());
        $this->assertStringNotContainsString('dufan', $portalJson);
        $this->assertStringNotContainsString('ancol', $portalJson);

        // Filament /admin/login page renders cleanly
        $this->get('/admin/login')->assertOk();
    }

    public function test_full_ticketing_checkin_and_virtual_queue_flow(): void
    {
        $regRes = $this->postJson('/api/auth/register', [
            'nama_lengkap' => 'Siti Lestari',
            'email' => 'siti@example.com',
            'password' => 'password123',
            'nik' => '3302011205080099',
            'no_wa' => '081299998888',
        ])->assertCreated();

        $userToken = $regRes->json('data.token');
        $paket = PaketTiket::firstOrFail();
        $wahana = Wahana::where('status_lampu', 'Hijau')->firstOrFail();
        $today = now()->format('Y-m-d');
        $kuotaBefore = KuotaHarian::whereDate('tanggal', $today)->firstOrFail()->kuota_terpakai;

        // 1. Pesan tiket
        $bookingRes = $this->withToken($userToken)
            ->postJson('/api/reservasi', [
                'paket_id' => $paket->id,
                'tanggal_kunjungan' => $today,
                'jumlah_tiket' => 2,
                'metode_pembayaran' => 'QRIS Instan',
            ])
            ->assertCreated();

        $qrToken = $bookingRes->json('data.qr_token');
        $this->assertEquals($kuotaBefore + 2, KuotaHarian::whereDate('tanggal', $today)->firstOrFail()->kuota_terpakai);

        // 2. Belum check-in -> ambil antrean harus ditolak 422
        $this->withToken($userToken)
            ->postJson('/api/antrean', ['wahana_id' => $wahana->id])
            ->assertStatus(422);

        // 3. Operator validasi check-in (reset cached sanctum guard in same test case)
        $this->app['auth']->forgetGuards();
        $operator = User::where('role', 'operator')->firstOrFail();
        $opToken = $operator->createToken('op-test')->plainTextToken;

        $this->withToken($opToken)
            ->postJson('/api/operator/check-in', ['kode' => $qrToken])
            ->assertOk()
            ->assertJsonPath('data.status_kunjungan', 'Aktif di Kawasan');

        // 3b. Verifikasi RBAC Dashboard Admin (/api/admin/overview & kuota)
        $this->app['auth']->forgetGuards();
        $this->withToken($userToken)
            ->getJson('/api/admin/overview')
            ->assertStatus(403);

        $this->app['auth']->forgetGuards();
        $this->withToken($opToken)
            ->getJson('/api/admin/overview')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(6, 'data.wahana');

        $this->withToken($opToken)
            ->patchJson("/api/admin/kuota/{$today}", [
                'kuota_maksimal' => 5500,
                'status_kawasan' => 'Buka',
            ])
            ->assertOk()
            ->assertJsonPath('data.kuota_maksimal', 5500);

        // 4. Sekarang bisa ambil antrean virtual
        $this->app['auth']->forgetGuards();
        $queueRes = $this->withToken($userToken)
            ->postJson('/api/antrean', ['wahana_id' => $wahana->id])
            ->assertCreated()
            ->assertJsonPath('data.status_antrean', 'Menunggu');

        $antreanId = $queueRes->json('data.id');

        // 5. Operator panggil kloter berikutnya
        $this->app['auth']->forgetGuards();
        $this->withToken($opToken)
            ->postJson("/api/operator/wahana/{$wahana->id}/panggil-kloter")
            ->assertOk();

        // Cek antrean milik user berubah menjadi Dipanggil atau Selesai sesuai kloter
        $this->app['auth']->forgetGuards();
        $this->withToken($userToken)
            ->getJson('/api/antrean/saya')
            ->assertOk()
            ->assertJsonPath('data.0.id', $antreanId);
    }

    public function test_admin_and_operator_dashboards_are_strictly_separated(): void
    {
        $admin = User::where('role', 'admin')->firstOrFail();
        $operator = User::where('role', 'operator')->firstOrFail();
        $wisatawan = User::where('role', 'wisatawan')->firstOrFail();

        // Admin hanya melihat Panel Admin (Akun Pengguna & Riwayat Login), bukan menu Operator
        $this->actingAs($admin)
            ->get('/admin')
            ->assertOk()
            ->assertSee('Dashboard Admin')
            ->assertSee('Akun Pengguna')
            ->assertSee('Riwayat Login')
            ->assertDontSee('Wahana');

        $this->actingAs($admin)->get('/admin/users')->assertOk();
        $this->actingAs($admin)->get('/admin/users/create')->assertOk();
        $this->actingAs($admin)->get("/admin/users/{$wisatawan->id}/edit")->assertOk();
        $this->actingAs($admin)->get('/admin/login-logs')->assertOk();
        $this->actingAs($admin)->get('/admin/wahanas')->assertForbidden();

        // Operator melihat dashboard operasional yang sekarang, tanpa akses manajemen akun
        $this->flushSession();
        $this->actingAs($operator)
            ->get('/admin')
            ->assertOk()
            ->assertSee('Dashboard Operator')
            ->assertSee('Wahana')
            ->assertDontSee('Akun Pengguna')
            ->assertDontSee('Riwayat Login');

        $this->actingAs($operator)->get('/admin/wahanas')->assertOk();
        $this->actingAs($operator)->get('/admin/users')->assertForbidden();
        $this->actingAs($operator)->get('/admin/login-logs')->assertForbidden();

        // Wisatawan tidak dapat masuk ke panel staff
        $this->flushSession();
        $this->actingAs($wisatawan)->get('/admin')->assertForbidden();
    }

    public function test_login_tracking_and_account_deactivation(): void
    {
        $wisatawan = User::where('role', 'wisatawan')->firstOrFail();

        // Login gagal melalui API tetap tercatat di login_logs
        $this->postJson('/api/auth/login', [
            'email' => $wisatawan->email,
            'password' => 'salah-password',
        ])->assertStatus(401);

        $this->assertDatabaseHas('login_logs', [
            'email' => $wisatawan->email,
            'channel' => 'API Web',
            'status' => 'Gagal',
        ]);

        // Login berhasil melalui API memperbarui statistik user & login_logs
        $this->postJson('/api/auth/login', [
            'email' => $wisatawan->email,
            'password' => 'password123',
        ])->assertOk();

        $wisatawan->refresh();
        $this->assertSame(1, $wisatawan->login_count);
        $this->assertSame('API Web', $wisatawan->last_login_channel);
        $this->assertNotNull($wisatawan->last_login_at);

        // Login melalui web guard (Filament CMS) tercatat sebagai Filament CMS
        $admin = User::where('role', 'admin')->firstOrFail();
        $this->assertTrue(Auth::guard('web')->attempt([
            'email' => $admin->email,
            'password' => 'admin12345',
        ]));
        Auth::guard('web')->logout();

        $this->assertDatabaseHas('login_logs', [
            'user_id' => $admin->id,
            'channel' => 'Filament CMS',
            'status' => 'Berhasil',
        ]);

        // Menonaktifkan akun memblokir API login & akses panel
        $wisatawan->update(['is_active' => false]);
        $this->postJson('/api/auth/login', [
            'email' => $wisatawan->email,
            'password' => 'password123',
        ])->assertStatus(403);

        $this->assertTrue(
            LoginLog::where('email', $wisatawan->email)->where('status', 'Ditolak')->exists()
        );

        $operator = User::where('role', 'operator')->firstOrFail();
        $operator->update(['is_active' => false]);
        $this->actingAs($operator)->get('/admin')->assertForbidden();
    }
}
