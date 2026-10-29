export const messages = {
  common: {
    appName: "Dompet Digital Dollar",
    loading: "Memuat...",
    tryAgain: "Coba Lagi",
    save: "Simpan",
    cancel: "Batal",
    confirm: "Konfirmasi",
    back: "Kembali",
    viewDetails: "Lihat Detail",
    comingSoon: "Segera Hadir",
    actions: {
      submit: "Kirim",
      continue: "Lanjutkan",
      close: "Tutup",
    },
  },
  errors: {
    genericTitle: "Terjadi kesalahan",
    genericDescription: "Terjadi kendala sistem tak terduga. Silakan periksa koneksi Anda dan coba lagi.",
    notFoundTitle: "Halaman tidak ditemukan",
    notFoundDescription: "Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.",
    unauthorized: "Anda harus masuk terlebih dahulu untuk mengakses halaman ini.",
    forbidden: "Anda tidak memiliki izin untuk melihat informasi ini.",
  },
  emptyStates: {
    noDataTitle: "Data tidak ditemukan",
    noDataDescription: "Belum ada catatan atau informasi yang dapat ditampilkan saat ini.",
    noTransactionsTitle: "Belum ada transaksi",
    noTransactionsDescription: "Isi saldo USD atau terima pembayaran Rupiah untuk memulai transaksi dompet Anda.",
  },
  wallet: {
    title: "Ringkasan Dompet",
    currentBalance: "Saldo Utama USD",
    balanceHidden: "••••••",
    actions: {
      topUp: "Isi Saldo",
      requestCard: "Ajukan Kartu",
      receive: "Terima Pembayaran",
      history: "Riwayat Transaksi",
    },
  },
  kyc: {
    status: {
      notVerified: "Belum Terverifikasi",
      inReview: "Sedang Ditinjau",
      approved: "Disetujui",
      rejected: "Ditolak",
      reuploadRequired: "Perlu Unggah Ulang",
    },
    banner: {
      title: "Verifikasi KTP Anda untuk membuka fitur deposit dan kartu virtual",
      description: "Unggah foto KTP resmi yang jelas dan tidak terpotong untuk mengaktifkan isi saldo Rupiah dan transaksi global.",
      cta: "Verifikasi KTP",
    },
  },
  auth: {
    signIn: "Masuk ke Akun",
    signUp: "Daftar Akun Baru",
    signOut: "Keluar",
    emailLabel: "Alamat Email",
    passwordLabel: "Kata Sandi",
  },
} as const;

export type Messages = typeof messages;
