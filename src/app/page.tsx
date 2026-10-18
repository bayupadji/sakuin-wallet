import Link from 'next/link';
import { LandingHero } from '@/features/wallet/presentation/customer/landing-hero';
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  FileCheck,
  Lock,
  ShieldCheck,
  Smartphone,
  Wallet,
  Zap,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#090D14] text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500/20 selection:text-teal-400">
      {/* 1. Sleek Obsidian Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#090D14]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 font-bold text-base shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                S
              </span>
              <span className="text-base font-bold tracking-tight text-white">
                Sakuin
              </span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-950/50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-300">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              USD Digital Wallet
            </span>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
            <a href="#fitur" className="hover:text-white transition-colors">
              Fitur
            </a>
            <a href="#kartu" className="hover:text-white transition-colors">
              Kartu Virtual
            </a>
            <a href="#biaya" className="hover:text-white transition-colors">
              Biaya & Kurs
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/signin"
              className="min-h-[44px] px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center"
            >
              Masuk
            </Link>
            <Link href="/signup">
              <button
                type="button"
                className="min-h-[44px] px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 flex items-center gap-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
              >
                <Wallet className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Buka Akun</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-1">
        {/* Hero Section Showcase */}
        <LandingHero />

        {/* 3. Core Pillars Feature Grid (Fitur) */}
        <section id="fitur" className="scroll-mt-20 py-20 sm:py-24 border-t border-slate-800/80 bg-[#0c121e]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Arsitektur Finansial Modern
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2">
                Didesain untuk keamanan, transparansi, dan kecepatan
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Infrastruktur dompet digital USD yang dibangun langsung dari layer database untuk menjamin integritas saldo dan kemudahan transaksi internasional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="rounded-2xl border border-slate-800/90 bg-[#111726]/80 p-6 space-y-3.5 hover:border-slate-700 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-950/80 text-teal-400 border border-teal-800/40">
                  <CreditCard className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  Kartu Virtual VISA Instan
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Gunakan saldo USD untuk tagihan cloud (AWS, GCP), subscription (GitHub, OpenAI, Cursor), dan merchant global tanpa blokir kartu lokal.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-2xl border border-slate-800/90 bg-[#111726]/80 p-6 space-y-3.5 hover:border-slate-700 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-950/80 text-teal-400 border border-teal-800/40">
                  <Smartphone className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  Apple Pay & Google Wallet
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tambahkan kartu virtual ke Apple Wallet dalam satu klik. Nikmati pembayaran nirsentuh (contactless tap-to-pay) aman saat bepergian ke luar negeri.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-2xl border border-slate-800/90 bg-[#111726]/80 p-6 space-y-3.5 hover:border-slate-700 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-950/80 text-teal-400 border border-teal-800/40">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  Buku Besar Append-Only
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Saldo disimpan dalam integer cents (`bigint`) dengan fungsi Postgres atomic. Bebas floating-point drift dan audit trail dapat diverifikasi setiap saat.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="rounded-2xl border border-slate-800/90 bg-[#111726]/80 p-6 space-y-3.5 hover:border-slate-700 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-950/80 text-teal-400 border border-teal-800/40">
                  <FileCheck className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  KYC 100% Online via KTP
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Verifikasi identitas hanya dengan foto KTP tanpa selfie atau biometrik invasif. Nomor identitas terenkripsi penuh dan data tersimpan aman.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Virtual Card Deep Dive Section (Kartu Virtual) */}
        <section id="kartu" className="scroll-mt-20 py-20 sm:py-24 border-t border-slate-800/80 bg-[#090D14]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Visual Showcase */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-[#111726] p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-400 uppercase tracking-wider">
                      Fitur Keamanan Kartu
                    </span>
                    <span className="text-teal-400 font-mono font-bold">VISA Platinum</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <span className="font-bold text-white block">Bekukan Kartu Seketika</span>
                        <span className="text-slate-400 text-[11px]">
                          Cegah transaksi tidak diinginkan dengan toggle 1-klik dari aplikasi.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <span className="font-bold text-white block">Perlindungan CVV 30 Detik</span>
                        <span className="text-slate-400 text-[11px]">
                          Nomor kartu dan kode CVV dilindungi autentikasi PIN 6-digit dan auto-hide setelah 30 detik.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <span className="font-bold text-white block">Batas Pengeluaran Bulanan</span>
                        <span className="text-slate-400 text-[11px]">
                          Atur limit pengeluaran bulanan secara dinamis agar pengeluaran tim dan pribadi tetap terkontrol.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Copy & Details */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-950/40 px-3 py-1 text-xs font-semibold text-teal-300">
                  <Zap className="h-3.5 w-3.5 text-teal-400" aria-hidden="true" />
                  <span>Diterbitkan Mitra Berlisensi MAS Singapore</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Semua kemudahan kartu debit global, langsung di saku Anda.
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Tidak perlu lagi meminjam kartu kredit rekan kerja untuk membayar langganan server dan software tim. Saldo USD Anda langsung terhubung ke kartu virtual VISA tanpa biaya langganan bulanan.
                </p>

                <div className="grid grid-cols-2 gap-6 pt-2 text-xs">
                  <div>
                    <span className="font-mono text-xl sm:text-2xl font-bold text-white block">0%</span>
                    <span className="text-slate-400">Biaya Markup Konversi Valas</span>
                  </div>
                  <div>
                    <span className="font-mono text-xl sm:text-2xl font-bold text-white block">&lt; 60 Detik</span>
                    <span className="text-slate-400">Aktivasi Kartu Virtual Siap Pakai</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/wallet">
                    <button
                      type="button"
                      className="min-h-[44px] px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                    >
                      <span>Jelajahi Fitur Kartu di Dompet</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Comparison Table Section (Biaya & Kurs) */}
        <section id="biaya" className="scroll-mt-20 py-20 sm:py-24 border-t border-slate-800/80 bg-[#0c121e]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Transparansi Finansial
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2">
                Bandingkan Sakuin dengan Bank Konvensional
              </h2>
              <p className="text-xs text-slate-400 mt-1.5">
                Bebas biaya siluman, proses instan tanpa birokrasi berbelit-belit.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#111726] overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                    <th className="p-4 sm:px-6 font-semibold">Fitur & Layanan</th>
                    <th className="p-4 sm:px-6 font-semibold">Rekening USD Bank Konvensional</th>
                    <th className="p-4 sm:px-6 font-bold text-teal-400">
                      Sakuin USD Wallet
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  <tr>
                    <td className="p-4 sm:px-6 font-semibold text-white">
                      Kepastian Kurs (FX Lock)
                    </td>
                    <td className="p-4 sm:px-6 text-slate-400">Kurs fluktuatif + margin tersembunyi</td>
                    <td className="p-4 sm:px-6 font-semibold text-teal-300">
                      Garansi Kunci Kurs 15 Menit
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:px-6 font-semibold text-white">
                      Penerbitan Kartu Debit
                    </td>
                    <td className="p-4 sm:px-6 text-slate-400">Kartu fisik, memakan waktu 2-3 minggu</td>
                    <td className="p-4 sm:px-6 font-semibold text-teal-300">
                      Kartu Virtual Aktif dalam 60 Detik
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:px-6 font-semibold text-white">
                      Metode Pengisian Saldo (Top Up)
                    </td>
                    <td className="p-4 sm:px-6 text-slate-400">Antri di teller atau wire transfer SWIFT</td>
                    <td className="p-4 sm:px-6 font-semibold text-teal-300">
                      VA Instan (BCA, Mandiri) & QRIS
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:px-6 font-semibold text-white">
                      Verifikasi Identitas (KYC)
                    </td>
                    <td className="p-4 sm:px-6 text-slate-400">Datang ke kantor cabang fisik & tanda tangan berkas</td>
                    <td className="p-4 sm:px-6 font-semibold text-teal-300">
                      100% Online Cukup Upload KTP
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:px-6 font-semibold text-white">
                      Integrasi Dompet Digital
                    </td>
                    <td className="p-4 sm:px-6 text-slate-400">Jarang mendukung Apple Pay untuk valas</td>
                    <td className="p-4 sm:px-6 font-semibold text-teal-300">
                      Native Add to Apple Wallet & Pay
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 6. High-Contrast Bottom CTA Banner */}
        <section className="py-20 border-t border-slate-800/80 bg-[#090D14]">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="relative rounded-3xl border border-teal-500/30 bg-gradient-to-br from-[#111726] via-slate-900 to-teal-950/40 p-8 sm:p-12 text-center overflow-hidden shadow-2xl">
              <div
                className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500/10 blur-[80px] pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Mulai Transaksi Global Tanpa Batas Hari Ini
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Buka akun Sakuin gratis dalam 2 menit. Dapatkan kartu virtual USD instan dan nikmati kemudahan bertransaksi di jutaan merchant internasional.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                  <Link href="/signup">
                    <button
                      type="button"
                      className="min-h-[44px] px-6 py-2.5 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-teal-500/25 flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                    >
                      <span>Buka Akun Gratis Sekarang</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </Link>
                  <Link href="/wallet">
                    <button
                      type="button"
                      className="min-h-[44px] px-6 py-2.5 rounded-full border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    >
                      <span>Masuk ke Dompet</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 7. Minimalist Fintech Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090D14] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500 text-slate-950 font-bold text-sm">
                  S
                </span>
                <span className="font-bold text-base text-white">Sakuin</span>
              </div>
              <p className="text-xs text-slate-400 max-w-md">
                Layanan dompet digital USD modern untuk profesional teknologi, pekerja jarak jauh, dan bisnis di Indonesia.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-medium">
              <a href="#fitur" className="hover:text-white transition-colors">
                Fitur
              </a>
              <a href="#kartu" className="hover:text-white transition-colors">
                Kartu Virtual
              </a>
              <a href="#biaya" className="hover:text-white transition-colors">
                Biaya & Kurs
              </a>
              <Link href="/wallet" className="hover:text-white transition-colors">
                Aplikasi Dompet
              </Link>
              <Link href="/admin" className="hover:text-white transition-colors">
                Konsol Kepatuhan
              </Link>
              <Link href="/signin" className="hover:text-white transition-colors">
                Masuk
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-500" aria-hidden="true" />
              <span>
                Bekerja sama dengan mitra perbankan berlisensi MAS Singapore. Data dilindungi enkripsi standar perbankan.
              </span>
            </div>
            <span>&copy; 2026 Sakuin Wallet. Hak cipta dilindungi undang-undang.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
