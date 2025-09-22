import { NextRequest, NextResponse } from 'next/server';
import { CoinGeckoAPI } from '@/lib/api/coingecko';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const vs_currency = searchParams.get('vs_currency') || 'usd';
    const order = searchParams.get('order') || 'market_cap_desc';
    const per_page = parseInt(searchParams.get('per_page') || '100');
    const page = parseInt(searchParams.get('page') || '1');
    const sparkline = searchParams.get('sparkline') === 'true';
    const price_change_percentage = searchParams.get('price_change_percentage') || '24h';

    const coins = await CoinGeckoAPI.getCoins({
      vs_currency,
      order,
      per_page,
      page,
      sparkline,
      price_change_percentage,
    });

    return NextResponse.json(coins);
  } catch (error) {
    console.error('Error fetching coins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coins data' },
      { status: 500 }
    );
  }
}