import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'sakuin.co.id',
    short_name: 'Sakuin',
    description:
      'Satu Saldo Terpadu untuk Virtual Debit Card global, bayar instan QRIS, dan produk digital PPOB 24/7.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F1115',
    theme_color: '#0F1115',
    lang: 'id',
    icons: [
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}

