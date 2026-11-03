import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api/',
          '/maintenance',
          '/wallet',
          '/card',
          '/transactions',
          '/top-up',
          '/kyc',
        ],
      },
    ],
    sitemap: 'https://sakuin.co.id/sitemap.xml',
  };
}

