/**
 * Landing page content (Indonesian), ported from the design file `Sakuin Landing Page (1).html`
 * (board 3, "Landing Page Dark"). All copy, prices, FAQ and steps live here, not in components.
 * `[...]` in a value means the design marks it as a proposal or placeholder pending confirmation.
 *
 * TODO(decision): items below differ from AGENTS.md and need product/legal confirmation before launch:
 * - "Kredit Sakuin" model (credit cannot become card balance) vs "Satu Saldo Terpadu" in AGENTS.md.
 * - KYC for cards says "KTP dan swafoto"; AGENTS.md says KTP photo only, no selfie.
 * - Claims: AES-256, TLS 1.2+, fraud monitoring 24/7, "card data not stored", "QRIS top-up free".
 * - Services not in the PRD: gift cards, AI API, cloud/hosting/licences. QRIS payment at merchants is "Belum".
 * - Fee amounts are proposals; hero card numbers and limits are sample data only.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterLink {
  label: string;
  /** Omit while the destination page does not exist; the footer shows plain text instead of a dead link. */
  href?: string;
}

export const landingContent = {
  meta: {
    title: 'Virtual Debit Card & Saldo Terpadu Indonesia | sakuin.co.id',
    description:
      'Platform Satu Saldo Terpadu untuk menerbitkan Virtual Debit Card berproteksi 3D Secure, konversi kurs Wise tanpa markup, bayar instan QRIS, dan PPOB 24/7.',
  },

  a11y: {
    skipToContent: 'Lewati ke konten utama',
    mainNav: 'Navigasi utama',
    servicesNav: 'Layanan',
    footerServices: 'Layanan',
    footerSupport: 'Dukungan dan legal',
    partnersSection: 'Metode top-up dan mitra',
    trustSection: 'Prinsip keamanan',
    demoSection: 'Demo Sakuin Virtual Cards',
    chooseNeeds: 'Pilih kebutuhan',
    chooseService: 'Pilih layanan',
    sampleApp: 'Contoh tampilan aplikasi',
    heroVisual:
      'Ilustrasi contoh tampilan aplikasi Sakuin dengan tiga kartu virtual. Data pada gambar hanya contoh.',
    emailLabel: 'Alamat email',
    openMenu: 'Buka menu navigasi',
    closeMenu: 'Tutup menu navigasi',
  },

  brand: { name: 'sakuin', suffix: '.co.id', href: '#top' },

  nav: {
    services: {
      label: 'Layanan',
      links: [
        { label: 'Virtual Debit Card', href: '#produk-kartu' },
        { label: 'Bayar Instan QRIS', href: '#produk-qris' },
        { label: 'Produk Digital & PPOB', href: '#produk-ppob' },
      ] satisfies NavLink[],
    },
    links: [
      { label: 'Cara Kerja', href: '#cara-kerja' },
      { label: 'Keamanan & Regulasi', href: '#keamanan' },
      { label: 'Biaya & Kurs', href: '#biaya' },
      { label: 'Bantuan & FAQ', href: '#faq' },
    ] satisfies NavLink[],
    signIn: { label: 'Masuk', href: '/signin' },
    signUp: { label: 'Buat Akun', href: '/signup' },
  },

  hero: {
    badgeTag: 'Virtual Debit Card',
    badgeText: 'Didukung Mitra Berlisensi PJP Kategori 1 Bank Indonesia',
    headline: 'Satu Saldo Terpadu untuk Transaksi Global & Kebutuhan Harian.',
    subheadline:
      'Akses instan ke Virtual Debit Card untuk langganan tools dan belanja internasional tanpa kartu kredit bank, plus bayar instan QRIS dan produk digital PPOB 24/7.',
    primaryCta: { label: 'Buat Virtual Debit Card', href: '/signup' },
    secondaryCta: { label: 'Lihat Cara Kerja', href: '#cara-kerja' },
    note: 'Daftar akun gratis. Tanpa kartu kredit fisik.',
    visual: {
      appLabel: 'Saldo Terpadu',
      appBalance: 'Rp1.500.000',
      appActions: ['Isi Saldo', 'Buat Kartu', 'Bayar QRIS', 'Beli Pulsa'],
      appTxTitle: 'Transaksi Terakhir',
      appTx: [
        { label: 'ChatGPT Plus Subscription', value: '$20.00', tone: 'default' },
        { label: 'Vercel Pro Cloud Hosting', value: '$20.00', tone: 'default' },
        { label: 'Top-up Saldo via QRIS', value: '+Rp500.000', tone: 'positive' },
      ],
      lavender: { label: 'Kartu Langganan SaaS', number: '4024 0071 8830 1934' },
      azure: { label: 'Virtual Debit Card', value: '$1,000.00 USD', number: '5288 1406 7731 4821', valid: '07/28' },
      pearl: { label: 'Batas Belanja', value: 'Rp 15.000.000', number: '5312 0098 2475 6610', valid: '07/28' },
      validThru: 'VALID THRU',
      networkLogo: 'VISA / MASTERCARD',
    },
  },

  partners: {
    topUpLabel: 'Top-up Saldo via',
    methods: ['QRIS', 'BCA VA', 'Mandiri VA', 'BRI VA', 'BNI VA'],
    issuerNote: 'Didukung infrastruktur mitra berlisensi PJP 1 Bank Indonesia',
  },

  demo: {
    heading: 'Solusi Satu Saldo Terpadu Sakuin',
    playLabel: 'Putar demo interaktif',
    closeLabel: 'Tutup demo',
    idleText: 'Tekan tombol putar untuk melihat kemudahan menerbitkan kartu, isi saldo instan, dan bayar langganan global.',
    card: { balanceLabel: 'Virtual Debit Card', balance: '$1,000.00 USD', number: '5288 1406 7731 4821' },
    steps: [
      {
        short: '1 · Aktivasi',
        title: 'Terbitkan kartu dalam hitungan menit',
        text: 'Setelah verifikasi KTP disetujui admin, kamu dapat langsung menerbitkan Virtual Debit Card dengan nomor kartu, CVV, dan tanggal kedaluwarsa resmi.',
      },
      {
        short: '2 · Top-up',
        title: 'Isi Saldo Terpadu secara instan',
        text: 'Top-up saldo Rupiah melalui QRIS atau Virtual Account bank utama. Saldo langsung aktif dan siap digunakan untuk kebutuhan lokal maupun transaksi global.',
      },
      {
        short: '3 · Transaksi',
        title: 'Belanja di merchant dunia & bayar lokal',
        text: 'Gunakan kartu untuk langganan global dengan konversi kurs Wise tanpa markup, atau scan QRIS di merchant Indonesia dengan proteksi 3D Secure.',
      },
    ],
  },

  trustStrip: [
    { icon: 'qr', text: 'Top-up instan via QRIS & Virtual Account' },
    { icon: 'shield', text: 'Mitra berlisensi PJP 1 Bank Indonesia' },
    { icon: 'lock', text: 'Proteksi 3D Secure & freeze kartu seketika' },
    { icon: 'clock', text: 'Kurs acuan pasar tanpa biaya siluman' },
  ],

  problems: {
    eyebrow: 'Masalah Pembayaran Global',
    heading: 'Mau bayar langganan dan belanja di merchant dunia, tapi kartunya selalu ditolak?',
    items: [
      {
        title: 'Tidak memiliki kartu kredit bank',
        body: 'Sebagian besar freelancer, pekerja remote, dan kreator di Indonesia tidak memiliki kartu kredit konvensional dengan syarat pengajuan bank yang rumit.',
      },
      {
        title: 'Kartu debit lokal sering gagal',
        body: 'Banyak merchant luar negeri menolak kartu debit lokal Indonesia karena ketiadaan fitur 3D Secure internasional atau pembatasan bank domestik.',
      },
      {
        title: 'Jasa titip bayar mahal dan berisiko',
        body: 'Menitipkan pembayaran akun ke pihak ketiga mengenakan markup kurs tinggi serta berisiko membuat akun SaaS berhargamu diblokir permanen.',
      },
    ],
  },

  how: {
    id: 'cara-kerja',
    eyebrow: 'Cara Kerja Sederhana',
    heading: 'Tiga langkah mudah: dari saldo Rupiah ke transaksi dunia.',
    steps: [
      {
        title: 'Isi Saldo via QRIS atau Virtual Account',
        body: 'Pilih nominal top-up dan bayar instan menggunakan QRIS dari bank atau e-wallet apa saja, atau transfer VA BCA, Mandiri, BRI, dan BNI.',
      },
      {
        title: 'Terbitkan Virtual Debit Card Seketika',
        body: 'Setelah verifikasi identitas (hanya foto KTP tanpa selfie), kartu debit virtualmu langsung aktif lengkap dengan nomor kartu, expiry, dan CVV.',
      },
      {
        title: 'Belanja di Merchant Dunia & Bayar Kebutuhan',
        body: 'Gunakan kartu untuk langganan software global (ChatGPT, Canva, GitHub) dan belanja online internasional, serta bayar QRIS merchant lokal dari saldo yang sama.',
      },
    ],
  },

  planner: {
    eyebrow: 'Satu Saldo untuk Segala Kebutuhan',
    heading: 'Top-up sekali, gunakan untuk transaksi global dan harian.',
    body: 'Pilih kebutuhan transaksi digitalmu bulan ini. Semua kebutuhan tercover dari Satu Saldo Terpadu tanpa perlu mendaftar ke banyak platform terpisah.',
    totalLabel: 'Total Estimasi Saldo Dibutuhkan',
    countSuffix: 'kebutuhan dipilih · Top-up QRIS real-time',
    separateTitle: 'Konversi Kurs Transparan Tanpa Markup',
    separateText:
      'Transaksi kartu dalam USD otomatis dikonversi dari saldo Rupiah menggunakan kurs acuan pasar real-time tanpa margin siluman.',
    sampleNote: 'Simulasi alokasi saldo kebutuhan bulanan.',
    items: [
      { id: 'pulsa', label: 'Pulsa & Data Rp50.000', price: 51000, defaultOn: true },
      { id: 'pln', label: 'Token Listrik PLN Rp100.000', price: 101500, defaultOn: true },
      { id: 'game', label: 'Voucher Game Rp50.000', price: 51500, defaultOn: false },
      { id: 'gift', label: 'Langganan AI / SaaS $20 (~Rp320.000)', price: 320000, defaultOn: true },
      { id: 'card', label: 'Biaya Terbit Virtual Debit Card', price: 25000, defaultOn: true },
      { id: 'stream', label: 'Streaming Music / Video Rp55.000', price: 55000, defaultOn: false },
    ],
  },

  pathFinder: {
    id: 'pilih-jalur',
    eyebrow: 'Pilih Kebutuhan',
    heading: 'Mau bayar apa hari ini? Sakuin siapkan solusinya.',
    defaultService: 'ai',
    services: [
      { id: 'ai', label: 'Langganan AI Tools', kind: 'card' },
      { id: 'saas', label: 'SaaS & Cloud Server', kind: 'card' },
      { id: 'stream', label: 'Streaming & Musik', kind: 'card' },
      { id: 'qris', label: 'Bayar QRIS Merchant', kind: 'qris' },
      { id: 'ppob', label: 'Pulsa & Token PLN', kind: 'ppob' },
      { id: 'game', label: 'Voucher Game Store', kind: 'card' },
    ],
    /** `{brand}` is replaced with the selected service brand. */
    paths: {
      card: {
        badge: 'Jalur Virtual Debit Card',
        title: 'Virtual Debit Card Global Berizin',
        desc: 'Layanan menerima kartu internasional. Bayar langsung menggunakan Virtual Debit Card Sakuin dengan proteksi 3D Secure dan limit terkendali.',
        steps: [
          'Verifikasi KTP sekali, lalu terbitkan Virtual Debit Card seketika.',
          'Isi Saldo Terpadu via QRIS atau Virtual Account bank nasional.',
          'Salin detail kartu untuk pembayaran online global di merchant mana saja.',
        ],
      },
      qris: {
        badge: 'Jalur Bayar QRIS Instan',
        title: 'Pembayaran QRIS Nasional Real-Time',
        desc: 'Pindai kode QRIS di merchant offline maupun online di seluruh Indonesia langsung dari saldo terpadu.',
        steps: [
          'Buka fitur scan QRIS di dalam dompet Sakuin.',
          'Arahkan kamera ke kode QRIS merchant.',
          'Konfirmasi nominal dan bayar instan tanpa biaya admin tambahan.',
        ],
      },
      ppob: {
        badge: 'Jalur Produk Digital & PPOB',
        title: 'PPOB & Pulsa Otomatis 24/7',
        desc: 'Isi pulsa, kuota data semua operator, token PLN, hingga voucher game kapan saja dengan pemrosesan instan otomatis.',
        steps: [
          'Pilih kategori produk digital yang kamu butuhkan.',
          'Masukkan nomor tujuan atau ID pelanggan.',
          'Bayar dari Saldo Terpadu, produk langsung masuk dalam hitungan detik.',
        ],
      },
    },
  },

  products: {
    id: 'produk',
    eyebrow: 'Layanan Finansial',
    heading: 'Tiga layanan utama dalam Satu Saldo Terpadu.',
    body: 'Sakuin menyatukan kemudahan pembayaran global dan kebutuhan transaksi lokal ke dalam satu dompet digital yang aman, transparan, dan patuh regulasi.',
    core: [
      {
        id: 'produk-kartu',
        icon: 'card',
        title: 'Virtual Debit Card Global',
        body: 'Bayar langganan SaaS, AI tools, cloud server, dan belanja online internasional tanpa kartu kredit fisik.',
        points: [
          'Terbit instan setelah verifikasi KTP disetujui',
          'Proteksi 3D Secure resmi di jutaan merchant',
          'Atur limit pengeluaran & freeze kartu kapan saja',
          'Konversi kurs pasar tanpa margin tersembunyi',
        ],
      },
      {
        id: 'produk-qris',
        icon: 'qr',
        title: 'Bayar Instan QRIS Nasional',
        body: 'Pindai dan bayar QRIS secara real-time di seluruh merchant bertanda QRIS di Indonesia dari saldo yang sama.',
        points: [
          'Scan QRIS instan dari browser/web wallet',
          'Langsung memotong saldo terpadu tanpa biaya siluman',
          'Riwayat dan struk transaksi digital tercatat rapi',
        ],
      },
      {
        id: 'produk-ppob',
        icon: 'bolt',
        title: 'Produk Digital & PPOB 24/7',
        body: 'Pulsa, paket data semua operator, token listrik PLN, hingga voucher game favorit non-stop 24 jam.',
        points: [
          'Transaksi otomatis diproses dalam hitungan detik',
          'Status transaksi real-time dengan notifikasi',
          'Harga jujur dan transparan sebelum bayar',
        ],
      },
    ],
    alsoLabel: 'Keunggulan Finansial Tambahan:',
    also: [
      {
        icon: 'gift',
        title: 'Tanpa Kartu Kredit Bank',
        body: 'Semua kemudahan transaksi internasional tanpa syarat slip gaji, biaya tahunan, atau bunga pinjaman bank.',
      },
      {
        icon: 'code',
        title: 'Buku Besar Append-Only',
        body: 'Setiap pergerakan uang dicatat dalam sistem buku besar finansial yang tidak dapat diubah demi kepastian saldo.',
      },
      {
        icon: 'cloud',
        title: 'Top-up Fleksibel dari Bank Mana Saja',
        body: 'Dukung top-up dari BCA, Mandiri, BRI, BNI, serta semua e-wallet via QRIS tanpa batas minimum memberatkan.',
      },
    ],
  },

  fees: {
    id: 'biaya',
    eyebrow: 'Transparansi Biaya',
    heading: 'Biaya jelas di depan. Tanpa biaya siluman.',
    columns: { service: 'Jenis Layanan', fee: 'Biaya' },
    rows: [
      { service: 'Top-up Saldo via QRIS', fee: 'Gratis / Sesuai Regulasi' },
      { service: 'Top-up Saldo via Virtual Account Bank', fee: 'Biaya Transaksi Bank' },
      { service: 'Penerbitan Virtual Debit Card', fee: 'Biaya Admin Pembuatan Kartu' },
      { service: 'Konversi Kurs USD / Valas', fee: '0% Margin Kurs (Kurs Acuan Pasar)' },
      { service: 'Pembayaran QRIS di Merchant', fee: 'Gratis' },
    ],
    note: 'Seluruh biaya administrasi dan kurs konversi selalu ditampilkan transparan sebelum kamu mengonfirmasi pembayaran.',
    simulator: {
      heading: 'Simulasi Konversi & Top-Up',
      amountLabel: 'Nominal Top-up Saldo',
      min: 50000,
      max: 5000000,
      step: 50000,
      defaultAmount: 500000,
      feeRate: 0.01,
      minFee: 3000,
      paidLabel: 'Total Dana yang Ditransfer',
      feeLabel: 'Estimasi Biaya Pemrosesan (Simulasi)',
      resultLabel: 'Saldo Terpadu yang Diterima',
      note: 'Angka biaya di atas merupakan ilustrasi simulasi. Rincian biaya aktual dan kurs referensi Wise tanpa markup selalu ditampilkan sebelum konfirmasi pembayaran.',
    },
  },

  security: {
    id: 'keamanan',
    eyebrow: 'Keamanan & Kepatuhan',
    heading: 'Standar keamanan institusi finansial untuk melindungi uang dan datamu.',
    items: [
      {
        featured: true,
        title: 'Infrastruktur Mitra Berlisensi PJP 1 Bank Indonesia',
        body: 'Didukung oleh mitra berlisensi resmi Penyedia Jasa Pembayaran (PJP) Kategori 1 dari Bank Indonesia.',
      },
      {
        featured: true,
        title: 'Proteksi Transaksi 3D Secure',
        body: 'Setiap transaksi online internasional dilindungi dengan verifikasi OTP 3D Secure untuk mencegah penyalahgunaan.',
      },
      {
        featured: true,
        title: 'Pemantauan Fraud 24/7',
        body: 'Sistem otomatis memantau anomali transaksi mencurigakan guna memberikan perlindungan maksimal bagi akunmu.',
      },
      {
        featured: false,
        title: 'Buku Besar Append-Only Terverifikasi',
        body: 'Catatan saldo dan mutasi dana tidak pernah dapat diubah atau dihapus, menjamin rekonsiliasi yang sempurna.',
      },
      {
        featured: false,
        title: 'Enkripsi Data Standar Tinggi',
        body: 'Data pengguna dan kredensial sensitif dienkripsi secara ketat di tingkat kolom database dengan proteksi RLS.',
      },
      {
        featured: false,
        title: 'Verifikasi KTP Mandiri & Akurat',
        body: 'Verifikasi akun cukup dengan 1 dokumen foto KTP tanpa selfie, diverifikasi secara aman oleh tim kepatuhan.',
      },
    ],
  },

  faq: {
    id: 'faq',
    heading: 'Pertanyaan yang sering diajukan',
    items: [
      {
        id: 'bank',
        question: 'Apakah Sakuin bank atau e-wallet?',
        answer:
          'Sakuin adalah platform saldo terpadu yang didukung mitra berlisensi PJP Kategori 1 Bank Indonesia. Melalui Sakuin, pengguna dapat mengelola saldo untuk menerbitkan Virtual Debit Card (transaksi global), membayar QRIS instan, dan produk PPOB dalam satu aplikasi tanpa perlu kartu kredit bank.',
      },
      {
        id: 'kredit',
        question: 'Bagaimana cara kerja Satu Saldo Terpadu Sakuin?',
        answer:
          'Satu Saldo Terpadu memungkinkan kamu mengisi saldo Rupiah via QRIS atau Virtual Account bank, lalu menggunakannya secara fleksibel untuk mendanai Virtual Debit Card (konversi USD dengan kurs acuan pasar tanpa margin tersembunyi), membayar QRIS, serta isi pulsa dan token PLN.',
      },
      {
        id: 'penerbit',
        question: 'Siapa yang menerbitkan Virtual Debit Card Sakuin?',
        answer:
          'Virtual Debit Card diterbitkan oleh mitra penyelenggara berlisensi PJP Kategori 1 Bank Indonesia bersama jaringan pembayaran global resmi, didukung fitur 3D Secure dan pemantauan keamanan 24/7.',
      },
      {
        id: 'diterima',
        question: 'Di mana saja Virtual Debit Card Sakuin dapat digunakan?',
        answer:
          'Kartu dapat digunakan di jutaan merchant online internasional yang menerima kartu debit, termasuk langganan AI tools (ChatGPT, Midjourney), SaaS developer (GitHub, AWS, Vercel), streaming (Netflix, Spotify), hingga game store global (Steam, PlayStation).',
      },
      {
        id: 'kyc',
        question: 'Dokumen apa yang dibutuhkan untuk verifikasi identitas (KYC)?',
        answer:
          'Verifikasi akun di Sakuin hanya membutuhkan 1 dokumen: foto KTP yang jelas. Tidak ada kewajiban selfie atau liveness test yang rumit. Data dienkripsi secara ketat dan disetujui manual oleh tim kepatuhan.',
      },
      {
        id: 'qris',
        question: 'Bisakah saya bayar di merchant QRIS memakai Sakuin?',
        answer:
          'Bisa. Saldo Terpadu Sakuin dapat langsung digunakan untuk scan dan bayar instan di seluruh merchant bertanda QRIS nasional di Indonesia.',
      },
      {
        id: 'kapan',
        question: 'Bagaimana cara mulai menggunakan Sakuin?',
        answer:
          'Kamu dapat mendaftar akun gratis dalam 2 menit, mengunggah foto KTP untuk verifikasi, lalu top-up via QRIS atau Virtual Account bank (BCA, Mandiri, BRI, BNI) untuk langsung mengaktifkan kartu debit virtualmu.',
      },
    ],
  },

  finalCta: {
    id: 'daftar',
    heading: 'Mulai transaksi global dan lokal dari Satu Saldo Terpadu hari ini.',
    body: 'Daftar akun gratis dalam 2 menit. Verifikasi KTP mudah tanpa selfie, dan nikmati kebebasan bertransaksi di merchant dunia.',
    emailPlaceholder: 'nama@email.com',
    submit: 'Buat Akun Gratis',
    action: '/signup',
  },

  footer: {
    legal: 'sakuin.co.id adalah platform layanan keuangan digital yang dikelola oleh PT Anugrah Sejahtera Teknologi.',
    regulatory:
      'Didukung oleh infrastruktur mitra berlisensi Penyedia Jasa Pembayaran (PJP) Kategori 1 dari Bank Indonesia. Seluruh proses pembayaran online dan penerbitan kartu debit virtual mematuhi ketentuan perbankan dan regulasi resmi yang berlaku.',
    services: {
      title: 'Layanan',
      links: [
        { label: 'Virtual Debit Card', href: '#produk-kartu' },
        { label: 'Bayar Instan QRIS', href: '#produk-qris' },
        { label: 'Produk Digital & PPOB', href: '#produk-ppob' },
        { label: 'Top-up Saldo', href: '#cara-kerja' },
        { label: 'Simulasi Biaya & Kurs', href: '#biaya' },
      ] satisfies FooterLink[],
    },
    support: {
      title: 'Dukungan & Legal',
      links: [
        { label: 'Kebijakan Privasi' },
        { label: 'Syarat dan Ketentuan' },
        { label: 'Biaya & Limit', href: '#biaya' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Hubungi Kami', href: 'mailto:support@sakuin.co.id' },
      ] satisfies FooterLink[],
    },
    soon: 'Segera',
    copyright: '© 2026 sakuin.co.id (PT Anugrah Sejahtera Teknologi). Hak cipta dilindungi.',
    badges: ['PJP Kategori 1 Bank Indonesia', '3D Secure Verified', 'Buku Besar Append-Only'],
    disclaimer:
      'sakuin.co.id bukan bank penerbit kartu fisik konvensional. Layanan Virtual Debit Card diselenggarakan bekerja sama dengan mitra penerbit resmi berlisensi PJP Kategori 1 Bank Indonesia. Seluruh nama merek, logo merchant, dan jaringan pembayaran adalah milik dari pemegang hak merek masing-masing.',
  },
} as const;

export type LandingContent = typeof landingContent;
