import { NextResponse } from 'next/server';
import { CoinGeckoAPI } from '@/lib/api/coingecko';

export async function GET() {
  try {
    const exchanges = await CoinGeckoAPI.getExchanges();

    return NextResponse.json(exchanges);
  } catch (error) {
    console.error('Error fetching exchanges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exchanges data' },
      { status: 500 }
    );
  }
}