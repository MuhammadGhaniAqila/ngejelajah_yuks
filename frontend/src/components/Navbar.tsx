"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Search, UserRound, X } from "lucide-react";
import {
  FILAMENT_ADMIN_URL,
  api,
  clearAuthSession,
  getSavedToken,
  useAuthUser,
} from "@/lib/api";

type MenuKey = "wahana" | "tiket" | "jelajah" | null;

const DROPDOWNS: Record<
  Exclude<MenuKey, null>,
  { label: string; paths: string[]; items: { href: string; label: string }[] }
> = {
  wahana: {
    label: "Wahana",
    paths: ["/wahana"],
    items: [
      { href: "/wahana", label: "Semua Wahana" },
      { href: "/wahana?zona=Ekstrem", label: "Zona Ekstrem" },
      { href: "/wahana?zona=Keluarga", label: "Zona Keluarga" },
      { href: "/wahana?zona=Air", label: "Zona Air" },
    ],
  },
  tiket: {
    label: "Tiket & Promo",
    paths: ["/pesan", "/promo", "/tiket-saya"],
    items: [
      { href: "/pesan", label: "Pesan Tiket Dufan" },
      { href: "/promo", label: "Lihat Semua Promo" },
      { href: "/tiket-saya", label: "E-Ticket & Antrean Saya" },
    ],
  },
  jelajah: {
    label: "Jelajah",
    paths: ["/acara", "/venue", "/kuliner"],
    items: [
      { href: "/acara", label: "Acara & Hiburan" },
      { href: "/venue", label: "Resort & Hotel (Venue)" },
      { href: "/kuliner", label: "Food & Beverages" },
    ],
  },
};

const MOBILE_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/pesan", label: "Pesan Tiket" },
  { href: "/promo", label: "Promo Spesial" },
  { href: "/wahana", label: "Katalog Wahana" },
  { href: "/acara", label: "Acara & Hiburan" },
  { href: "/venue", label: "Resort & Hotel (Venue)" },
  { href: "/kuliner", label: "Food & Beverages" },
  { href: "/blog", label: "Blog & Panduan" },
  { href: "/tiket-saya", label: "Tiket & Antrean Saya" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthUser();
  const [openForPath, setOpenForPath] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<MenuKey>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navAreaRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const menuOpen = openForPath === pathname;

  useEffect(() => {
    if (!menuOpen && !openDropdown && !searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenForPath(null);
        setOpenDropdown(null);
        setSearchOpen(false);
      }
    };
    const onPointerDown = (e: MouseEvent) => {
      if (
        openDropdown &&
        navAreaRef.current &&
        !navAreaRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onPointerDown);
    };
  }, [menuOpen, openDropdown, searchOpen]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchText.trim();
    setSearchOpen(false);
    setOpenForPath(null);
    router.push(
      trimmed ? `/wahana?q=${encodeURIComponent(trimmed)}` : "/wahana"
    );
  }

  async function handleLogout() {
    const token = getSavedToken();
    if (token) {
      try {
        await api.logout();
      } catch {
        // Ignore network errors when clearing local session
      }
    }
    clearAuthSession();
    setOpenForPath(null);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#DCE6F5] bg-white/95 text-[#0F2347] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center gap-2.5 rounded-full pr-2 text-[#0033A0]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/photos/logo-jelajahin.jpg"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full bg-white object-cover"
          />
          <span
            className="text-xl font-bold tracking-tight uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Jelajahin
          </span>
          <span className="hidden whitespace-nowrap rounded-full bg-[#EBF5FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#0033A0] lg:inline-block">
            Dufan Ancol
          </span>
        </Link>

        {/* Desktop Single-Row Navigation */}
        <div ref={navAreaRef} className="hidden items-center gap-2 md:flex">
          <nav aria-label="Utama" className="flex items-center gap-0.5">
            <Link
              href="/"
              aria-current={pathname === "/" ? "page" : undefined}
              className={`relative inline-flex min-h-[44px] items-center whitespace-nowrap px-3 py-2 text-sm font-semibold transition-colors ${
                pathname === "/"
                  ? "text-[#0033A0]"
                  : "text-[#475569] hover:text-[#0033A0]"
              }`}
            >
              <span>Beranda</span>
              {pathname === "/" ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 bottom-1.5 h-[2px] rounded-full bg-[#0033A0]"
                />
              ) : null}
            </Link>

            {(Object.keys(DROPDOWNS) as Exclude<MenuKey, null>[]).map((key) => {
              const group = DROPDOWNS[key];
              const isOpen = openDropdown === key;
              const isActive = group.paths.includes(pathname);
              return (
                <div key={key} className="relative">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-haspopup="menu"
                    onClick={() =>
                      setOpenDropdown((prev) => (prev === key ? null : key))
                    }
                    className={`relative inline-flex min-h-[44px] items-center gap-1 whitespace-nowrap px-3 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? "text-[#0033A0]"
                        : "text-[#475569] hover:text-[#0033A0]"
                    }`}
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 bottom-1.5 h-[2px] rounded-full bg-[#0033A0]"
                      />
                    ) : null}
                  </button>

                  {isOpen ? (
                    <div
                      role="menu"
                      aria-label={`Menu ${group.label}`}
                      className="absolute top-full left-0 z-50 mt-1.5 w-52 rounded-2xl border border-[#DCE6F5] bg-white p-1.5 shadow-lg"
                    >
                      {group.items.map((sub) => (
                        <Link
                          key={sub.href}
                          role="menuitem"
                          href={sub.href}
                          onClick={() => setOpenDropdown(null)}
                          className="flex min-h-[40px] items-center rounded-xl px-3 py-2 text-xs font-semibold text-[#0F2347] transition-colors hover:bg-[#EBF5FF] hover:text-[#0033A0]"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}

            <Link
              href="/blog"
              aria-current={pathname === "/blog" ? "page" : undefined}
              className={`relative inline-flex min-h-[44px] items-center whitespace-nowrap px-3 py-2 text-sm font-semibold transition-colors ${
                pathname === "/blog"
                  ? "text-[#0033A0]"
                  : "text-[#475569] hover:text-[#0033A0]"
              }`}
            >
              <span>Blog</span>
              {pathname === "/blog" ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 bottom-1.5 h-[2px] rounded-full bg-[#0033A0]"
                />
              ) : null}
            </Link>
          </nav>

          {searchOpen ? (
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-1 rounded-full border border-[#B9C8DC] bg-[#F4F8FC] px-3 py-1"
            >
              <input
                ref={searchInputRef}
                type="search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Cari wahana..."
                aria-label="Kata kunci nama wahana"
                className="w-28 bg-transparent py-1 text-xs text-[#0F2347] placeholder:text-[#5B6B82] focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Mulai pencarian wahana"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#0033A0] text-white"
              >
                <Search className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Tutup kolom pencarian"
                onClick={() => setSearchOpen(false)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#475569] hover:text-[#0F2347]"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              aria-label="Buka pencarian wahana"
              aria-expanded={searchOpen}
              onClick={() => {
                setSearchOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 0);
              }}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[#0F2347] transition-colors hover:bg-[#EBF5FF] hover:text-[#0033A0]"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              {user.role === "admin" || user.role === "operator" ? (
                <a
                  href={FILAMENT_ADMIN_URL}
                  className="inline-flex min-h-[40px] items-center whitespace-nowrap rounded-full border border-[#FFB800] bg-[#FFF6D6] px-3.5 py-1.5 text-xs font-bold text-[#8F6400] transition-colors hover:bg-[#FFB800] hover:text-[#0F2347]"
                >
                  Panel Admin
                </a>
              ) : null}
              <Link
                href="/tiket-saya"
                className="inline-flex min-h-[40px] items-center gap-2 whitespace-nowrap rounded-full border border-[#0033A0] bg-[#EBF5FF] px-3.5 py-1.5 text-xs font-bold text-[#0033A0] transition-colors hover:bg-[#0033A0] hover:text-white"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0033A0] text-[11px] font-bold text-white">
                  {user.nama_lengkap.charAt(0).toUpperCase()}
                </span>
                <span>{user.nama_lengkap.split(" ")[0]}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex min-h-[40px] items-center whitespace-nowrap rounded-full border border-[#CBD5E1] px-3.5 py-1.5 text-xs font-semibold text-[#475569] transition-colors hover:border-[#0033A0] hover:text-[#0033A0]"
              >
                Keluar
              </button>
            </div>
          ) : (
            <Link
              href="/masuk"
              aria-current={pathname === "/masuk" ? "page" : undefined}
              className="inline-flex min-h-[42px] items-center gap-2 whitespace-nowrap rounded-full border border-[#0033A0] bg-white px-4 py-1.5 text-xs font-bold text-[#0033A0] transition-colors hover:bg-[#0033A0] hover:text-white"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0033A0] text-white">
                <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span>Masuk Akun</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-full border border-[#DCE6F5] bg-[#F4F8FC] px-3.5 py-2 text-xs font-bold text-[#0033A0] md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-panel"
          onClick={() => setOpenForPath(menuOpen ? null : pathname)}
        >
          {menuOpen ? (
            <X className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Menu className="h-4 w-4" aria-hidden="true" />
          )}
          <span>Menu</span>
        </button>
      </div>

      {menuOpen ? (
        <div
          id="mobile-nav-panel"
          className="border-t border-[#DCE6F5] bg-white px-4 py-4 md:hidden"
        >
          <form onSubmit={handleSearchSubmit} className="mb-3 flex gap-2">
            <input
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Cari wahana Dufan..."
              aria-label="Cari wahana Dufan"
              className="min-h-[44px] flex-1 rounded-full border border-[#B9C8DC] bg-[#F4F8FC] px-4 py-2 text-sm text-[#0F2347] placeholder:text-[#5B6B82]"
            />
            <button
              type="submit"
              aria-label="Cari"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[#0033A0] text-white"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          <nav aria-label="Menu Mobile" className="flex flex-col gap-1">
            {MOBILE_LINKS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpenForPath(null)}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[44px] items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold ${
                    active
                      ? "bg-[#EBF5FF] text-[#0033A0]"
                      : "text-[#0F2347] hover:bg-[#F4F8FC]"
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="mt-2 flex flex-col gap-2 border-t border-[#DCE6F5] pt-3">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 px-1">
                    <span className="text-sm font-bold text-[#0F2347]">
                      {user.nama_lengkap}
                    </span>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex min-h-[44px] items-center rounded-full border border-[#B9C8DC] px-4 text-xs font-semibold text-[#475569]"
                    >
                      Keluar
                    </button>
                  </div>
                  {user.role === "admin" || user.role === "operator" ? (
                    <a
                      href={FILAMENT_ADMIN_URL}
                      onClick={() => setOpenForPath(null)}
                      className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-[#FFB800] bg-[#FFF6D6] px-4 text-sm font-bold text-[#8F6400]"
                    >
                      Panel Admin Filament
                    </a>
                  ) : null}
                </div>
              ) : (
                <Link
                  href="/masuk"
                  onClick={() => setOpenForPath(null)}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#0033A0] px-4 text-sm font-bold text-[#0033A0]"
                >
                  Masuk Akun
                </Link>
              )}
              <Link
                href="/pesan"
                onClick={() => setOpenForPath(null)}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#FFB800] px-4 text-sm font-bold text-[#0F2347]"
              >
                Pesan Tiket Dufan
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
