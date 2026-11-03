import type { Metadata } from 'next';
import { LandingPage, landingContent } from '@/features/public';

export const metadata: Metadata = {
  title: {
    absolute: 'Virtual Debit Card & Saldo Terpadu Indonesia | sakuin.co.id',
  },
  description:
    'Platform Satu Saldo Terpadu untuk menerbitkan Virtual Debit Card berproteksi 3D Secure, konversi kurs Wise tanpa markup, bayar instan QRIS, dan PPOB 24/7.',
  keywords: [
    'virtual debit card indonesia',
    'kartu debit virtual',
    'bayar langganan tanpa kartu kredit',
    'satu saldo terpadu',
    'qris instan',
    'ppob 24 jam',
    'sakuin',
    'sakuin.co.id',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Virtual Debit Card & Satu Saldo Terpadu | sakuin.co.id',
    description:
      'Akses instan ke Virtual Debit Card untuk belanja internasional, pembayaran QRIS nasional, serta pulsa dan token PLN 24/7 dari satu saldo terpadu.',
    url: 'https://sakuin.co.id',
    siteName: 'sakuin.co.id',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Virtual Debit Card & Satu Saldo Terpadu | sakuin.co.id',
    description:
      'Virtual Debit Card berproteksi 3D Secure untuk langganan tools global dan belanja online tanpa kartu kredit bank, plus QRIS & PPOB 24/7.',
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
        '@type': 'WebSite',
        '@id': 'https://sakuin.co.id/#website',
        name: 'Sakuin',
        alternateName: 'sakuin.co.id',
        url: 'https://sakuin.co.id',
        inLanguage: 'id-ID',
        publisher: {
          '@id': 'https://sakuin.co.id/#organization',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://sakuin.co.id/#organization',
        name: 'PT Anugrah Sejahtera Teknologi',
        alternateName: 'Sakuin',
        url: 'https://sakuin.co.id',
        logo: {
          '@type': 'ImageObject',
          url: 'https://sakuin.co.id/icon',
          width: 512,
          height: 512,
        },
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'support@sakuin.co.id',
          contactType: 'customer support',
          availableLanguage: ['Indonesian'],
        },
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
