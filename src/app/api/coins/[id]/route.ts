import { NextRequest, NextResponse } from 'next/server';
import { CoinGeckoAPI } from '@/lib/api/coingecko';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const coinId = params.id;

    if (!coinId) {
      return NextResponse.json(
        { error: 'Coin ID is required' },
        { status: 400 }
      );
    }

    const coin = await CoinGeckoAPI.getCoinDetails(coinId);

    return NextResponse.json(coin);
  } catch (error) {
    console.error(`Error fetching coin details for ${params.id}:`, error);
    return NextResponse.json(
      { error: `Failed to fetch details for ${params.id}` },
      { status: 500 }
    );
  }
}