import type { Metadata } from 'next';
import { LandingPage, landingContent } from '@/features/public';

export const metadata: Metadata = {
  metadataBase: new URL('https://sakuin.co.id'),
  title: 'sakuin.co.id — Satu Saldo Terpadu untuk Virtual Debit Card & Kebutuhan Harian',
  description:
    'Platform fintech terpadu untuk menerbitkan Virtual Debit Card (belanja online global & langganan SaaS tanpa kartu kredit bank), bayar instan QRIS, dan produk digital PPOB 24/7.',
  keywords: [
    'virtual debit card indonesia',
    'kartu debit virtual',
    'bayar langganan tanpa kartu kredit',
    'satu saldo terpadu',
    'qris instan',
    'ppob 24 jam',
    'sakuin',
    'sakuin wallet',
  ],
  alternates: {
    canonical: 'https://sakuin.co.id',
  },
  openGraph: {
    title: 'sakuin.co.id — Satu Saldo Terpadu untuk Transaksi Global & Kebutuhan Harian',
    description:
      'Akses instan ke Virtual Debit Card untuk belanja internasional, pembayaran QRIS, serta pulsa dan token PLN dari satu saldo rupiah.',
    url: 'https://sakuin.co.id',
    siteName: 'sakuin.co.id',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'sakuin.co.id — Satu Saldo Terpadu Transaksi Global',
    description:
      'Virtual Debit Card untuk langganan tools global dan belanja online tanpa kartu kredit, plus bayar QRIS & PPOB.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://sakuin.co.id/#organization',
        name: 'PT Anugrah Sejahtera Teknologi',
        alternateName: 'Sakuin',
        url: 'https://sakuin.co.id',
        logo: 'https://sakuin.co.id/logo.png',
        description:
          'Penyedia platform Satu Saldo Terpadu untuk Virtual Debit Card global, QRIS, dan produk digital PPOB di Indonesia.',
      },
      {
        '@type': 'FinancialProduct',
        '@id': 'https://sakuin.co.id/#product',
        name: 'Sakuin Virtual Debit Card & Unified Balance',
        provider: {
          '@id': 'https://sakuin.co.id/#organization',
        },
        description:
          'Kartu debit virtual untuk transaksi internasional dan pembayaran online global dengan saldo terpadu dalam Rupiah tanpa markup nilai tukar.',
        category: 'Debit Card',
        feesAndCommissionsSpecification: 'https://sakuin.co.id/#biaya',
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://sakuin.co.id/#faq',
        mainEntity: landingContent.faq.items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  );
}
