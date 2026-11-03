import { NextResponse } from 'next/server';
import { getOrLockServerFxRate } from '@/shared/infrastructure/fx/server-rate-lock';

export async function GET() {
  try {
    const rateData = await getOrLockServerFxRate();
    return NextResponse.json(rateData, {
      status: 200,
      headers: {
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Gagal mengambil kurs referensi Wise',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 502 }
    );
  }
}
