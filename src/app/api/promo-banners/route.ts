import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/shared/config';
import {
  SESSION_COOKIE_NAME,
  verifySessionCookie,
} from '@/shared/infrastructure/auth/session';
import { createServerSupabaseClient } from '@/shared/infrastructure/supabase/server';
import { PromoBannerItem, SEED_PROMO_BANNERS } from '@/features/wallet';

const globalForBanners = globalThis as unknown as {
  __sakuinPromoBanners?: PromoBannerItem[];
};

function getServerFallbackBanners(): PromoBannerItem[] {
  if (!globalForBanners.__sakuinPromoBanners) {
    globalForBanners.__sakuinPromoBanners = SEED_PROMO_BANNERS.map((b) => ({ ...b }));
  }
  return globalForBanners.__sakuinPromoBanners;
}

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionCookie(cookie);
  const isSuperAdmin = session.valid && session.payload.role === 'super_admin';

  if (config.supabase.isConfigured) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('promo_banners')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      const mapped: PromoBannerItem[] = data.map((row: Record<string, unknown>) => ({
        id: String(row.id),
        badge: String(row.badge ?? ''),
        title: String(row.title ?? ''),
        headline: String(row.headline ?? row.title ?? ''),
        summary: String(row.subtitle ?? ''),
        period: String(row.valid_until ?? ''),
        promoCode: row.promo_code ? String(row.promo_code) : undefined,
        imageSrc: String(row.image_url ?? ''),
        alt: String(row.alt_text ?? row.title ?? ''),
        steps: Array.isArray(row.steps) ? (row.steps as string[]) : [],
        terms: Array.isArray(row.terms) ? (row.terms as string[]) : [],
        ctaText: String(row.cta_label ?? ''),
        ctaHref: row.href ? String(row.href) : undefined,
        actionType: (row.action_type as PromoBannerItem['actionType']) ?? 'custom',
        isActive: Boolean(row.is_active),
        order: Number(row.display_order ?? 1),
        clickCount: Number(row.click_count ?? 0),
        viewCount: Number(row.view_count ?? 0),
        createdAt: String(row.created_at ?? new Date().toISOString()),
        updatedAt: String(row.updated_at ?? new Date().toISOString()),
      }));
      return NextResponse.json({
        banners: isSuperAdmin ? mapped : mapped.filter((b) => b.isActive),
      });
    }
  }

  const list = getServerFallbackBanners();
  return NextResponse.json({
    banners: isSuperAdmin ? list : list.filter((b) => b.isActive),
  });
}

export async function PUT(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionCookie(cookie);

  if (!session.valid || session.payload.role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: { banners?: PromoBannerItem[] };
  try {
    body = (await request.json()) as { banners?: PromoBannerItem[] };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!Array.isArray(body.banners)) {
    return NextResponse.json({ error: 'banners array is required' }, { status: 400 });
  }

  if (config.supabase.isConfigured) {
    const supabase = await createServerSupabaseClient();
    const rows = body.banners.map((b, idx) => ({
      id: b.id,
      badge: b.badge,
      title: b.title,
      headline: b.headline,
      subtitle: b.summary,
      cta_label: b.ctaText,
      action_type: b.actionType ?? 'custom',
      href: b.ctaHref ?? null,
      image_url: b.imageSrc,
      alt_text: b.alt,
      is_active: b.isActive,
      display_order: b.order ?? idx + 1,
      promo_code: b.promoCode ?? null,
      valid_until: b.period,
      steps: b.steps ?? [],
      terms: b.terms ?? [],
      click_count: b.clickCount ?? 0,
      view_count: b.viewCount ?? 0,
      updated_at: new Date().toISOString(),
    }));
    await supabase.from('promo_banners').upsert(rows, { onConflict: 'id' });
  }

  globalForBanners.__sakuinPromoBanners = body.banners.map((b) => ({ ...b }));
  return NextResponse.json({ banners: globalForBanners.__sakuinPromoBanners });
}

