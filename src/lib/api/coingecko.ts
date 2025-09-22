import axios from 'axios';
import { CoinData, CoinDetails, Exchange, MarketData, ChartData } from '@/types/crypto';

const BASE_URL = 'https://api.coingecko.com/api/v3';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export class CoinGeckoAPI {
  static async getCoins({
    vs_currency = 'usd',
    order = 'market_cap_desc',
    per_page = 100,
    page = 1,
    sparkline = false,
    price_change_percentage = '24h',
  }: {
    vs_currency?: string;
    order?: string;
    per_page?: number;
    page?: number;
    sparkline?: boolean;
    price_change_percentage?: string;
  } = {}): Promise<CoinData[]> {
    try {
      const response = await api.get('/coins/markets', {
        params: {
          vs_currency,
          order,
          per_page,
          page,
          sparkline,
          price_change_percentage,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching coins:', error);
      throw new Error('Failed to fetch coins data');
    }
  }

  static async getCoinDetails(id: string): Promise<CoinDetails> {
    try {
      const response = await api.get(`/coins/${id}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: true,
          developer_data: true,
          sparkline: false,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching coin details for ${id}:`, error);
      throw new Error(`Failed to fetch details for ${id}`);
    }
  }

  static async getCoinChart(
    id: string,
    vs_currency: string = 'usd',
    days: string = '7'
  ): Promise<ChartData[]> {
    try {
      const response = await api.get(`/coins/${id}/market_chart`, {
        params: {
          vs_currency,
          days,
        },
      });

      const { prices, market_caps, total_volumes } = response.data;

      return prices.map((price: [number, number], index: number) => ({
        timestamp: price[0],
        price: price[1],
        market_cap: market_caps?.[index]?.[1],
        total_volume: total_volumes?.[index]?.[1],
      }));
    } catch (error) {
      console.error(`Error fetching chart data for ${id}:`, error);
      throw new Error(`Failed to fetch chart data for ${id}`);
    }
  }

  static async getExchanges(): Promise<Exchange[]> {
    try {
      const response = await api.get('/exchanges', {
        params: {
          per_page: 100,
          page: 1,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching exchanges:', error);
      throw new Error('Failed to fetch exchanges data');
    }
  }

  static async getGlobalData(): Promise<MarketData> {
    try {
      const response = await api.get('/global');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching global market data:', error);
      throw new Error('Failed to fetch global market data');
    }
  }

  static async searchCoins(query: string): Promise<Array<{ id: string; name: string; symbol: string; thumb: string; market_cap_rank: number }>> {
    try {
      const response = await api.get('/search', {
        params: { query },
      });
      return response.data.coins;
    } catch (error) {
      console.error('Error searching coins:', error);
      throw new Error('Failed to search coins');
    }
  }

  static async getTrendingCoins(): Promise<Array<{ item: { id: string; name: string; symbol: string; thumb: string; market_cap_rank: number } }>> {
    try {
      const response = await api.get('/search/trending');
      return response.data.coins;
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      throw new Error('Failed to fetch trending coins');
    }
  }
}