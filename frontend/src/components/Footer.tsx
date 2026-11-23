import Link from "next/link";

const filamentAdminUrl =
  process.env.NEXT_PUBLIC_ADMIN_URL ||
  (process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "/admin")
    : "http://127.0.0.1:8000/admin");

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#DCE6F5] bg-white text-[#475569]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos/logo-jelajahin.jpg"
              alt=""
              width={38}
              height={38}
              className="h-9 w-9 shrink-0 rounded-full bg-white object-cover"
            />
            <p
              className="text-2xl font-bold tracking-wide text-[#0033A0] uppercase"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Jelajahin
            </p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#475569]">
            Layanan resmi tiket berkuota, promo kunjungan, acara hiburan,
            akomodasi resort, kuliner pesisir, dan antrean virtual Jelajahin
            Theme Park.
          </p>
          <p className="mt-3 text-xs font-bold text-[#0033A0]">
            Jam Operasional Kawasan: 09:00 - 18:00 WIB
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold tracking-wide text-[#0F2347]">
            Tiket &amp; Wahana
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-[#0033A0] hover:underline">
                Beranda Utama
              </Link>
            </li>
            <li>
              <Link
                href="/pesan"
                className="hover:text-[#0033A0] hover:underline"
              >
                Pesan Tiket &amp; Paket
              </Link>
            </li>
            <li>
              <Link
                href="/wahana"
                className="hover:text-[#0033A0] hover:underline"
              >
                Katalog Wahana &amp; Tinggi Badan
              </Link>
            </li>
            <li>
              <Link
                href="/tiket-saya"
                className="hover:text-[#0033A0] hover:underline"
              >
                E-Ticket QR &amp; Antrean Virtual
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold tracking-wide text-[#0F2347]">
            Promo, Acara &amp; Kuliner
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href="/promo"
                className="hover:text-[#0033A0] hover:underline"
              >
                Promo Spesial
              </Link>
            </li>
            <li>
              <Link
                href="/acara"
                className="hover:text-[#0033A0] hover:underline"
              >
                Acara &amp; Pertunjukan
              </Link>
            </li>
            <li>
              <Link
                href="/venue"
                className="hover:text-[#0033A0] hover:underline"
              >
                Resort &amp; Hotel (Venue)
              </Link>
            </li>
            <li>
              <Link
                href="/kuliner"
                className="hover:text-[#0033A0] hover:underline"
              >
                Food &amp; Beverages
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="hover:text-[#0033A0] hover:underline"
              >
                Blog &amp; Panduan Wisata
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold tracking-wide text-[#0F2347]">
            Akun &amp; Layanan Pengunjung
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href="/masuk"
                className="font-semibold text-[#0033A0] hover:underline"
              >
                Masuk Akun Pengunjung
              </Link>
            </li>
            <li>
              <Link
                href="/daftar"
                className="hover:text-[#0033A0] hover:underline"
              >
                Daftar Akun Baru
              </Link>
            </li>
            <li>
              <a
                href={filamentAdminUrl}
                className="hover:text-[#0033A0] hover:underline"
              >
                Panel Admin Filament
              </a>
            </li>
            <li className="text-xs text-[#475569]">
              Jl. Boulevard Pesisir No. 7, Kawasan Wisata Jelajahin, Jakarta
            </li>
            <li className="text-xs font-semibold text-[#0033A0]">
              Jelajahin Customer Care: (021) 5000-7788
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
