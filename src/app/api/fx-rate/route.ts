import { NextResponse } from 'next/server';
import { fetchFrankfurterRate } from '@/shared/infrastructure/fx/frankfurter';

export async function GET() {
  try {
    const rateData = await fetchFrankfurterRate('USD', 'IDR');
    return NextResponse.json(rateData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch exchange rate from Frankfurter',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
