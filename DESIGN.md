# Design System: sakuin.co.id

Platform fintech modern di bawah naungan **PT Anugrah Sejahtera Teknologi**. Menghadirkan pengalaman visual yang bersih, elegan, dan berkepastian tinggi terinspirasi oleh standar industri **Stripe, Wise, Midtrans, Linear, dan Apple Wallet**.

---

## 1. Design Direction & Character

- **Aesthetic**: Minimalist, modern fintech, berwibawa, dan fungsional.
- **Visual Personality**: High-trust, Swiss-style precision, calm surfaces, crisp hairline borders, dan purposeful whitespace.
- **Trust & Compliance Badge**: "Infrastruktur Berlisensi PJP Kategori 1 Bank Indonesia" (Didukung Mitra Berlisensi PJP 1 Bank Indonesia).
- **Core Tenet**: Kejelasan data finansial di atas dekorasi berlebih. Setiap angka, status transaksi, dan tombol aksi memiliki tujuan fungsional yang eksplisit.
- **Instrumen Kartu**: Seluruh instrumen kartu virtual adalah **Virtual Debit Card** (bukan kartu kredit / VCC).
- **Anti-Patterns Rejected**:
  - Tanpa gradien multi-warna mencolok atau neon glows.
  - Tanpa pill dekoratif tanpa status riil.
  - Tanpa emoji sebagai ikon navigasi.
  - Tanpa efek glassmorphism berlebihan yang mengorbankan keterbacaan teks finansial.

---

## 2. Design Tokens

### Spacing System (8px Grid)
- Base Unit: `4px` / `8px`
- Scales: `xs (4px)`, `sm (8px)`, `md (16px)`, `lg (24px)`, `xl (32px)`, `2xl (48px)`, `3xl (64px)`
- Tap Target Minimum: `44px` pada seluruh kontrol interaktif mobile dan desktop.

### Color Tokens

| Token | Light Mode | Dark Mode (Default / Landing) | Usage |
|---|---|---|---|
| `background` | `#F8FAFC` (Slate 50) | `#0F1115` (Deep Charcoal / Obsidian) | Kanvas utama aplikasi |
| `card` | `#FFFFFF` | `#050507` (Surface Dark) | Permukaan kartu finansial, modal, dan sheet |
| `foreground` | `#0F172A` (Slate 900) | `#FFFFFF` / `#F4F4F5` | Tipografi utama (kontras > 12:1) |
| `muted-foreground` | `#64748B` (Slate 500) | `#A1A1AA` (Zinc 400) | Label sekunder dan deskripsi (kontras > 4.5:1) |
| `border` | `#E2E8F0` (Slate 200) | `rgba(255, 255, 255, 0.08)` / `#27272A` | Hairline 1px border dan garis pemisah |
| `primary` / `accent` | `#1D9BF0` (Electric / Brand Blue) | `#1D9BF0` (Electric / Brand Blue) | Warna brand utama, tombol CTA finansial, ikon brand, dan aksi primer |
| `accent-secondary`| `#0891B2` (Cyan 600)| `#22D3EE` (Cyan Glow) | Highlight visual, glow badge, dan status sekunder |
| `destructive` | `#E11D48` (Rose 600) | `#F43F5E` (Rose 500) | Pembekuan kartu, status gagal, dan delta negatif |
| `warning` | `#D97706` (Amber 600) | `#F59E0B` (Amber 500) | Status pending KYC dan konfirmasi verifikasi |
| `success` | `#059669` (Emerald 600)| `#7CE8C8` (Mint / Emerald) | Saldo positif, top-up sukses, KYC disetujui |
| `apple-pay-bg` | `#000000` | `#FFFFFF` | Latar tombol resmi Apple Pay / Apple Wallet |

### Typography Scale
- **Headings**: `var(--font-geist-sans)` dengan `font-bold` atau `font-semibold`, `text-balance`.
- **Financial Values**: `var(--font-mono)` dengan `tabular-nums tracking-tight font-bold`.
- **Body & Labels**: `var(--font-geist-sans)`, `text-pretty`.

---

## 3. Financial Components Architecture

1. **Balance & Unified Fund Summary (Satu Saldo Terpadu)**:
   - Penampil saldo kontras tinggi dengan tipografi font-mono (`Rp 1.500.000` / `$1,234.56`).
   - Tactile eye toggle untuk privasi saldo dengan umpan balik instan.
2. **Virtual Debit Card**:
   - Simulasi fisik terinspirasi Apple Wallet: finishing metallic obsidian card, logo Visa/Mastercard, chip EMV, contactless waves, nomor kartu masked (`•••• 5678`), nama pemegang kartu, tanggal kedaluwarsa, dan status badge freeze/active.
   - Kontrol keamanan instan: toggle pembekuan kartu, reveal CVV dengan autentikasi, dan slider limit belanja.
3. **Quick Action Group**:
   - Tombol pill atau rounded action group: [Isi Saldo] [Buat Virtual Card] [Beli Pulsa] [Scan QRIS] [Riwayat Transaksi].
4. **Unified Balance Interactive Switch / Showcase**:
   - Kartu interaktif yang memperlihatkan fleksibilitas saldo terpadu yang dapat dialokasikan dinamis untuk transaksi global (Virtual Debit Card) maupun kebutuhan lokal (PPOB dan QRIS).
5. **FX Rate & Exchange Ticker**:
   - Indikator kurs konversi real-time dengan garansi 15-minute rate lock countdown.
6. **Activity Ledger**:
   - Daftar transaksi kontras tinggi memuat nama merchant / produk, kategori ikon, cap waktu WIB, tag metode pembayaran (*Virtual Debit Card*, *QRIS*, *PPOB*), dan format angka tabular dengan penanda warna.
7. **Accessible States**:
   - Setiap tampilan wajib menyediakan 4 status: loading (skeleton), empty (penyebab jelas + satu tombol aksi), error (penyebab + tombol coba lagi), dan success.

---

## 4. Landing Page Specifications (sakuin.co.id)

### 1. Navbar / Header
- **Logo Brand**: sakuin.co.id (tipografi modern sans-serif dengan aksen visual wallet/card).
- **Nav Links**:
  - Layanan (Dropdown: Virtual Debit Card, Produk Digital & PPOB, Bayar QRIS)
  - Cara Kerja
  - Keamanan & Regulasi
  - Bantuan & FAQ
- **CTA Actions**:
  - Tombol secondary: "Masuk"
  - Tombol primary: "Buat Akun / Mulai"

### 2. Hero Section
- **Badge Trust**: "Infrastruktur Berlisensi PJP Kategori 1 Bank Indonesia"
- **Headline Utama**: "Satu Saldo Terpadu untuk Transaksi Global & Kebutuhan Harian"
- **Subheadline**: "Akses instan ke Virtual Debit Card untuk belanja internasional, pembayaran QRIS, serta pengisian pulsa, paket data, dan voucher game favorit dalam hitungan detik."
- **CTA Buttons**:
  - Primary: "Dapatkan Virtual Card Instan"
  - Secondary: "Lihat Demo Transaksi"
- **Visual Mockup**:
  - Mockup smartphone / 3D card menampilkan sakuin Virtual Debit Card (Visa/Mastercard), tampilan saldo terpadu ("Saldo Aktif: Rp 1.500.000"), dan quick actions menu ([Isi Saldo] [Buat Virtual Card] [Beli Pulsa] [Scan QRIS]).
- **Partner & Trust Bar**:
  - Logo QRIS, GPN, Virtual Account perbankan (BCA, Mandiri, BRI, BNI), serta badge resmi "Didukung Mitra Berlisensi PJP 1 Bank Indonesia".

### 3. Fitur Utama & Produk (3 Core Pillars)
Tata letak grid 3 kolom interaktif:
1. **Virtual Debit Card Global**:
   - Deskripsi: Pembayaran online fleksibel untuk langganan tools SaaS, streaming, game, dan belanja luar negeri tanpa kartu kredit fisik konvensional.
   - Poin Unggulan: Otomatis terbit, nomor kartu instan, batas limit fleksibel, keamanan 3D Secure.
2. **Produk Digital & PPOB Lengkap**:
   - Deskripsi: Beli pulsa reguler, paket kuota internet semua operator, token listrik PLN, hingga voucher game (Steam, Mobile Legends, Roblox, dll.) dengan harga kompetitif.
   - Poin Unggulan: Transaksi otomatis 24/7, status transaksi real-time, riwayat faktur rapi.
3. **Bayar Instan QRIS**:
   - Deskripsi: Gunakan saldo sakuin untuk scan bayar di seluruh merchant bertanda QRIS di seluruh Indonesia langsung dari genggaman.
   - Poin Unggulan: Cepat, nirsentuh, otomatis terpotong dari saldo utama.

### 4. Section Cara Kerja (Alur Transaksi Praktis)
Tampilan 3 langkah berbentuk timeline atau kartu horizontal berurutan:
- **Langkah 1: Top Up Saldo Praktis**
  Pilih nominal saldo yang diinginkan, bayar instan menggunakan Virtual Account (VA) bank terkemuka atau scan QRIS.
- **Langkah 2: Satu Saldo Siap Pakai**
  Saldo masuk otomatis ke akun dompet sakuin.co.id Anda secara real-time tanpa delay.
- **Langkah 3: Bebas Gunakan ke Mana Saja**
  Gunakan saldo yang sama untuk mengisi Virtual Debit Card belanja online, melunasi tagihan PPOB, atau belanja di merchant QRIS.

### 5. Section "Satu Saldo, Banyak Kegunaan" (Unified Balance Highlight)
- Komponen visual interaktif yang memperlihatkan fleksibilitas satu sumber dana sakuin.co.id yang dialokasikan dinamis untuk belanja internasional maupun transaksi lokal harian tanpa perlu top up berulang kali ke platform berbeda.

### 6. Section Keamanan & Regulasi (Trust & Compliance)
- **Didukung Mitra PJP 1 Bank Indonesia**: Menggandeng institusi pemrosesan pembayaran resmi berlisensi Bank Indonesia (PJP Kategori 1) untuk menjamin kepatuhan aliran dana.
- **Enkripsi Finansial Kelas Bank**: Data sensitif kartu dan transaksi dilindungi enkripsi AES-256 dan standar keamanan TLS termutakhir.
- **Fraud Detection 24/7**: Pemantauan transaksi otomatis untuk melindungi akun dari risiko penyalahgunaan saldo.

### 7. Call To Action (Bottom Banner)
- **Headline**: "Mulai Nikmati Kemudahan Transaksi Digital Hari Ini"
- **Deskripsi**: "Daftar dalam 2 menit, top up via QRIS/VA, dan langsung gunakan untuk Virtual Debit Card atau kebutuhan PPOB Anda."
- **Tombol CTA**: "Buat Akun sakuin Sekarang"

### 8. Footer Resmi
- **Kolom 1 (Perusahaan & Legalitas)**:
  - Brand: sakuin.co.id
  - Keterangan Legal: "sakuin.co.id adalah platform layanan digital yang dikelola oleh PT Anugrah Sejahtera Teknologi."
  - Regulatory Disclaimer: "Layanan infrastruktur pembayaran, pemrosesan transaksi, dan penerbitan instrumen keuangan difasilitasi melalui kemitraan strategis dengan institusi Penyedia Jasa Pembayaran (PJP) Kategori 1 yang berizin dan diawasi oleh Bank Indonesia."
- **Kolom 2 (Layanan)**: Virtual Debit Card, Top Up Saldo, Pulsa & Paket Data, Token PLN, Voucher Game, Pembayaran QRIS.
- **Kolom 3 (Dukungan & Legal)**: Kebijakan Privasi, Syarat & Ketentuan, Biaya Transaksi, FAQ, Hubungi Kami.
- **Baris Bawah**:
  - Hak Cipta (c) 2026 sakuin.co.id (PT Anugrah Sejahtera Teknologi). All rights reserved.
  - Logo/Badges: Badge Sertifikasi Keamanan, Logo Bank Indonesia PJP 1 Partner, QRIS, GPN.

---

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
