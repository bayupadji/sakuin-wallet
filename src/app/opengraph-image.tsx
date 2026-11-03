import { ImageResponse } from 'next/og';

export const alt =
  'sakuin.co.id | Satu Saldo Terpadu untuk Virtual Debit Card, QRIS & PPOB 24/7';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0F1115',
          color: '#FFFFFF',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: '#1D9BF0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
                <path d="M8 8V6a4 4 0 0 1 8 0v2" />
              </svg>
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '32px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              <span>sakuin</span>
              <span style={{ color: '#94A3B8', fontWeight: 600 }}>.co.id</span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 20px',
              borderRadius: '999px',
              backgroundColor: '#0C2D48',
              border: '1px solid #1D9BF0',
              color: '#67E8F9',
              fontSize: '18px',
              fontWeight: 700,
            }}
          >
            Virtual Debit Card &bull; QRIS &bull; PPOB 24/7
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '960px' }}>
          <div
            style={{
              fontSize: '60px',
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
            }}
          >
            Satu Saldo Terpadu untuk Transaksi Global &amp; Kebutuhan Harian.
          </div>
          <div
            style={{
              fontSize: '26px',
              lineHeight: 1.45,
              color: '#94A3B8',
            }}
          >
            Top up Rupiah via QRIS dan Virtual Account, konversi kurs referensi Wise tanpa markup, dan belanja online berproteksi 3D Secure.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #1E293B',
            paddingTop: '28px',
            fontSize: '18px',
            color: '#94A3B8',
          }}
        >
          <span>PT Anugrah Sejahtera Teknologi</span>
          <span style={{ color: '#22D3EE', fontWeight: 600 }}>
            Didukung Mitra Berlisensi PJP Kategori 1 Bank Indonesia
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

