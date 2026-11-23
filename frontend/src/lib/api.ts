import { useSyncExternalStore } from "react";
import {
  DEMO_ACARA_LIST,
  DEMO_BLOG_LIST,
  DEMO_FNB_LIST,
  DEMO_PAKET_LIST,
  DEMO_PROMO_LIST,
  DEMO_USER,
  DEMO_VENUE_LIST,
  DEMO_WAHANA_LIST,
  getDemoKawasanInfo,
  loginDemoUser,
  readDemoAntrean,
  readDemoReservasi,
  registerDemoUser,
  saveDemoAntrean,
  saveDemoReservasi,
} from "./demo-data";
import type {
  AcaraItem,
  AntreanVirtual,
  BlogPost,
  FnbItem,
  KawasanInfo,
  PaketTiket,
  PromoItem,
  ReservasiTiket,
  User,
  VenueItem,
  Wahana,
} from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const IS_FRONTEND_ONLY = process.env.NEXT_PUBLIC_FRONTEND_ONLY === "true";

const TOKEN_KEY = "jelajahin_auth_token";
const USER_KEY = "jelajahin_auth_user";

let cachedUserRaw: string | null = null;
let cachedUserObj: User | null = null;

export function getSavedToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getSavedUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (raw === cachedUserRaw) return cachedUserObj;
  cachedUserRaw = raw;
  if (!raw) {
    cachedUserObj = null;
    return null;
  }
  try {
    cachedUserObj = JSON.parse(raw) as User;
  } catch {
    cachedUserObj = null;
  }
  return cachedUserObj;
}

function subscribeAuth(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("jelajahin-auth-changed", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("jelajahin-auth-changed", callback);
    window.removeEventListener("storage", callback);
  };
}

export function useAuthUser(): User | null {
  return useSyncExternalStore(subscribeAuth, getSavedUser, () => null);
}

export function useAuthToken(): string | null {
  return useSyncExternalStore(subscribeAuth, getSavedToken, () => null);
}

export function saveAuthSession(token: string, user: User): void {
  const serialized = JSON.stringify(user);
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, serialized);
  cachedUserRaw = serialized;
  cachedUserObj = user;
  window.dispatchEvent(new Event("jelajahin-auth-changed"));
}

export function clearAuthSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  cachedUserRaw = null;
  cachedUserObj = null;
  window.dispatchEvent(new Event("jelajahin-auth-changed"));
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getSavedToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      payload?.message || "Gagal memproses permintaan.",
      res.status,
      payload?.errors
    );
  }

  return (payload?.data !== undefined ? payload.data : payload) as T;
}

function createDemoReservasiRecord(body: {
  paket_id: number;
  tanggal_kunjungan: string;
  jumlah_tiket: number;
  metode_pembayaran: string;
}): ReservasiTiket {
  const paket =
    DEMO_PAKET_LIST.find((p) => p.id === body.paket_id) || DEMO_PAKET_LIST[0];
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  const datePart = body.tanggal_kunjungan.replaceAll("-", "");
  const record: ReservasiTiket = {
    id: Date.now(),
    kode_booking: `JLJ-${datePart}-${suffix}`,
    qr_token: `JLJ-QR-${suffix}${Date.now().toString().slice(-6)}`,
    tanggal_kunjungan: body.tanggal_kunjungan,
    jumlah_tiket: body.jumlah_tiket,
    total_harga: paket.harga * body.jumlah_tiket,
    metode_pembayaran: body.metode_pembayaran,
    status_pembayaran: "Lunas",
    status_kunjungan: "Aktif di Kawasan",
    waktu_checkin: "Siap Scan",
    paket,
  };
  const existing = readDemoReservasi();
  saveDemoReservasi([record, ...existing]);
  return record;
}

function createDemoAntreanRecord(wahanaId: number): AntreanVirtual {
  const wahana = DEMO_WAHANA_LIST.find((w) => w.id === wahanaId);
  if (!wahana) {
    throw new ApiError("Wahana tidak ditemukan.", 404);
  }
  if (wahana.status_lampu !== "Hijau") {
    throw new ApiError(
      `Wahana ${wahana.nama_wahana} sedang berstatus lampu ${wahana.status_lampu}.`,
      422
    );
  }
  const existing = readDemoAntrean();
  const duplicate = existing.find(
    (a) =>
      a.wahana_id === wahanaId &&
      (a.status_antrean === "Menunggu" || a.status_antrean === "Dipanggil")
  );
  if (duplicate) {
    throw new ApiError(
      "Kamu sudah terdaftar di antrean aktif untuk wahana ini.",
      422
    );
  }
  const tickets = readDemoReservasi();
  const activeTicket =
    tickets.find((t) => t.status_kunjungan === "Aktif di Kawasan") ||
    tickets[0];
  if (!activeTicket) {
    throw new ApiError("Silakan pesan tiket terlebih dahulu.", 422);
  }

  const activeCount = existing.filter(
    (a) => a.status_antrean === "Menunggu" || a.status_antrean === "Dipanggil"
  ).length;
  if (activeCount >= activeTicket.paket.jatah_antrean_aktif) {
    throw new ApiError(
      `Batas ${activeTicket.paket.jatah_antrean_aktif} antrean aktif untuk paketmu sudah tercapai.`,
      422
    );
  }

  const prefix = wahana.nama_wahana.charAt(0).toUpperCase();
  const num = String((wahana.jumlah_antrean_aktif || 5) + activeCount + 12).padStart(
    3,
    "0"
  );
  const record: AntreanVirtual = {
    id: Date.now(),
    wahana_id: wahana.id,
    reservasi_id: activeTicket.id,
    nomor_antrean: `#${prefix}-${num}`,
    nomor_kloter: wahana.kloter_berjalan + 1,
    estimasi_tunggu_menit: wahana.crowd_meter === "Sepi" ? 5 : 14,
    status_antrean: "Menunggu",
    waktu_daftar: new Date().toISOString(),
    wahana,
  };
  saveDemoAntrean([record, ...existing]);
  return record;
}

export interface PortalHomeBundle {
  kawasan: KawasanInfo;
  paket_tiket: PaketTiket[];
  wahana: Wahana[];
  promo: PromoItem[];
  acara: AcaraItem[];
  venue: VenueItem[];
  kuliner: FnbItem[];
  blog: BlogPost[];
}

export const api = {
  getPortalHome: async (): Promise<PortalHomeBundle> => {
    if (IS_FRONTEND_ONLY) {
      return {
        kawasan: getDemoKawasanInfo(),
        paket_tiket: DEMO_PAKET_LIST,
        wahana: DEMO_WAHANA_LIST,
        promo: DEMO_PROMO_LIST,
        acara: DEMO_ACARA_LIST,
        venue: DEMO_VENUE_LIST,
        kuliner: DEMO_FNB_LIST,
        blog: DEMO_BLOG_LIST,
      };
    }
    return request<PortalHomeBundle>("/portal-home");
  },

  getKawasanInfo: async (tanggal?: string): Promise<KawasanInfo> => {
    if (IS_FRONTEND_ONLY) return getDemoKawasanInfo();
    return request<KawasanInfo>(
      `/kawasan${tanggal ? `?tanggal=${encodeURIComponent(tanggal)}` : ""}`
    );
  },

  getPaketTiket: async (): Promise<PaketTiket[]> => {
    if (IS_FRONTEND_ONLY) return DEMO_PAKET_LIST;
    return request<PaketTiket[]>("/paket-tiket");
  },

  getWahana: async (params?: {
    zona?: string;
    tinggi?: number | null;
    crowd?: string;
    q?: string;
  }): Promise<Wahana[]> => {
    if (IS_FRONTEND_ONLY) {
      return DEMO_WAHANA_LIST.filter((w) => {
        if (params?.zona && params.zona !== "Semua" && w.zona !== params.zona)
          return false;
        if (params?.crowd && params.crowd !== "Semua" && w.crowd_meter !== params.crowd)
          return false;
        if (
          params?.q &&
          !w.nama_wahana.toLowerCase().includes(params.q.toLowerCase())
        )
          return false;
        return true;
      });
    }
    const query = new URLSearchParams();
    if (params?.zona && params.zona !== "Semua") query.set("zona", params.zona);
    if (params?.tinggi) query.set("tinggi", String(params.tinggi));
    if (params?.crowd && params.crowd !== "Semua")
      query.set("crowd", params.crowd);
    if (params?.q) query.set("q", params.q);
    const qs = query.toString();
    return request<Wahana[]>(`/wahana${qs ? `?${qs}` : ""}`);
  },

  getPromo: async (kategori?: string): Promise<PromoItem[]> => {
    if (IS_FRONTEND_ONLY) {
      return !kategori || kategori === "Semua"
        ? DEMO_PROMO_LIST
        : DEMO_PROMO_LIST.filter((p) => p.kategori === kategori);
    }
    const qs = kategori && kategori !== "Semua" ? `?kategori=${encodeURIComponent(kategori)}` : "";
    return request<PromoItem[]>(`/promo${qs}`);
  },

  getAcara: async (kategori?: string): Promise<AcaraItem[]> => {
    if (IS_FRONTEND_ONLY) {
      return !kategori || kategori === "Semua"
        ? DEMO_ACARA_LIST
        : DEMO_ACARA_LIST.filter((a) => a.kategori === kategori);
    }
    const qs = kategori && kategori !== "Semua" ? `?kategori=${encodeURIComponent(kategori)}` : "";
    return request<AcaraItem[]>(`/acara${qs}`);
  },

  getVenue: async (kategori?: string): Promise<VenueItem[]> => {
    if (IS_FRONTEND_ONLY) {
      return !kategori || kategori === "Semua"
        ? DEMO_VENUE_LIST
        : DEMO_VENUE_LIST.filter((v) => v.kategori === kategori);
    }
    const qs = kategori && kategori !== "Semua" ? `?kategori=${encodeURIComponent(kategori)}` : "";
    return request<VenueItem[]>(`/venue${qs}`);
  },

  getKuliner: async (kategori?: string): Promise<FnbItem[]> => {
    if (IS_FRONTEND_ONLY) {
      return !kategori || kategori === "Semua"
        ? DEMO_FNB_LIST
        : DEMO_FNB_LIST.filter((k) => k.kategori === kategori);
    }
    const qs = kategori && kategori !== "Semua" ? `?kategori=${encodeURIComponent(kategori)}` : "";
    return request<FnbItem[]>(`/kuliner${qs}`);
  },

  getBlog: async (kategori?: string): Promise<BlogPost[]> => {
    if (IS_FRONTEND_ONLY) {
      return !kategori || kategori === "Semua"
        ? DEMO_BLOG_LIST
        : DEMO_BLOG_LIST.filter((b) => b.kategori === kategori);
    }
    const qs = kategori && kategori !== "Semua" ? `?kategori=${encodeURIComponent(kategori)}` : "";
    return request<BlogPost[]>(`/blog${qs}`);
  },

  register: async (body: {
    nama_lengkap: string;
    email: string;
    password: string;
    nik: string;
    no_wa: string;
  }) => {
    if (IS_FRONTEND_ONLY) return registerDemoUser(body);
    return request<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  login: async (body: { email: string; password: string }) => {
    if (IS_FRONTEND_ONLY) return loginDemoUser(body.email);
    return request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  logout: async () => {
    if (IS_FRONTEND_ONLY) return { message: "Berhasil keluar dari sesi." };
    return request<{ message: string }>("/auth/logout", {
      method: "POST",
    });
  },

  getMe: async () => {
    if (IS_FRONTEND_ONLY) return getSavedUser() || DEMO_USER;
    return request<User>("/auth/me");
  },

  createReservasi: async (body: {
    paket_id: number;
    tanggal_kunjungan: string;
    jumlah_tiket: number;
    metode_pembayaran: string;
  }) => {
    if (IS_FRONTEND_ONLY) return createDemoReservasiRecord(body);
    return request<ReservasiTiket>("/reservasi", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  getReservasiSaya: async () => {
    if (IS_FRONTEND_ONLY) return readDemoReservasi();
    return request<ReservasiTiket[]>("/reservasi/saya");
  },

  ambilAntrean: async (wahanaId: number) => {
    if (IS_FRONTEND_ONLY) return createDemoAntreanRecord(wahanaId);
    return request<AntreanVirtual>("/antrean", {
      method: "POST",
      body: JSON.stringify({ wahana_id: wahanaId }),
    });
  },

  getAntreanSaya: async () => {
    if (IS_FRONTEND_ONLY) return readDemoAntrean();
    return request<AntreanVirtual[]>("/antrean/saya");
  },

  batalkanAntrean: async (antreanId: number) => {
    if (IS_FRONTEND_ONLY) {
      const list = readDemoAntrean().map((a) =>
        a.id === antreanId
          ? { ...a, status_antrean: "Dibatalkan" as const }
          : a
      );
      saveDemoAntrean(list);
      const updated = list.find((a) => a.id === antreanId);
      if (!updated) throw new ApiError("Antrean tidak ditemukan.", 404);
      return updated;
    }
    return request<AntreanVirtual>(`/antrean/${antreanId}/batal`, {
      method: "PATCH",
    });
  },
};

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}
