export type UserRole = "wisatawan" | "operator" | "admin";

export interface User {
  id: number;
  nama_lengkap: string;
  email: string;
  nik: string | null;
  no_wa: string | null;
  role: UserRole;
}

export interface PaketTiket {
  id: number;
  nama_paket: string;
  deskripsi: string;
  harga: number;
  jatah_antrean_aktif: number;
  is_bundle: boolean;
  is_active: boolean;
}

export interface KuotaHarian {
  tanggal: string;
  kuota_maksimal: number;
  kuota_terpakai: number;
  sisa_kuota: number;
  status_kawasan: "Buka" | "Tutup";
}

export interface Wahana {
  id: number;
  nama_wahana: string;
  zona: "Ekstrem" | "Keluarga" | "Air";
  deskripsi: string;
  gambar_url: string;
  tinggi_minimal_cm: number;
  kategori_usia: string;
  kapasitas_kloter: number;
  durasi_menit: number;
  status_lampu: "Hijau" | "Merah" | "Maintenance";
  crowd_meter: "Sepi" | "Sedang" | "Padat";
  kloter_berjalan: number;
  jumlah_antrean_aktif?: number;
}

export interface ReservasiTiket {
  id: number;
  kode_booking: string;
  qr_token: string;
  tanggal_kunjungan: string;
  jumlah_tiket: number;
  total_harga: number;
  metode_pembayaran: string;
  status_pembayaran: "Menunggu" | "Lunas" | "Dibatalkan";
  status_kunjungan: "Belum Check-in" | "Aktif di Kawasan" | "Selesai";
  waktu_checkin: string | null;
  paket: PaketTiket;
}

export interface AntreanVirtual {
  id: number;
  wahana_id: number;
  reservasi_id: number;
  nomor_antrean: string;
  nomor_kloter: number;
  estimasi_tunggu_menit: number;
  status_antrean: "Menunggu" | "Dipanggil" | "Selesai" | "Dibatalkan";
  waktu_daftar: string;
  wahana: Wahana;
}

export interface KawasanInfo {
  nama_kawasan: string;
  jam_buka: string;
  jam_tutup: string;
  hari_ini: KuotaHarian;
  kalender_kuota: KuotaHarian[];
}

export interface PromoItem {
  id: number;
  judul: string;
  kategori: "Tiket Hemat" | "Bundling" | "Member & Pelajar";
  diskon_badge: string;
  periode: string;
  kode_promo: string;
  ringkasan: string;
  ketentuan: string;
  gambar_url?: string;
}

export interface AcaraItem {
  id: number;
  judul: string;
  kategori: "Parade" | "Pertunjukan" | "Musik";
  lokasi: string;
  jadwal: string;
  jam: string;
  ringkasan: string;
  gambar_url?: string;
}

export interface VenueItem {
  id: number;
  nama: string;
  kategori: "Resort" | "Hotel" | "Venue Acara";
  area: string;
  harga_mulai: string;
  fasilitas: string;
  ringkasan: string;
  gambar_url?: string;
}

export interface FnbItem {
  id: number;
  nama: string;
  kategori: "Restoran Keluarga" | "Kafe & Minuman" | "Tepi Pantai";
  area: string;
  jam_buka: string;
  kisaran_harga: string;
  menu_andalan: string;
  gambar_url?: string;
}

export interface BlogPost {
  id: number;
  judul: string;
  kategori: "Panduan Kunjungan" | "Tips Wahana" | "Kuliner & Menginap";
  tanggal: string;
  waktu_baca: string;
  ringkasan: string;
  isi: string[];
  gambar_url?: string;
}

export interface AdminReservasiItem {
  id: number;
  kode_booking: string;
  qr_token: string;
  tanggal_kunjungan: string;
  jumlah_tiket: number;
  total_harga: number;
  metode_pembayaran: string;
  status_pembayaran: string;
  status_kunjungan: string;
  waktu_checkin: string | null;
  pengunjung_nama: string;
  pengunjung_email: string;
  nama_paket: string;
}

export interface AdminAntreanItem {
  id: number;
  nomor_antrean: string;
  nomor_kloter: number;
  estimasi_tunggu_menit: number;
  status_antrean: "Menunggu" | "Dipanggil" | "Selesai" | "Dibatalkan";
  pengunjung_nama: string;
  nama_wahana: string;
  zona: string;
}

export interface AdminOverviewResponse {
  stats: {
    kuota_hari_ini: KuotaHarian;
    total_tiket_terjual: number;
    total_pendapatan: number;
    tiket_aktif_kawasan: number;
    antrean_aktif: number;
    wahana_hijau: number;
    wahana_merah: number;
    wahana_maintenance: number;
  };
  wahana: Wahana[];
  reservasi_terbaru: AdminReservasiItem[];
  antrean_aktif_list: AdminAntreanItem[];
  kalender_kuota: KuotaHarian[];
}
