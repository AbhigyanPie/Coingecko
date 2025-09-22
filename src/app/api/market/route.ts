import { NextResponse } from 'next/server';
import { CoinGeckoAPI } from '@/lib/api/coingecko';

export async function GET() {
  try {
    const globalData = await CoinGeckoAPI.getGlobalData();

    return NextResponse.json(globalData);
  } catch (error) {
    console.error('Error fetching global market data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch global market data' },
      { status: 500 }
    );
  }
}