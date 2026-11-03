import { describe, expect, it, vi } from 'vitest';

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono' }),
}));

import robots from './robots';
import sitemap from './sitemap';
import manifest from './manifest';
import { metadata as rootMetadata } from './layout';
import { metadata as homeMetadata } from './page';
import { metadata as signInMetadata } from './(public)/signin/page';
import { metadata as signUpMetadata } from './(public)/signup/page';

describe('SEO technical & metadata invariants', () => {
  it('robots.ts blocks private and utility prefixes without trailing-slash gaps', () => {
    const config = robots();
    const rules = Array.isArray(config.rules) ? config.rules : [config.rules];
    const wildcard = rules.find((r) => r.userAgent === '*');

    expect(wildcard).toBeDefined();
    expect(wildcard?.disallow).toEqual(
      expect.arrayContaining([
        '/admin',
        '/api/',
        '/maintenance',
        '/wallet',
        '/card',
        '/transactions',
        '/top-up',
        '/kyc',
      ])
    );
    expect(config.sitemap).toBe('https://sakuin.co.id/sitemap.xml');
  });

  it('sitemap.ts lists only canonical indexable public routes with deterministic timestamps', () => {
    const first = sitemap();
    const second = sitemap();
    const urls = first.map((entry) => entry.url);

    expect(urls).toEqual(['https://sakuin.co.id', 'https://sakuin.co.id/signup']);
    expect(urls).not.toContain('https://sakuin.co.id/signin');
    expect(first[0].lastModified).toEqual(second[0].lastModified);
  });

  it('manifest.ts declares sakuin.co.id identity and generated PNG icons', () => {
    const webManifest = manifest();
    expect(webManifest.name).toBe('sakuin.co.id');
    expect(webManifest.lang).toBe('id');
    expect(webManifest.icons?.length).toBeGreaterThanOrEqual(2);
  });

  it('public metadata sets metadataBase, canonicals, noindex on signin, and avoids legacy brand or em-dashes', () => {
    expect(rootMetadata.metadataBase?.toString()).toBe('https://sakuin.co.id/');
    expect(homeMetadata.alternates?.canonical).toBe('/');
    expect(signUpMetadata.alternates?.canonical).toBe('/signup');
    expect(signInMetadata.alternates?.canonical).toBe('/signin');
    expect(signInMetadata.robots).toEqual({ index: false, follow: true });

    const serialized = JSON.stringify({
      rootMetadata,
      homeMetadata,
      signInMetadata,
      signUpMetadata,
    });
    expect(serialized).not.toContain('Dompet Digital Dollar');
    expect(serialized).not.toContain('—');
  });
});
