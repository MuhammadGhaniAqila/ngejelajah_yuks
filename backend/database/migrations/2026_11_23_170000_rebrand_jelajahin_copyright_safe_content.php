<?php

use App\Models\Acara;
use App\Models\BlogPost;
use App\Models\KulinerFnb;
use App\Models\PaketTiket;
use App\Models\Promo;
use App\Models\ReservasiTiket;
use App\Models\User;
use App\Models\Venue;
use App\Models\Wahana;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $imageMap = [
            '/photos/hero-ancol.jpg' => '/photos/hero-jelajahin.jpg',
            '/photos/unit-dufan.jpg' => '/photos/unit-wahana.jpg',
            '/photos/unit-atlantis.jpg' => '/photos/unit-air.jpg',
            '/photos/unit-seaworld.jpg' => '/photos/unit-akuarium.jpg',
            '/photos/unit-samudra-birdland.jpg' => '/photos/unit-satwa.jpg',
        ];

        User::where('email', 'admin@jelajahin.id')
            ->where('name', 'Admin Kawasan Dufan')
            ->update(['name' => 'Admin Kawasan Jelajahin']);

        if ($paket = PaketTiket::where('nama_paket', 'Tiket Masuk Terusan Reguler Dufan')->first()) {
            $paket->update([
                'nama_paket' => 'Tiket Masuk Terusan Reguler Jelajahin',
                'deskripsi' => 'Akses penuh ke seluruh wahana reguler Jelajahin Theme Park selama 1 hari kunjungan, lengkap dengan maksimal 2 slot antrean virtual aktif secara bersamaan.',
            ]);
        }

        if ($paketBundle = PaketTiket::where('nama_paket', 'Paket Bundling Hemat + Antrean Prioritas')->first()) {
            $paketBundle->update([
                'deskripsi' => 'Tiket terusan Jelajahin ditambah jatah hingga 4 slot antrean virtual aktif bersamaan untuk memaksimalkan waktu bermain tanpa antre panjang.',
            ]);
        }

        $wahanaUpdates = [
            'Halilintar Extreme Coaster' => ['nama_wahana' => 'Lintas Langit Coaster'],
            'Kora-Kora Samudra' => ['nama_wahana' => 'Galeon Nusantara'],
            'Bianglala Skyline' => ['deskripsi' => 'Kincir ria ikonik setinggi 33 meter untuk menikmati panorama kawasan wisata pesisir dan laut utara.'],
            'Istana Boneka Nusantara' => ['nama_wahana' => 'Galeri Diorama Nusantara'],
            'Arung Jeram Dufan' => ['nama_wahana' => 'Arung Jeram Jelajahin'],
            'Turangga-Rangga' => ['nama_wahana' => 'Komidi Putar Klasik'],
        ];
        foreach ($wahanaUpdates as $oldName => $attrs) {
            if ($w = Wahana::where('nama_wahana', $oldName)->first()) {
                $w->update($attrs);
            }
        }

        ReservasiTiket::where('kode_booking', 'JLJ-DUFAN-0001')
            ->update(['kode_booking' => 'JLJ-PARK-0001']);

        if ($p1 = Promo::where('kode_promo', 'DUFANPELAJAR20')->first()) {
            $p1->update(['kode_promo' => 'JELAJAHPELAJAR20']);
        }
        if ($p3 = Promo::where('kode_promo', 'PAGIDUFAN40')->first()) {
            $p3->update(['kode_promo' => 'PAGIJELAJAH40']);
        }
        if ($p4 = Promo::where('kode_promo', 'WEEKENDKULINER')->first()) {
            $p4->update([
                'ringkasan' => 'Bonus voucher minuman segar di area restoran kawasan untuk setiap transaksi minimal 3 tiket terusan akhir pekan.',
            ]);
        }

        $acaraUpdates = [
            'Parade Fantasi Keliling Dunia' => [
                'lokasi' => 'Boulevard Utama Jelajahin',
                'ringkasan' => 'Iring-iringan karakter maskot Jelajahin, kostum tematik zona Eropa hingga Asia, dan atraksi musik jalanan.',
            ],
            'Pentas Musik Senja Pesisir Ancol' => [
                'judul' => 'Pentas Musik Senja Pesisir',
                'lokasi' => 'Panggung Terbuka Pantai Timur',
                'ringkasan' => 'Penampilan band akustik dan musisi tamu di tepi pantai yang dapat dinikmati setelah keluar dari area wahana.',
            ],
            'Pertunjukan Sulap & Ilusi Fantasi' => [
                'judul' => 'Pertunjukan Sulap & Ilusi Keluarga',
                'lokasi' => 'Indoor Stage Zona Keluarga',
            ],
            'Festival Kuliner Nusantara Malam' => [
                'lokasi' => 'Promenade Pesisir Jelajahin',
            ],
        ];
        foreach ($acaraUpdates as $oldTitle => $attrs) {
            if ($a = Acara::where('judul', $oldTitle)->first()) {
                $a->update($attrs);
            }
        }

        $venueUpdates = [
            'Putri Duyung Resort Ancol' => [
                'nama' => 'Laguna Pesisir Cottage',
                'area' => 'Tepi Pantai Timur Kawasan',
                'ringkasan' => 'Penginapan bernuansa cottage pribadi di pinggir pantai yang dekat dengan gerbang utama kawasan wisata Jelajahin.',
            ],
            'Mercure Convention Center Ancol' => [
                'nama' => 'Grand Marina Resort & Convention',
                'area' => 'Kawasan Pesisir Jelajahin',
                'ringkasan' => 'Hotel bintang empat dengan akses berjalan kaki menuju pantai dan layanan kendaraan kawasan menuju pintu masuk taman wisata.',
            ],
            'Discovery Hotel Ancol' => [
                'nama' => 'Jelajahin Gateway Hotel',
                'area' => 'Dekat Gerbang Utama Taman Wisata',
                'fasilitas' => 'Hanya 5 menit ke gerbang utama, kolam renang laguna, taman bermain anak',
                'ringkasan' => 'Pilihan menginap terdekat dari pintu gerbang utama agar pengunjung bisa masuk kawasan lebih pagi saat wahana baru dibuka.',
            ],
            'Ecopark Multipurpose Venue' => [
                'nama' => 'Taman Hijau Multipurpose Venue',
                'area' => 'Taman Hijau Jelajahin',
            ],
        ];
        foreach ($venueUpdates as $oldName => $attrs) {
            if ($v = Venue::where('nama', $oldName)->first()) {
                $v->update($attrs);
            }
        }

        $kulinerUpdates = [
            'Bandar Djakarta Ancol' => [
                'nama' => 'Dermaga Rasa Seafood',
                'area' => 'Pintu Timur Pesisir Jelajahin',
            ],
            'Kafe Hoax & Food Court Dufan' => [
                'nama' => 'Food Court Zona Petualangan',
                'area' => 'Zona Air (Dekat Arung Jeram)',
            ],
            'Columbus Resto Kapal Pinisi' => [
                'nama' => 'Kapal Pinisi Resto',
                'area' => 'Area Tengah Taman Wisata',
            ],
            'Le Bridge Kopi & Gelato Dermaga' => [
                'nama' => 'Dermaga Senja Kopi & Gelato',
                'area' => 'Dermaga Timur Pantai Jelajahin',
            ],
        ];
        foreach ($kulinerUpdates as $oldName => $attrs) {
            if ($k = KulinerFnb::where('nama', $oldName)->first()) {
                $k->update($attrs);
            }
        }

        if ($b1 = BlogPost::where('judul', 'Cara Keliling Dufan Bebas Antre Lama Pakai Antrean Virtual')->first()) {
            $b1->update([
                'judul' => 'Cara Keliling Taman Wisata Bebas Antre Lama Pakai Antrean Virtual',
                'isi' => [
                    'Datang sebelum pukul 09:30 WIB memberi kesempatan paling leluasa karena gerbang baru dibuka dan kuota pengunjung masih tersebar di area depan.',
                    'Gunakan halaman Wahana untuk melihat kombinasi Lampu Hijau dan tingkat keramaian Sepi terlebih dahulu. Naiklah wahana dengan durasi cepat atau antrean pendek sambil mendaftarkan nomor antrean virtual untuk wahana favorit seperti Lintas Langit Coaster.',
                    'Selama nomor antreanmu masih berstatus Menunggu, manfaatkan waktu untuk beristirahat di area kuliner atau menonton pertunjukan dalam ruangan tanpa takut kehilangan giliran kloter.',
                ],
            ]);
        }

        if ($b2 = BlogPost::where('judul', 'Panduan Memilih Wahana Aman Berdasarkan Tinggi Badan Anak')->first()) {
            $b2->update([
                'isi' => [
                    'Setiap wahana di kawasan wisata memiliki batas tinggi minimal demi menjaga pengaman kursi bekerja sempurna sepanjang permainan berlangsung.',
                    'Untuk anak dengan tinggi di bawah 100 cm, pilihan paling nyaman meliputi Galeri Diorama Nusantara dan Komidi Putar Klasik. Anak bertinggi 110 cm sudah dapat mencoba Arung Jeram Jelajahin dengan pendampingan keluarga.',
                    'Fitur Filter Tinggi Badan di Jelajahin langsung menandai wahana mana yang sudah memenuhi syarat dan mana yang perlu dilewati sebelum kamu mengambil nomor antrean.',
                ],
            ]);
        }

        if ($b3 = BlogPost::where('judul', 'Rekomendasi Tempat Makan & Menginap Satu Kawasan di Ancol')->first()) {
            $b3->update([
                'judul' => 'Rekomendasi Tempat Makan & Menginap Satu Kawasan Jelajahin',
                'ringkasan' => 'Padukan seharian bermain di taman wisata dengan pilihan makan siang cepat di dalam taman serta penginapan resort tepi pantai untuk liburan keluarga.',
                'isi' => [
                    'Untuk makan siang di sela permainan wahana, pilih Food Court Zona Petualangan atau Kapal Pinisi Resto agar tidak perlu keluar dari gerbang utama kawasan.',
                    'Bagi pengunjung dari luar kota yang ingin masuk paling pagi keesokan harinya, menginap di hotel sekitar gerbang utama seperti Jelajahin Gateway Hotel atau cottage Laguna Pesisir Cottage mempersingkat waktu tempuh ke area parkir.',
                    'Menjelang sore setelah pukul 17:00 WIB, kamu bisa bergeser ke kawasan tepi pantai untuk menikmati hidangan laut di Dermaga Rasa Seafood sambil menyaksikan hiburan musik senja.',
                ],
            ]);
        }

        foreach (['wahanas', 'promos', 'acaras', 'venues', 'kuliner_fnbs', 'blog_posts'] as $table) {
            foreach ($imageMap as $oldUrl => $newUrl) {
                DB::table($table)
                    ->where('gambar_url', $oldUrl)
                    ->update(['gambar_url' => $newUrl]);
            }
        }
    }

    public function down(): void
    {
        // Keep copyrighted names removed on rollback as well.
    }
};
