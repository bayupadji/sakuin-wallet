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
    title: 'sakuin.co.id | Satu akun untuk transaksi global dan kebutuhan digital harian',
    description:
      'Kartu virtual untuk langganan dan belanja online internasional, plus pulsa, paket data, token PLN, dan voucher game. Isi Kredit Sakuin lewat QRIS atau virtual account.',
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
  },

  brand: { name: 'sakuin', suffix: '.co.id', href: '#top' },

  nav: {
    services: {
      label: 'Layanan',
      links: [
        { label: 'Kartu Virtual', href: '#produk' },
        { label: 'Produk Digital dan PPOB', href: '#produk' },
        { label: 'Top-up via QRIS dan VA', href: '#cara-kerja' },
      ] satisfies NavLink[],
    },
    links: [
      { label: 'Cara Kerja', href: '#cara-kerja' },
      { label: 'Keamanan dan Regulasi', href: '#keamanan' },
      { label: 'Bantuan dan FAQ', href: '#faq' },
    ] satisfies NavLink[],
    signIn: { label: 'Masuk', href: '/signin' },
    signUp: { label: 'Buat Akun', href: '/signup' },
  },

  hero: {
    badgeTag: 'Kartu Virtual',
    badgeText: 'Diterbitkan mitra penerbit berizin Bank Indonesia',
    headline: 'Satu akun untuk transaksi global dan kebutuhan digital harian.',
    subheadline:
      'Kartu virtual untuk langganan dan belanja online internasional, plus pulsa, paket data, token PLN, dan voucher game favorit. Isi Kredit Sakuin lewat QRIS atau virtual account dalam hitungan detik.',
    primaryCta: { label: 'Dapatkan Kartu Virtual', href: '/signup' },
    secondaryCta: { label: 'Lihat Demo Transaksi', href: '#demo' },
    // Design text was "Segera hadir. Daftar waitlist gratis, tanpa kartu kredit." No waitlist backend exists.
    note: 'Daftar gratis, tanpa kartu kredit.',
    visual: {
      appLabel: 'Kredit Sakuin',
      appBalance: 'Rp1.500.000',
      appActions: ['Isi Kredit', 'Buat Kartu', 'Beli Pulsa', 'Gift Card'],
      appTxTitle: 'Transaksi kartu',
      appTx: [
        { label: 'Langganan AI', value: '$20.00', tone: 'default' },
        { label: 'Cloud hosting', value: '$6.00', tone: 'default' },
        { label: 'Top-up kartu via VA', value: '+Rp500.000', tone: 'positive' },
      ],
      lavender: { label: 'Kartu langganan', number: '4024 0071 8830 1934' },
      azure: { label: 'Saldo VCC', value: '$1,000.00', number: '5288 1406 7731 4821', valid: '07/28' },
      pearl: { label: 'Card Limit', value: 'Rp 15.000.000', number: '5312 0098 2475 6610', valid: '07/28' },
      validThru: 'VALID THRU',
      networkLogo: 'LOGO JARINGAN',
    },
  },

  partners: {
    topUpLabel: 'Isi Kredit via',
    methods: ['QRIS', 'VA BCA', 'VA Mandiri', 'VA BRI', 'VA BNI'],
    issuerNote: 'Kartu diterbitkan [Nama mitra penerbit], PJP berizin Bank Indonesia',
  },

  demo: {
    heading: 'Sakuin Virtual Cards Solution',
    playLabel: 'Putar demo interaktif',
    closeLabel: 'Tutup demo',
    idleText: 'Tekan tombol putar untuk melihat alur terbit kartu, top-up ke penerbit, dan bayar langganan.',
    card: { balanceLabel: 'Saldo VCC', balance: '$1,000.00 USD', number: '5288 1406 7731 4821' },
    steps: [
      {
        short: '1 · Terbitkan',
        title: 'Terbitkan kartu dalam hitungan menit',
        text: 'Setelah verifikasi identitas, pilih nama kartu dan limit. Biaya terbit dipotong dari Kredit Sakuin, lalu kartu langsung muncul di aplikasi.',
      },
      {
        short: '2 · Top-up',
        title: 'Isi saldo langsung ke penerbit',
        text: 'Sakuin membuatkan virtual account milik penerbit kartu. Dana yang kamu transfer masuk ke penerbit dan saldo kartu bertambah.',
      },
      {
        short: '3 · Bayar',
        title: 'Pakai untuk langganan global',
        text: 'Gunakan nomor kartu di layanan pilihanmu. Notifikasi transaksi masuk real-time, dan kartu bisa dibekukan kapan saja.',
      },
    ],
  },

  trustStrip: [
    { icon: 'qr', text: 'Top-up via QRIS dan virtual account' },
    { icon: 'shield', text: 'Kartu dari mitra penerbit berizin' },
    { icon: 'lock', text: 'Saldo kartu tidak disimpan di Sakuin' },
    { icon: 'clock', text: 'Biaya ditampilkan sebelum bayar' },
  ],

  problems: {
    eyebrow: 'Masalahnya',
    heading: 'Mau langganan layanan luar negeri, tapi kartunya ditolak.',
    items: [
      {
        title: 'Tidak punya kartu kredit',
        body: 'Banyak developer, mahasiswa, dan kreator hanya punya kartu debit atau e-wallet.',
      },
      {
        title: 'Kartu debit sering gagal',
        body: 'Merchant luar negeri kerap menolak kartu debit lokal untuk langganan bulanan.',
      },
      {
        title: 'Jasa titip bayar berisiko',
        body: 'Menitipkan pembayaran ke kartu orang lain bisa membuat akunmu diblokir.',
      },
    ],
  },

  how: {
    id: 'cara-kerja',
    eyebrow: 'Cara kerja',
    heading: 'Tiga langkah, langsung pakai.',
    steps: [
      {
        title: 'Isi Kredit dengan praktis',
        body: 'Pilih nominal, lalu bayar lewat virtual account bank atau scan QRIS dari aplikasi bank dan e-wallet mana pun.',
      },
      {
        title: 'Kredit masuk real-time',
        body: 'Begitu pembayaran terkonfirmasi, Kredit Sakuin langsung tampil di akunmu dan siap dipakai.',
      },
      {
        title: 'Pakai untuk semua produk Sakuin',
        body: 'Beli pulsa, token PLN, voucher game, gift card, atau bayar biaya terbit kartu. Saldo kartu virtual diisi terpisah, langsung ke penerbit.',
      },
    ],
  },

  planner: {
    eyebrow: 'Satu Kredit, banyak kegunaan',
    heading: 'Top-up sekali, pakai untuk semua produk Sakuin.',
    body: 'Pilih kebutuhanmu bulan ini untuk melihat Kredit yang perlu diisi. Tidak perlu top-up berkali-kali ke platform berbeda.',
    totalLabel: 'Kredit yang perlu diisi',
    countSuffix: 'produk dipilih · top-up QRIS tanpa biaya',
    separateTitle: 'Saldo kartu virtual terpisah',
    separateText:
      'Kredit membayar biaya terbit dan layanan kartu. Saldo untuk belanja dengan kartu diisi langsung ke virtual account penerbit.',
    sampleNote: 'Harga contoh, mengikuti tarif usulan.',
    items: [
      { id: 'pulsa', label: 'Pulsa Rp50.000', price: 51000, defaultOn: true },
      { id: 'pln', label: 'Token PLN Rp100.000', price: 101500, defaultOn: true },
      { id: 'game', label: 'Voucher game Rp50.000', price: 51500, defaultOn: false },
      { id: 'gift', label: 'Gift card App Store Rp150.000', price: 151500, defaultOn: true },
      { id: 'card', label: 'Biaya terbit kartu virtual', price: 25000, defaultOn: true },
      { id: 'ai', label: 'AI API, estimasi pemakaian', price: 50000, defaultOn: false },
    ],
  },

  pathFinder: {
    id: 'pilih-jalur',
    eyebrow: 'Pilih jalur',
    heading: 'Mau bayar apa? Sakuin pilihkan jalurnya.',
    defaultService: 'ai',
    services: [
      { id: 'ai', label: 'Langganan AI tools', kind: 'card' },
      { id: 'saas', label: 'SaaS dan cloud', kind: 'card' },
      { id: 'stream', label: 'Streaming', kind: 'card' },
      { id: 'appstore', label: 'App Store dan iCloud', kind: 'gift', brand: 'App Store' },
      { id: 'play', label: 'Google Play', kind: 'gift', brand: 'Google Play' },
      { id: 'dev', label: 'AI API untuk aplikasi', kind: 'api' },
    ],
    /** `{brand}` is replaced with the selected service brand. */
    paths: {
      gift: {
        badge: 'Jalur gift card',
        title: 'Gift card {brand} resmi',
        desc: 'Layanan ini menerima gift card. Beli dengan Kredit Sakuin, lalu redeem di akunmu sendiri. Tanpa kartu.',
        steps: [
          'Isi Kredit Sakuin lewat QRIS atau virtual account.',
          'Pilih nominal gift card {brand} dan bayar dengan Kredit.',
          'Salin kode dan redeem di akun {brand} milikmu.',
        ],
      },
      card: {
        badge: 'Jalur kartu virtual',
        title: 'Kartu virtual dari mitra berizin',
        desc: 'Layanan ini hanya menerima kartu. Biaya terbit dibayar dengan Kredit Sakuin, saldo kartu diisi langsung ke penerbit.',
        steps: [
          'Verifikasi identitas sekali, lalu terbitkan kartu. Biaya terbit dipotong dari Kredit.',
          'Top-up kartu lewat virtual account milik penerbit kartu.',
          'Pakai nomor kartu untuk berlangganan. Atur limit atau bekukan kapan saja.',
        ],
      },
      api: {
        badge: 'Jalur AI API',
        title: 'AI API Sakuin, bayar per pemakaian',
        desc: 'Untuk developer: akses model AI lewat endpoint Sakuin, dipotong dari Kredit sesuai token yang dipakai.',
        steps: [
          'Isi Kredit Sakuin dan buat API key di dashboard.',
          'Ganti base URL di aplikasimu ke endpoint Sakuin.',
          'Pantau pemakaian token dan sisa Kredit secara real-time.',
        ],
      },
    },
  },

  products: {
    id: 'produk',
    eyebrow: 'Layanan',
    heading: 'Tiga layanan inti dalam satu akun.',
    body: 'Kredit Sakuin dipakai untuk membeli produk dan layanan Sakuin. Kredit tidak bisa ditarik atau ditransfer, dan tidak bisa dijadikan saldo kartu.',
    core: [
      {
        icon: 'card',
        title: 'Kartu Virtual Global',
        body: 'Bayar langganan SaaS, streaming, game, dan belanja online luar negeri tanpa kartu kredit fisik.',
        points: [
          'Terbit dalam hitungan menit setelah verifikasi',
          'Nomor kartu langsung tampil di aplikasi',
          'Atur limit dan bekukan kapan saja',
          '3D Secure [sesuai dukungan penerbit]',
        ],
      },
      {
        icon: 'bolt',
        title: 'Produk Digital dan PPOB',
        body: 'Pulsa, paket data semua operator, token PLN, hingga voucher game seperti Steam, Mobile Legends, dan Roblox.',
        points: ['Transaksi otomatis 24/7', 'Status transaksi real-time', 'Riwayat dan bukti transaksi rapi'],
      },
      {
        icon: 'qr',
        title: 'Isi Kredit via QRIS dan VA',
        body: 'Scan QRIS dari aplikasi bank atau e-wallet mana pun, atau transfer ke virtual account BCA, Mandiri, BRI, dan BNI.',
        points: ['Kredit masuk real-time', 'Top-up QRIS tanpa biaya', 'Bukti top-up otomatis'],
      },
    ],
    alsoLabel: 'Juga tersedia di Sakuin:',
    also: [
      { icon: 'gift', title: 'Gift card resmi', body: 'App Store, Google Play, Steam, dan voucher game dari distributor resmi.' },
      {
        icon: 'code',
        title: 'AI API untuk developer',
        body: 'Akses model AI lewat endpoint Sakuin, dibayar per pemakaian dari Kredit.',
      },
      { icon: 'cloud', title: 'Cloud, hosting, lisensi', body: 'VPS, domain, dan lisensi software lewat program reseller resmi.' },
    ],
  },

  fees: {
    id: 'biaya',
    eyebrow: 'Biaya',
    heading: 'Biaya jelas di depan, tanpa kejutan.',
    columns: { service: 'Layanan', fee: 'Biaya' },
    rows: [
      { service: 'Top-up Kredit via QRIS', fee: 'Gratis' },
      { service: 'Top-up Kredit via VA, di bawah Rp500.000', fee: '[Rp4.000]' },
      { service: 'Terbitkan kartu virtual (dari Kredit)', fee: '[Rp25.000] per kartu' },
      { service: 'Layanan top-up kartu (dari Kredit)', fee: '[1%], min. [Rp3.000]' },
      { service: 'Transaksi luar negeri di kartu', fee: 'Sesuai ketentuan penerbit' },
    ],
    note: 'Angka dalam kurung siku adalah usulan dan dikonfirmasi saat peluncuran.',
    simulator: {
      heading: 'Simulasi top-up kartu',
      amountLabel: 'Nominal top-up',
      min: 50000,
      max: 5000000,
      step: 50000,
      defaultAmount: 500000,
      /** Proposed tariff: 1% with a minimum, matching the table above. */
      feeRate: 0.01,
      minFee: 3000,
      paidLabel: 'Dibayar ke VA penerbit kartu',
      feeLabel: 'Biaya layanan, dipotong dari Kredit',
      resultLabel: 'Saldo kartu bertambah',
      note: 'Dana top-up langsung masuk ke penerbit kartu, bukan ke Sakuin. Simulasi memakai tarif usulan.',
    },
  },

  security: {
    id: 'keamanan',
    eyebrow: 'Keamanan dan regulasi',
    heading: 'Cara Sakuin menjaga uang dan datamu.',
    items: [
      {
        featured: true,
        title: 'Kartu dari mitra PJP berizin',
        body: 'Kartu virtual diterbitkan [Nama mitra penerbit], Penyedia Jasa Pembayaran yang berizin dan diawasi Bank Indonesia.',
      },
      {
        featured: true,
        title: 'Enkripsi AES-256 dan TLS',
        body: 'Data identitas dan kode voucher dienkripsi AES-256. Semua koneksi memakai TLS 1.2 ke atas.',
      },
      {
        featured: true,
        title: 'Pemantauan fraud 24/7',
        body: 'Transaksi dipantau otomatis untuk mendeteksi pola mencurigakan dan melindungi akunmu.',
      },
      {
        featured: false,
        title: 'Pembayaran lewat mitra berizin',
        body: 'Top-up diproses payment gateway berizin. Saldo kartu dipegang penerbit kartu.',
      },
      {
        featured: false,
        title: 'Data kartu tidak kami simpan',
        body: 'Nomor kartu dan CVV ditampilkan langsung oleh penerbit di aplikasi.',
      },
      {
        featured: false,
        title: 'Verifikasi identitas',
        body: 'KYC bertahap sesuai fitur yang kamu pakai. Data identitas dienkripsi.',
      },
      {
        featured: false,
        title: 'Akun atas namamu sendiri',
        body: 'Gift card di-redeem di akunmu. Tidak ada akun berbagi atau pindah region.',
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
          'Bukan. Sakuin menjual produk digital dan layanan kartu. Kartu virtual diterbitkan oleh mitra penerbit berizin, dan saldo kartu dipegang penerbit.',
      },
      {
        id: 'kredit',
        question: 'Apakah Kredit Sakuin bisa jadi saldo kartu?',
        answer:
          'Tidak. Kredit hanya membayar produk dan layanan Sakuin, termasuk biaya terbit dan biaya layanan top-up kartu. Saldo kartu diisi langsung ke virtual account penerbit.',
      },
      {
        id: 'penerbit',
        question: 'Siapa yang menerbitkan kartu virtual?',
        answer: '[Nama mitra penerbit], penyelenggara jasa pembayaran yang berizin Bank Indonesia.',
      },
      {
        id: 'diterima',
        question: 'Apakah kartu pasti diterima di semua layanan?',
        answer:
          'Tidak selalu. Penerimaan bergantung pada kebijakan tiap merchant. Kami menampilkan daftar layanan yang sudah diuji di aplikasi.',
      },
      {
        id: 'kyc',
        question: 'Apakah saya perlu verifikasi identitas?',
        answer:
          'Ya, untuk kartu virtual kamu perlu verifikasi KTP dan swafoto sesuai syarat penerbit. Gift card dan PPOB cukup email dan nomor HP.',
      },
      {
        id: 'qris',
        question: 'Bisakah saya bayar di merchant QRIS memakai Sakuin?',
        answer:
          'Belum. Di Sakuin, QRIS dipakai untuk mengisi Kredit. Kredit hanya untuk produk dan layanan Sakuin, bukan untuk membayar merchant lain.',
      },
      {
        id: 'kapan',
        question: 'Kapan Sakuin bisa dipakai?',
        answer:
          'Sakuin sedang dalam persiapan peluncuran ([perkiraan tanggal]). Buat akun sekarang untuk mendapat kabar pertama.',
      },
    ],
  },

  finalCta: {
    id: 'daftar',
    heading: 'Mulai nikmati kemudahan transaksi digital.',
    // Design text mentioned a waitlist. There is no waitlist backend, so the form leads to sign up instead.
    body: 'Buat akun dalam 2 menit, isi Kredit via QRIS atau VA, lalu pakai untuk PPOB, gift card, dan kartu virtual.',
    emailPlaceholder: 'nama@email.com',
    submit: 'Buat akun',
    action: '/signup',
  },

  footer: {
    legal: 'sakuin.co.id adalah platform layanan digital yang dikelola oleh PT Anugrah Sejahtera Teknologi.',
    regulatory:
      'Kartu virtual diterbitkan oleh [Nama mitra penerbit], Penyedia Jasa Pembayaran yang berizin dan diawasi Bank Indonesia. Pemrosesan top-up dilakukan oleh payment gateway berizin.',
    services: {
      title: 'Layanan',
      links: [
        { label: 'Kartu Virtual', href: '#produk' },
        { label: 'Top-up Kredit', href: '#cara-kerja' },
        { label: 'Pulsa dan Paket Data', href: '#produk' },
        { label: 'Token PLN', href: '#produk' },
        { label: 'Voucher Game', href: '#produk' },
        { label: 'Gift Card', href: '#produk' },
      ] satisfies FooterLink[],
    },
    support: {
      title: 'Dukungan dan Legal',
      links: [
        { label: 'Kebijakan Privasi' },
        { label: 'Syarat dan Ketentuan' },
        { label: 'Biaya Transaksi', href: '#biaya' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Hubungi Kami' },
      ] satisfies FooterLink[],
    },
    soon: 'Segera',
    copyright: '© 2026 sakuin.co.id (PT Anugrah Sejahtera Teknologi). Hak cipta dilindungi.',
    badges: ['[Badge sertifikasi keamanan]', '[Logo mitra penerbit]'],
    disclaimer:
      'Sakuin bukan bank, bukan penerbit uang elektronik, dan tidak menerbitkan kartu. Kredit Sakuin hanya dapat digunakan untuk membeli produk dan layanan Sakuin, tidak dapat ditarik tunai, ditransfer, atau dipindahkan ke saldo kartu. Penerimaan kartu bergantung pada kebijakan masing-masing merchant. Logo jaringan kartu ditampilkan sesuai pedoman merek penerbit. Nama merek pihak ketiga adalah milik pemiliknya masing-masing.',
  },
} as const;

export type LandingContent = typeof landingContent;
