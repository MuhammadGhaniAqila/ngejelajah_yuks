import type {
  AcaraItem,
  AntreanVirtual,
  BlogPost,
  FnbItem,
  KawasanInfo,
  KuotaHarian,
  PaketTiket,
  PromoItem,
  ReservasiTiket,
  User,
  VenueItem,
  Wahana,
} from "./types";

const DEMO_RESERVASI_KEY = "jelajahin_demo_reservasi_v1";
const DEMO_ANTREAN_KEY = "jelajahin_demo_antrean_v1";
const DEMO_USERS_KEY = "jelajahin_demo_users_v1";

export const DEMO_USER: User = {
  id: 3,
  nama_lengkap: "Raka Pratama",
  email: "wisatawan@jelajahin.id",
  nik: "3302011205080001",
  no_wa: "081234567890",
  role: "wisatawan",
};

export const DEMO_PAKET_LIST: PaketTiket[] = [
  {
    id: 1,
    nama_paket: "Tiket Masuk Terusan Reguler Jelajahin",
    deskripsi:
      "Akses penuh ke seluruh wahana reguler Jelajahin Theme Park selama 1 hari kunjungan, lengkap dengan maksimal 2 slot antrean virtual aktif secara bersamaan.",
    harga: 275000,
    jatah_antrean_aktif: 2,
    is_bundle: false,
    is_active: true,
  },
  {
    id: 2,
    nama_paket: "Paket Bundling Hemat + Antrean Prioritas",
    deskripsi:
      "Tiket terusan Jelajahin ditambah jatah hingga 4 slot antrean virtual aktif bersamaan untuk memaksimalkan waktu bermain tanpa antre panjang.",
    harga: 395000,
    jatah_antrean_aktif: 4,
    is_bundle: true,
    is_active: true,
  },
];

export const DEMO_WAHANA_LIST: Wahana[] = [
  {
    id: 1,
    nama_wahana: "Lintas Langit Coaster",
    zona: "Ekstrem",
    deskripsi:
      "Roller coaster berkecepatan tinggi dengan lintasan corkscrew dan loop ganda yang memacu adrenalin.",
    gambar_url: "/photos/unit-wahana.jpg",
    tinggi_minimal_cm: 125,
    kategori_usia: "Remaja & Dewasa",
    kapasitas_kloter: 24,
    durasi_menit: 5,
    status_lampu: "Merah",
    crowd_meter: "Padat",
    kloter_berjalan: 2,
    jumlah_antrean_aktif: 14,
  },
  {
    id: 2,
    nama_wahana: "Galeon Nusantara",
    zona: "Ekstrem",
    deskripsi:
      "Ayunan perahu raksasa yang mengayun hingga kemiringan tinggi dan memberi sensasi melayang.",
    gambar_url: "/photos/hero-jelajahin.jpg",
    tinggi_minimal_cm: 125,
    kategori_usia: "Remaja & Dewasa",
    kapasitas_kloter: 30,
    durasi_menit: 4,
    status_lampu: "Hijau",
    crowd_meter: "Sedang",
    kloter_berjalan: 5,
    jumlah_antrean_aktif: 7,
  },
  {
    id: 3,
    nama_wahana: "Bianglala Skyline",
    zona: "Keluarga",
    deskripsi:
      "Kincir ria ikonik setinggi 33 meter untuk menikmati panorama kawasan wisata pesisir dan laut utara.",
    gambar_url: "/photos/unit-wahana.jpg",
    tinggi_minimal_cm: 100,
    kategori_usia: "Semua Usia (Pendamping <110cm)",
    kapasitas_kloter: 36,
    durasi_menit: 8,
    status_lampu: "Hijau",
    crowd_meter: "Sepi",
    kloter_berjalan: 3,
    jumlah_antrean_aktif: 2,
  },
  {
    id: 4,
    nama_wahana: "Galeri Diorama Nusantara",
    zona: "Keluarga",
    deskripsi:
      "Perjalanan perahu menyusuri diorama budaya Nusantara dan mancanegara di ruangan sejuk ber-AC.",
    gambar_url: "/photos/unit-akuarium.jpg",
    tinggi_minimal_cm: 0,
    kategori_usia: "Semua Usia & Balita",
    kapasitas_kloter: 50,
    durasi_menit: 10,
    status_lampu: "Hijau",
    crowd_meter: "Sepi",
    kloter_berjalan: 1,
    jumlah_antrean_aktif: 2,
  },
  {
    id: 5,
    nama_wahana: "Arung Jeram Jelajahin",
    zona: "Air",
    deskripsi:
      "Petualangan perahu karet bundar menyusuri jeram buatan berarus deras bersama teman atau keluarga.",
    gambar_url: "/photos/unit-air.jpg",
    tinggi_minimal_cm: 110,
    kategori_usia: "Anak, Remaja & Dewasa",
    kapasitas_kloter: 12,
    durasi_menit: 6,
    status_lampu: "Merah",
    crowd_meter: "Padat",
    kloter_berjalan: 4,
    jumlah_antrean_aktif: 12,
  },
  {
    id: 6,
    nama_wahana: "Komidi Putar Klasik",
    zona: "Keluarga",
    deskripsi:
      "Komidi putar klasik berlampu hangat yang ramah bagi anak-anak maupun foto keluarga.",
    gambar_url: "/photos/unit-satwa.jpg",
    tinggi_minimal_cm: 90,
    kategori_usia: "Anak & Keluarga",
    kapasitas_kloter: 40,
    durasi_menit: 3,
    status_lampu: "Hijau",
    crowd_meter: "Sepi",
    kloter_berjalan: 2,
    jumlah_antrean_aktif: 3,
  },
];

function buildCalendarQuota(): KuotaHarian[] {
  const days: KuotaHarian[] = [];
  const base = new Date();
  for (let i = 0; i < 14; i += 1) {
    const dt = new Date(base);
    dt.setDate(base.getDate() + i);
    const iso = dt.toISOString().slice(0, 10);
    const terpakai = i === 0 ? 1250 : i % 3 === 0 ? 940 : 420;
    const maksimal = 5000;
    days.push({
      tanggal: iso,
      kuota_maksimal: maksimal,
      kuota_terpakai: terpakai,
      sisa_kuota: maksimal - terpakai,
      status_kawasan: "Buka",
    });
  }
  return days;
}

export function getDemoKawasanInfo(): KawasanInfo {
  const kalender = buildCalendarQuota();
  return {
    nama_kawasan: "Jelajahin Theme Park",
    jam_buka: "09:00",
    jam_tutup: "18:00",
    hari_ini: kalender[0],
    kalender_kuota: kalender,
  };
}

function getInitialReservasi(): ReservasiTiket[] {
  const today = new Date().toISOString().slice(0, 10);
  return [
    {
      id: 1,
      kode_booking: "JLJ-PARK-0001",
      qr_token: "JLJ-QR-DEMO-AKTIF-0001",
      tanggal_kunjungan: today,
      jumlah_tiket: 2,
      total_harga: 790000,
      metode_pembayaran: "QRIS Instan",
      status_pembayaran: "Lunas",
      status_kunjungan: "Aktif di Kawasan",
      waktu_checkin: "09:15 WIB",
      paket: DEMO_PAKET_LIST[1],
    },
  ];
}

function getInitialAntrean(): AntreanVirtual[] {
  return [
    {
      id: 1,
      wahana_id: 1,
      reservasi_id: 1,
      nomor_antrean: "#H-018",
      nomor_kloter: 3,
      estimasi_tunggu_menit: 10,
      status_antrean: "Menunggu",
      waktu_daftar: new Date().toISOString(),
      wahana: DEMO_WAHANA_LIST[0],
    },
  ];
}

export function readDemoReservasi(): ReservasiTiket[] {
  if (typeof window === "undefined") return getInitialReservasi();
  const raw = localStorage.getItem(DEMO_RESERVASI_KEY);
  if (!raw) {
    const seed = getInitialReservasi();
    localStorage.setItem(DEMO_RESERVASI_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as ReservasiTiket[];
  } catch {
    return getInitialReservasi();
  }
}

export function saveDemoReservasi(items: ReservasiTiket[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMO_RESERVASI_KEY, JSON.stringify(items));
}

export function readDemoAntrean(): AntreanVirtual[] {
  if (typeof window === "undefined") return getInitialAntrean();
  const raw = localStorage.getItem(DEMO_ANTREAN_KEY);
  if (!raw) {
    const seed = getInitialAntrean();
    localStorage.setItem(DEMO_ANTREAN_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as AntreanVirtual[];
  } catch {
    return getInitialAntrean();
  }
}

export function saveDemoAntrean(items: AntreanVirtual[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMO_ANTREAN_KEY, JSON.stringify(items));
}

export function registerDemoUser(payload: {
  nama_lengkap: string;
  email: string;
  nik: string;
  no_wa: string;
}): { token: string; user: User } {
  const newUser: User = {
    id: Date.now(),
    nama_lengkap: payload.nama_lengkap,
    email: payload.email,
    nik: payload.nik,
    no_wa: payload.no_wa,
    role: "wisatawan",
  };
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(DEMO_USERS_KEY);
    const list: User[] = raw ? (JSON.parse(raw) as User[]) : [DEMO_USER];
    list.push(newUser);
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(list));
  }
  return {
    token: `demo-token-${Date.now()}`,
    user: newUser,
  };
}

export function loginDemoUser(email: string): { token: string; user: User } {
  const normalized = email.trim().toLowerCase();
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(DEMO_USERS_KEY);
    const list: User[] = raw ? (JSON.parse(raw) as User[]) : [DEMO_USER];
    const found = list.find((u) => u.email.toLowerCase() === normalized);
    if (found) {
      return { token: `demo-token-${found.id}`, user: found };
    }
  }
  if (normalized === DEMO_USER.email) {
    return { token: "demo-token-wisatawan", user: DEMO_USER };
  }
  const fallbackName = email.split("@")[0] || "Pengunjung";
  return {
    token: `demo-token-${Date.now()}`,
    user: {
      id: Date.now(),
      nama_lengkap: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1),
      email,
      nik: "3302011205080001",
      no_wa: "081234567890",
      role: "wisatawan",
    },
  };
}

export const DEMO_PROMO_LIST: PromoItem[] = [
  {
    id: 1,
    judul: "Hemat Rombongan Sekolah & Pelajar",
    kategori: "Member & Pelajar",
    diskon_badge: "Hemat 20%",
    periode: "Berlaku hingga 30 Des 2026",
    kode_promo: "JELAJAHPELAJAR20",
    ringkasan:
      "Potongan tiket masuk reguler untuk minimal pemesanan 4 tiket dengan kartu pelajar atau akun terdaftar.",
    ketentuan:
      "Berlaku pada hari kerja (Senin sampai Jumat) di luar musim liburan nasional dan tidak digabung dengan promo bundling lain.",
    gambar_url: "/photos/unit-wahana.jpg",
  },
  {
    id: 2,
    judul: "Paket Bundling Antrean Prioritas Keluarga",
    kategori: "Bundling",
    diskon_badge: "Prioritas 4 Wahana",
    periode: "Setiap Akhir Pekan",
    kode_promo: "BUNDLINGCEPAT",
    ringkasan:
      "Tiket terusan seharian dilengkapi jatah hingga 4 slot antrean virtual bersamaan untuk keluarga dan rombongan.",
    ketentuan:
      "Berlaku untuk seluruh wahana yang berstatus Lampu Hijau dan memenuhi syarat tinggi badan minimal pengunjung.",
    gambar_url: "/photos/hero-jelajahin.jpg",
  },
  {
    id: 3,
    judul: "Early Bird Kunjungan Pagi Hari",
    kategori: "Tiket Hemat",
    diskon_badge: "Diskon Rp 40.000",
    periode: "Pembelian H-3 Kunjungan",
    kode_promo: "PAGIJELAJAH40",
    ringkasan:
      "Potongan langsung per tiket untuk pemesanan online minimal 3 hari sebelum tanggal kunjungan yang masih tersedia.",
    ketentuan:
      "Kuota promo terbatas untuk 500 pemesan pertama setiap harinya dan langsung aktif saat check-in di gerbang utama.",
    gambar_url: "/photos/unit-air.jpg",
  },
  {
    id: 4,
    judul: "Promo Weekend Seru Bareng Teman",
    kategori: "Tiket Hemat",
    diskon_badge: "Beli 3 Dapat Kupon F&B",
    periode: "Sabtu & Minggu",
    kode_promo: "WEEKENDKULINER",
    ringkasan:
      "Bonus voucher minuman segar di area restoran kawasan untuk setiap transaksi minimal 3 tiket terusan akhir pekan.",
    ketentuan:
      "Voucher dapat ditukarkan di outlet Food & Beverages mitra selama tiket berstatus Aktif di Kawasan.",
    gambar_url: "/photos/resort-kuliner.jpg",
  },
];

export const DEMO_ACARA_LIST: AcaraItem[] = [
  {
    id: 1,
    judul: "Parade Fantasi Keliling Dunia",
    kategori: "Parade",
    lokasi: "Boulevard Utama Jelajahin",
    jadwal: "Setiap Sabtu & Minggu",
    jam: "15:30 - 16:30 WIB",
    ringkasan:
      "Iring-iringan karakter maskot Jelajahin, kostum tematik zona Eropa hingga Asia, dan atraksi musik jalanan.",
    gambar_url: "/photos/unit-wahana.jpg",
  },
  {
    id: 2,
    judul: "Pentas Musik Senja Pesisir",
    kategori: "Musik",
    lokasi: "Panggung Terbuka Pantai Timur",
    jadwal: "Akhir Pekan & Hari Libur",
    jam: "17:00 - 19:30 WIB",
    ringkasan:
      "Penampilan band akustik dan musisi tamu di tepi pantai yang dapat dinikmati setelah keluar dari area wahana.",
    gambar_url: "/photos/hero-jelajahin.jpg",
  },
  {
    id: 3,
    judul: "Pertunjukan Sulap & Ilusi Keluarga",
    kategori: "Pertunjukan",
    lokasi: "Indoor Stage Zona Keluarga",
    jadwal: "Harian (Selasa sampai Minggu)",
    jam: "13:00 & 16:00 WIB",
    ringkasan:
      "Pertunjukan interaktif keluarga yang cocok ditonton anak-anak sembari beristirahat menunggu panggilan kloter antrean virtual.",
    gambar_url: "/photos/unit-satwa.jpg",
  },
  {
    id: 4,
    judul: "Festival Kuliner Nusantara Malam",
    kategori: "Parade",
    lokasi: "Promenade Pesisir Jelajahin",
    jadwal: "Jumat sampai Minggu",
    jam: "16:00 - 21:00 WIB",
    ringkasan:
      "Deretan gerai kuliner khas daerah dengan pertunjukan seni tari tradisional dan area duduk terbuka tepi laut.",
    gambar_url: "/photos/resort-kuliner.jpg",
  },
];

export const DEMO_VENUE_LIST: VenueItem[] = [
  {
    id: 1,
    nama: "Laguna Pesisir Cottage",
    kategori: "Resort",
    area: "Tepi Pantai Timur Kawasan",
    harga_mulai: "Mulai Rp 1.150.000 / malam",
    fasilitas: "Cottage keluarga, kolam renang tepi laut, akses shuttle kawasan",
    ringkasan:
      "Penginapan bernuansa cottage pribadi di pinggir pantai yang dekat dengan gerbang utama kawasan wisata Jelajahin.",
    gambar_url: "/photos/resort-kuliner.jpg",
  },
  {
    id: 2,
    nama: "Grand Marina Resort & Convention",
    kategori: "Hotel",
    area: "Kawasan Pesisir Jelajahin",
    harga_mulai: "Mulai Rp 980.000 / malam",
    fasilitas: "Kamar menghadap laut, kolam anak, ruang pertemuan & aula acara",
    ringkasan:
      "Hotel bintang empat dengan akses berjalan kaki menuju pantai dan layanan kendaraan kawasan menuju pintu masuk taman wisata.",
    gambar_url: "/photos/hero-jelajahin.jpg",
  },
  {
    id: 3,
    nama: "Jelajahin Gateway Hotel",
    kategori: "Hotel",
    area: "Dekat Gerbang Utama Taman Wisata",
    harga_mulai: "Mulai Rp 920.000 / malam",
    fasilitas: "Hanya 5 menit ke gerbang utama, kolam renang laguna, taman bermain anak",
    ringkasan:
      "Pilihan menginap terdekat dari pintu gerbang utama agar pengunjung bisa masuk kawasan lebih pagi saat wahana baru dibuka.",
    gambar_url: "/photos/unit-air.jpg",
  },
  {
    id: 4,
    nama: "Taman Hijau Multipurpose Venue",
    kategori: "Venue Acara",
    area: "Taman Hijau Jelajahin",
    harga_mulai: "Reservasi Rombongan & Sekolah",
    fasilitas: "Area gathering hingga 1.500 orang, taman hijau, panggung outdoor",
    ringkasan:
      "Area terbuka hijau untuk acara studi tur sekolah, gathering komunitas, dan kegiatan luar ruang keluarga.",
    gambar_url: "/photos/unit-satwa.jpg",
  },
];

export const DEMO_FNB_LIST: FnbItem[] = [
  {
    id: 1,
    nama: "Dermaga Rasa Seafood",
    kategori: "Tepi Pantai",
    area: "Pintu Timur Pesisir Jelajahin",
    jam_buka: "11:00 - 22:00 WIB",
    kisaran_harga: "Rp 85.000 - Rp 250.000 / porsi",
    menu_andalan: "Ikan bakar segar, udang saus madu, kepiting lada hitam",
    gambar_url: "/photos/resort-kuliner.jpg",
  },
  {
    id: 2,
    nama: "Food Court Zona Petualangan",
    kategori: "Restoran Keluarga",
    area: "Zona Air (Dekat Arung Jeram)",
    jam_buka: "09:30 - 18:00 WIB",
    kisaran_harga: "Rp 35.000 - Rp 75.000 / porsi",
    menu_andalan: "Nasi ayam crispy, mi goreng spesial, es teh tarik dingin",
    gambar_url: "/photos/unit-wahana.jpg",
  },
  {
    id: 3,
    nama: "Kapal Pinisi Resto",
    kategori: "Restoran Keluarga",
    area: "Area Tengah Taman Wisata",
    jam_buka: "10:00 - 17:30 WIB",
    kisaran_harga: "Rp 45.000 - Rp 95.000 / porsi",
    menu_andalan: "Paket nasi bento keluarga, soto betawi, es kelapa muda",
    gambar_url: "/photos/unit-akuarium.jpg",
  },
  {
    id: 4,
    nama: "Dermaga Senja Kopi & Gelato",
    kategori: "Kafe & Minuman",
    area: "Dermaga Timur Pantai Jelajahin",
    jam_buka: "10:00 - 21:00 WIB",
    kisaran_harga: "Rp 28.000 - Rp 80.000",
    menu_andalan: "Kopi susu gula aren, gelato artisan, kentang goreng keju",
    gambar_url: "/photos/hero-jelajahin.jpg",
  },
];

export const DEMO_BLOG_LIST: BlogPost[] = [
  {
    id: 1,
    judul: "Cara Keliling Taman Wisata Bebas Antre Lama Pakai Antrean Virtual",
    kategori: "Panduan Kunjungan",
    tanggal: "18 November 2026",
    waktu_baca: "4 menit baca",
    ringkasan:
      "Atur urutan naik wahana ekstrem dan wahana air sejak pagi dengan memantau lampu status dan mengambil kloter virtual lewat ponsel.",
    isi: [
      "Datang sebelum pukul 09:30 WIB memberi kesempatan paling leluasa karena gerbang baru dibuka dan kuota pengunjung masih tersebar di area depan.",
      "Gunakan halaman Wahana untuk melihat kombinasi Lampu Hijau dan tingkat keramaian Sepi terlebih dahulu. Naiklah wahana dengan durasi cepat atau antrean pendek sambil mendaftarkan nomor antrean virtual untuk wahana favorit seperti Lintas Langit Coaster.",
      "Selama nomor antreanmu masih berstatus Menunggu, manfaatkan waktu untuk beristirahat di area kuliner atau menonton pertunjukan dalam ruangan tanpa takut kehilangan giliran kloter.",
    ],
    gambar_url: "/photos/unit-wahana.jpg",
  },
  {
    id: 2,
    judul: "Panduan Memilih Wahana Aman Berdasarkan Tinggi Badan Anak",
    kategori: "Tips Wahana",
    tanggal: "14 November 2026",
    waktu_baca: "3 menit baca",
    ringkasan:
      "Ketahui patokan tinggi badan minimal sebelum berjalan ke lokasi wahana agar anak tidak kecewa saat diperiksa petugas di pintu antrean.",
    isi: [
      "Setiap wahana di kawasan wisata memiliki batas tinggi minimal demi menjaga pengaman kursi bekerja sempurna sepanjang permainan berlangsung.",
      "Untuk anak dengan tinggi di bawah 100 cm, pilihan paling nyaman meliputi Galeri Diorama Nusantara dan Komidi Putar Klasik. Anak bertinggi 110 cm sudah dapat mencoba Arung Jeram Jelajahin dengan pendampingan keluarga.",
      "Fitur Filter Tinggi Badan di Jelajahin langsung menandai wahana mana yang sudah memenuhi syarat dan mana yang perlu dilewati sebelum kamu mengambil nomor antrean.",
    ],
    gambar_url: "/photos/unit-satwa.jpg",
  },
  {
    id: 3,
    judul: "Rekomendasi Tempat Makan & Menginap Satu Kawasan Jelajahin",
    kategori: "Kuliner & Menginap",
    tanggal: "10 November 2026",
    waktu_baca: "5 menit baca",
    ringkasan:
      "Padukan seharian bermain di taman wisata dengan pilihan makan siang cepat di dalam taman serta penginapan resort tepi pantai untuk liburan keluarga.",
    isi: [
      "Untuk makan siang di sela permainan wahana, pilih Food Court Zona Petualangan atau Kapal Pinisi Resto agar tidak perlu keluar dari gerbang utama kawasan.",
      "Bagi pengunjung dari luar kota yang ingin masuk paling pagi keesokan harinya, menginap di hotel sekitar gerbang utama seperti Jelajahin Gateway Hotel atau cottage Laguna Pesisir Cottage mempersingkat waktu tempuh ke area parkir.",
      "Menjelang sore setelah pukul 17:00 WIB, kamu bisa bergeser ke kawasan tepi pantai untuk menikmati hidangan laut di Dermaga Rasa Seafood sambil menyaksikan hiburan musik senja.",
    ],
    gambar_url: "/photos/resort-kuliner.jpg",
  },
];
