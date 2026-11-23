<?php

namespace Database\Seeders;

use App\Models\Acara;
use App\Models\AntreanVirtual;
use App\Models\BlogPost;
use App\Models\KuotaHarian;
use App\Models\KulinerFnb;
use App\Models\PaketTiket;
use App\Models\Promo;
use App\Models\ReservasiTiket;
use App\Models\User;
use App\Models\Venue;
use App\Models\Wahana;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@jelajahin.id'],
            [
                'name' => 'Admin Kawasan Jelajahin',
                'password' => Hash::make('admin12345'),
                'nik' => null,
                'no_wa' => '081200000001',
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'operator@jelajahin.id'],
            [
                'name' => 'Operator Wahana & Gerbang',
                'password' => Hash::make('operator123'),
                'nik' => null,
                'no_wa' => '081200000002',
                'role' => 'operator',
            ]
        );

        $wisatawan = User::updateOrCreate(
            ['email' => 'wisatawan@jelajahin.id'],
            [
                'name' => 'Raka Pratama',
                'password' => Hash::make('password123'),
                'nik' => '3302011205080001',
                'no_wa' => '081234567890',
                'role' => 'wisatawan',
            ]
        );

        PaketTiket::updateOrCreate(
            ['nama_paket' => 'Tiket Masuk Terusan Reguler Jelajahin'],
            [
                'deskripsi' => 'Akses penuh ke seluruh wahana reguler Jelajahin Theme Park selama 1 hari kunjungan, lengkap dengan maksimal 2 slot antrean virtual aktif secara bersamaan.',
                'harga' => 275000,
                'jatah_antrean_aktif' => 2,
                'is_bundle' => false,
                'is_active' => true,
            ]
        );

        $paketBundle = PaketTiket::updateOrCreate(
            ['nama_paket' => 'Paket Bundling Hemat + Antrean Prioritas'],
            [
                'deskripsi' => 'Tiket terusan Jelajahin ditambah jatah hingga 4 slot antrean virtual aktif bersamaan untuk memaksimalkan waktu bermain tanpa antre panjang.',
                'harga' => 395000,
                'jatah_antrean_aktif' => 4,
                'is_bundle' => true,
                'is_active' => true,
            ]
        );

        $today = Carbon::today();
        for ($i = 0; $i < 14; $i++) {
            $date = $today->copy()->addDays($i)->format('Y-m-d');
            KuotaHarian::updateOrCreate(
                ['tanggal' => $date],
                [
                    'kuota_maksimal' => 5000,
                    'kuota_terpakai' => $i === 0 ? 1250 : ($i % 3 === 0 ? 940 : 420),
                    'status_kawasan' => 'Buka',
                ]
            );
        }

        $wahanaSeed = [
            [
                'nama_wahana' => 'Lintas Langit Coaster',
                'zona' => 'Ekstrem',
                'deskripsi' => 'Roller coaster berkecepatan tinggi dengan lintasan corkscrew dan loop ganda yang memacu adrenalin.',
                'gambar_url' => '/photos/unit-wahana.jpg',
                'tinggi_minimal_cm' => 125,
                'kategori_usia' => 'Remaja & Dewasa',
                'kapasitas_kloter' => 24,
                'durasi_menit' => 5,
                'status_lampu' => 'Merah',
                'crowd_meter' => 'Padat',
                'kloter_berjalan' => 2,
            ],
            [
                'nama_wahana' => 'Galeon Nusantara',
                'zona' => 'Ekstrem',
                'deskripsi' => 'Ayunan perahu raksasa yang mengayun hingga kemiringan tinggi dan memberi sensasi melayang.',
                'gambar_url' => '/photos/hero-jelajahin.jpg',
                'tinggi_minimal_cm' => 125,
                'kategori_usia' => 'Remaja & Dewasa',
                'kapasitas_kloter' => 30,
                'durasi_menit' => 4,
                'status_lampu' => 'Hijau',
                'crowd_meter' => 'Sedang',
                'kloter_berjalan' => 5,
            ],
            [
                'nama_wahana' => 'Bianglala Skyline',
                'zona' => 'Keluarga',
                'deskripsi' => 'Kincir ria ikonik setinggi 33 meter untuk menikmati panorama kawasan wisata pesisir dan laut utara.',
                'gambar_url' => '/photos/unit-wahana.jpg',
                'tinggi_minimal_cm' => 100,
                'kategori_usia' => 'Semua Usia (Pendamping <110cm)',
                'kapasitas_kloter' => 36,
                'durasi_menit' => 8,
                'status_lampu' => 'Hijau',
                'crowd_meter' => 'Sepi',
                'kloter_berjalan' => 3,
            ],
            [
                'nama_wahana' => 'Galeri Diorama Nusantara',
                'zona' => 'Keluarga',
                'deskripsi' => 'Perjalanan perahu menyusuri diorama budaya Nusantara dan mancanegara di ruangan sejuk ber-AC.',
                'gambar_url' => '/photos/unit-akuarium.jpg',
                'tinggi_minimal_cm' => 0,
                'kategori_usia' => 'Semua Usia & Balita',
                'kapasitas_kloter' => 50,
                'durasi_menit' => 10,
                'status_lampu' => 'Hijau',
                'crowd_meter' => 'Sepi',
                'kloter_berjalan' => 1,
            ],
            [
                'nama_wahana' => 'Arung Jeram Jelajahin',
                'zona' => 'Air',
                'deskripsi' => 'Petualangan perahu karet bundar menyusuri jeram buatan berarus deras bersama teman atau keluarga.',
                'gambar_url' => '/photos/unit-air.jpg',
                'tinggi_minimal_cm' => 110,
                'kategori_usia' => 'Anak, Remaja & Dewasa',
                'kapasitas_kloter' => 12,
                'durasi_menit' => 6,
                'status_lampu' => 'Merah',
                'crowd_meter' => 'Padat',
                'kloter_berjalan' => 4,
            ],
            [
                'nama_wahana' => 'Komidi Putar Klasik',
                'zona' => 'Keluarga',
                'deskripsi' => 'Komidi putar klasik berlampu hangat yang ramah bagi anak-anak maupun foto keluarga.',
                'gambar_url' => '/photos/unit-satwa.jpg',
                'tinggi_minimal_cm' => 90,
                'kategori_usia' => 'Anak & Keluarga',
                'kapasitas_kloter' => 40,
                'durasi_menit' => 3,
                'status_lampu' => 'Hijau',
                'crowd_meter' => 'Sepi',
                'kloter_berjalan' => 2,
            ],
        ];

        $coasterUtama = null;
        foreach ($wahanaSeed as $item) {
            $record = Wahana::updateOrCreate(
                ['nama_wahana' => $item['nama_wahana']],
                $item
            );
            if ($item['nama_wahana'] === 'Lintas Langit Coaster') {
                $coasterUtama = $record;
            }
        }

        $reservasiDemo = ReservasiTiket::updateOrCreate(
            ['kode_booking' => 'JLJ-PARK-0001'],
            [
                'user_id' => $wisatawan->id,
                'paket_id' => $paketBundle->id,
                'tanggal_kunjungan' => $today->format('Y-m-d'),
                'jumlah_tiket' => 2,
                'total_harga' => $paketBundle->harga * 2,
                'metode_pembayaran' => 'QRIS Instan',
                'qr_token' => 'JLJ-QR-DEMO-AKTIF-0001',
                'status_pembayaran' => 'Lunas',
                'status_kunjungan' => 'Aktif di Kawasan',
                'waktu_checkin' => now()->subMinutes(45),
            ]
        );

        if ($coasterUtama) {
            AntreanVirtual::updateOrCreate(
                [
                    'user_id' => $wisatawan->id,
                    'wahana_id' => $coasterUtama->id,
                    'nomor_antrean' => '#H-018',
                ],
                [
                    'reservasi_id' => $reservasiDemo->id,
                    'nomor_kloter' => 3,
                    'estimasi_tunggu_menit' => 10,
                    'status_antrean' => 'Menunggu',
                    'waktu_daftar' => now()->subMinutes(8),
                ]
            );
        }

        // Seed 5 Tabel Ekstensi Portal Konten
        $promos = [
            [
                'judul' => 'Hemat Rombongan Sekolah & Pelajar',
                'kategori' => 'Member & Pelajar',
                'diskon_badge' => 'Hemat 20%',
                'periode' => 'Berlaku hingga 30 Des 2026',
                'kode_promo' => 'JELAJAHPELAJAR20',
                'ringkasan' => 'Potongan tiket masuk reguler untuk minimal pemesanan 4 tiket dengan kartu pelajar atau akun terdaftar.',
                'ketentuan' => 'Berlaku pada hari kerja (Senin sampai Jumat) di luar musim liburan nasional dan tidak digabung dengan promo bundling lain.',
                'gambar_url' => '/photos/unit-wahana.jpg',
                'is_active' => true,
            ],
            [
                'judul' => 'Paket Bundling Antrean Prioritas Keluarga',
                'kategori' => 'Bundling',
                'diskon_badge' => 'Prioritas 4 Wahana',
                'periode' => 'Setiap Akhir Pekan',
                'kode_promo' => 'BUNDLINGCEPAT',
                'ringkasan' => 'Tiket terusan seharian dilengkapi jatah hingga 4 slot antrean virtual bersamaan untuk keluarga dan rombongan.',
                'ketentuan' => 'Berlaku untuk seluruh wahana yang berstatus Lampu Hijau dan memenuhi syarat tinggi badan minimal pengunjung.',
                'gambar_url' => '/photos/hero-jelajahin.jpg',
                'is_active' => true,
            ],
            [
                'judul' => 'Early Bird Kunjungan Pagi Hari',
                'kategori' => 'Tiket Hemat',
                'diskon_badge' => 'Diskon Rp 40.000',
                'periode' => 'Pembelian H-3 Kunjungan',
                'kode_promo' => 'PAGIJELAJAH40',
                'ringkasan' => 'Potongan langsung per tiket untuk pemesanan online minimal 3 hari sebelum tanggal kunjungan yang masih tersedia.',
                'ketentuan' => 'Kuota promo terbatas untuk 500 pemesan pertama setiap harinya dan langsung aktif saat check-in di gerbang utama.',
                'gambar_url' => '/photos/unit-air.jpg',
                'is_active' => true,
            ],
            [
                'judul' => 'Promo Weekend Seru Bareng Teman',
                'kategori' => 'Tiket Hemat',
                'diskon_badge' => 'Beli 3 Dapat Kupon F&B',
                'periode' => 'Sabtu & Minggu',
                'kode_promo' => 'WEEKENDKULINER',
                'ringkasan' => 'Bonus voucher minuman segar di area restoran kawasan untuk setiap transaksi minimal 3 tiket terusan akhir pekan.',
                'ketentuan' => 'Voucher dapat ditukarkan di outlet Food & Beverages mitra selama tiket berstatus Aktif di Kawasan.',
                'gambar_url' => '/photos/resort-kuliner.jpg',
                'is_active' => true,
            ],
        ];
        foreach ($promos as $promo) {
            Promo::updateOrCreate(['kode_promo' => $promo['kode_promo']], $promo);
        }

        $acaras = [
            [
                'judul' => 'Parade Fantasi Keliling Dunia',
                'kategori' => 'Parade',
                'lokasi' => 'Boulevard Utama Jelajahin',
                'jadwal' => 'Setiap Sabtu & Minggu',
                'jam' => '15:30 - 16:30 WIB',
                'ringkasan' => 'Iring-iringan karakter maskot Jelajahin, kostum tematik zona Eropa hingga Asia, dan atraksi musik jalanan.',
                'gambar_url' => '/photos/unit-wahana.jpg',
                'is_active' => true,
            ],
            [
                'judul' => 'Pentas Musik Senja Pesisir',
                'kategori' => 'Musik',
                'lokasi' => 'Panggung Terbuka Pantai Timur',
                'jadwal' => 'Akhir Pekan & Hari Libur',
                'jam' => '17:00 - 19:30 WIB',
                'ringkasan' => 'Penampilan band akustik dan musisi tamu di tepi pantai yang dapat dinikmati setelah keluar dari area wahana.',
                'gambar_url' => '/photos/hero-jelajahin.jpg',
                'is_active' => true,
            ],
            [
                'judul' => 'Pertunjukan Sulap & Ilusi Keluarga',
                'kategori' => 'Pertunjukan',
                'lokasi' => 'Indoor Stage Zona Keluarga',
                'jadwal' => 'Harian (Selasa sampai Minggu)',
                'jam' => '13:00 & 16:00 WIB',
                'ringkasan' => 'Pertunjukan interaktif keluarga yang cocok ditonton anak-anak sembari beristirahat menunggu panggilan kloter antrean virtual.',
                'gambar_url' => '/photos/unit-satwa.jpg',
                'is_active' => true,
            ],
            [
                'judul' => 'Festival Kuliner Nusantara Malam',
                'kategori' => 'Parade',
                'lokasi' => 'Promenade Pesisir Jelajahin',
                'jadwal' => 'Jumat sampai Minggu',
                'jam' => '16:00 - 21:00 WIB',
                'ringkasan' => 'Deretan gerai kuliner khas daerah dengan pertunjukan seni tari tradisional dan area duduk terbuka tepi laut.',
                'gambar_url' => '/photos/resort-kuliner.jpg',
                'is_active' => true,
            ],
        ];
        foreach ($acaras as $acara) {
            Acara::updateOrCreate(['judul' => $acara['judul']], $acara);
        }

        $venues = [
            [
                'nama' => 'Laguna Pesisir Cottage',
                'kategori' => 'Resort',
                'area' => 'Tepi Pantai Timur Kawasan',
                'harga_mulai' => 'Mulai Rp 1.150.000 / malam',
                'fasilitas' => 'Cottage keluarga, kolam renang tepi laut, akses shuttle kawasan',
                'ringkasan' => 'Penginapan bernuansa cottage pribadi di pinggir pantai yang dekat dengan gerbang utama kawasan wisata Jelajahin.',
                'gambar_url' => '/photos/resort-kuliner.jpg',
                'is_active' => true,
            ],
            [
                'nama' => 'Grand Marina Resort & Convention',
                'kategori' => 'Hotel',
                'area' => 'Kawasan Pesisir Jelajahin',
                'harga_mulai' => 'Mulai Rp 980.000 / malam',
                'fasilitas' => 'Kamar menghadap laut, kolam anak, ruang pertemuan & aula acara',
                'ringkasan' => 'Hotel bintang empat dengan akses berjalan kaki menuju pantai dan layanan kendaraan kawasan menuju pintu masuk taman wisata.',
                'gambar_url' => '/photos/hero-jelajahin.jpg',
                'is_active' => true,
            ],
            [
                'nama' => 'Jelajahin Gateway Hotel',
                'kategori' => 'Hotel',
                'area' => 'Dekat Gerbang Utama Taman Wisata',
                'harga_mulai' => 'Mulai Rp 920.000 / malam',
                'fasilitas' => 'Hanya 5 menit ke gerbang utama, kolam renang laguna, taman bermain anak',
                'ringkasan' => 'Pilihan menginap terdekat dari pintu gerbang utama agar pengunjung bisa masuk kawasan lebih pagi saat wahana baru dibuka.',
                'gambar_url' => '/photos/unit-air.jpg',
                'is_active' => true,
            ],
            [
                'nama' => 'Taman Hijau Multipurpose Venue',
                'kategori' => 'Venue Acara',
                'area' => 'Taman Hijau Jelajahin',
                'harga_mulai' => 'Reservasi Rombongan & Sekolah',
                'fasilitas' => 'Area gathering hingga 1.500 orang, taman hijau, panggung outdoor',
                'ringkasan' => 'Area terbuka hijau untuk acara studi tur sekolah, gathering komunitas, dan kegiatan luar ruang keluarga.',
                'gambar_url' => '/photos/unit-satwa.jpg',
                'is_active' => true,
            ],
        ];
        foreach ($venues as $venue) {
            Venue::updateOrCreate(['nama' => $venue['nama']], $venue);
        }

        $kuliners = [
            [
                'nama' => 'Dermaga Rasa Seafood',
                'kategori' => 'Tepi Pantai',
                'area' => 'Pintu Timur Pesisir Jelajahin',
                'jam_buka' => '11:00 - 22:00 WIB',
                'kisaran_harga' => 'Rp 85.000 - Rp 250.000 / porsi',
                'menu_andalan' => 'Ikan bakar segar, udang saus madu, kepiting lada hitam',
                'gambar_url' => '/photos/resort-kuliner.jpg',
                'is_active' => true,
            ],
            [
                'nama' => 'Food Court Zona Petualangan',
                'kategori' => 'Restoran Keluarga',
                'area' => 'Zona Air (Dekat Arung Jeram)',
                'jam_buka' => '09:30 - 18:00 WIB',
                'kisaran_harga' => 'Rp 35.000 - Rp 75.000 / porsi',
                'menu_andalan' => 'Nasi ayam crispy, mi goreng spesial, es teh tarik dingin',
                'gambar_url' => '/photos/unit-wahana.jpg',
                'is_active' => true,
            ],
            [
                'nama' => 'Kapal Pinisi Resto',
                'kategori' => 'Restoran Keluarga',
                'area' => 'Area Tengah Taman Wisata',
                'jam_buka' => '10:00 - 17:30 WIB',
                'kisaran_harga' => 'Rp 45.000 - Rp 95.000 / porsi',
                'menu_andalan' => 'Paket nasi bento keluarga, soto betawi, es kelapa muda',
                'gambar_url' => '/photos/unit-akuarium.jpg',
                'is_active' => true,
            ],
            [
                'nama' => 'Dermaga Senja Kopi & Gelato',
                'kategori' => 'Kafe & Minuman',
                'area' => 'Dermaga Timur Pantai Jelajahin',
                'jam_buka' => '10:00 - 21:00 WIB',
                'kisaran_harga' => 'Rp 28.000 - Rp 80.000',
                'menu_andalan' => 'Kopi susu gula aren, gelato artisan, kentang goreng keju',
                'gambar_url' => '/photos/hero-jelajahin.jpg',
                'is_active' => true,
            ],
        ];
        foreach ($kuliners as $kuliner) {
            KulinerFnb::updateOrCreate(['nama' => $kuliner['nama']], $kuliner);
        }

        $blogs = [
            [
                'judul' => 'Cara Keliling Taman Wisata Bebas Antre Lama Pakai Antrean Virtual',
                'kategori' => 'Panduan Kunjungan',
                'tanggal_terbit' => '18 November 2026',
                'waktu_baca' => '4 menit baca',
                'ringkasan' => 'Atur urutan naik wahana ekstrem dan wahana air sejak pagi dengan memantau lampu status dan mengambil kloter virtual lewat ponsel.',
                'isi' => [
                    'Datang sebelum pukul 09:30 WIB memberi kesempatan paling leluasa karena gerbang baru dibuka dan kuota pengunjung masih tersebar di area depan.',
                    'Gunakan halaman Wahana untuk melihat kombinasi Lampu Hijau dan tingkat keramaian Sepi terlebih dahulu. Naiklah wahana dengan durasi cepat atau antrean pendek sambil mendaftarkan nomor antrean virtual untuk wahana favorit seperti Lintas Langit Coaster.',
                    'Selama nomor antreanmu masih berstatus Menunggu, manfaatkan waktu untuk beristirahat di area kuliner atau menonton pertunjukan dalam ruangan tanpa takut kehilangan giliran kloter.',
                ],
                'gambar_url' => '/photos/unit-wahana.jpg',
                'is_published' => true,
            ],
            [
                'judul' => 'Panduan Memilih Wahana Aman Berdasarkan Tinggi Badan Anak',
                'kategori' => 'Tips Wahana',
                'tanggal_terbit' => '14 November 2026',
                'waktu_baca' => '3 menit baca',
                'ringkasan' => 'Ketahui patokan tinggi badan minimal sebelum berjalan ke lokasi wahana agar anak tidak kecewa saat diperiksa petugas di pintu antrean.',
                'isi' => [
                    'Setiap wahana di kawasan wisata memiliki batas tinggi minimal demi menjaga pengaman kursi bekerja sempurna sepanjang permainan berlangsung.',
                    'Untuk anak dengan tinggi di bawah 100 cm, pilihan paling nyaman meliputi Galeri Diorama Nusantara dan Komidi Putar Klasik. Anak bertinggi 110 cm sudah dapat mencoba Arung Jeram Jelajahin dengan pendampingan keluarga.',
                    'Fitur Filter Tinggi Badan di Jelajahin langsung menandai wahana mana yang sudah memenuhi syarat dan mana yang perlu dilewati sebelum kamu mengambil nomor antrean.',
                ],
                'gambar_url' => '/photos/unit-satwa.jpg',
                'is_published' => true,
            ],
            [
                'judul' => 'Rekomendasi Tempat Makan & Menginap Satu Kawasan Jelajahin',
                'kategori' => 'Kuliner & Menginap',
                'tanggal_terbit' => '10 November 2026',
                'waktu_baca' => '5 menit baca',
                'ringkasan' => 'Padukan seharian bermain di taman wisata dengan pilihan makan siang cepat di dalam taman serta penginapan resort tepi pantai untuk liburan keluarga.',
                'isi' => [
                    'Untuk makan siang di sela permainan wahana, pilih Food Court Zona Petualangan atau Kapal Pinisi Resto agar tidak perlu keluar dari gerbang utama kawasan.',
                    'Bagi pengunjung dari luar kota yang ingin masuk paling pagi keesokan harinya, menginap di hotel sekitar gerbang utama seperti Jelajahin Gateway Hotel atau cottage Laguna Pesisir Cottage mempersingkat waktu tempuh ke area parkir.',
                    'Menjelang sore setelah pukul 17:00 WIB, kamu bisa bergeser ke kawasan tepi pantai untuk menikmati hidangan laut di Dermaga Rasa Seafood sambil menyaksikan hiburan musik senja.',
                ],
                'gambar_url' => '/photos/resort-kuliner.jpg',
                'is_published' => true,
            ],
        ];
        foreach ($blogs as $blog) {
            BlogPost::updateOrCreate(['judul' => $blog['judul']], $blog);
        }
    }
}
