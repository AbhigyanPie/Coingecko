'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CoinTable } from '@/components/tables/CoinTable';
import { CoinGeckoAPI } from '@/lib/api/coingecko';
import { useStore } from '@/store/useStore';
import { formatLargeNumber, formatPercentage, getChangeColorClass } from '@/lib/utils/format';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, Users } from 'lucide-react';

export default function DashboardPage() {
  const { currency } = useStore();

  // Fetch global market data
  const { data: globalData, isLoading: globalLoading } = useQuery({
    queryKey: ['global-market'],
    queryFn: CoinGeckoAPI.getGlobalData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch trending coins
  const { data: trendingCoins = [], isLoading: trendingLoading } = useQuery({
    queryKey: ['trending-coins'],
    queryFn: CoinGeckoAPI.getTrendingCoins,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const marketStats = [
    {
      title: 'Total Market Cap',
      value: globalData ? formatLargeNumber(globalData.total_market_cap[currency] || 0) : '--',
      change: globalData?.market_cap_change_percentage_24h_usd || 0,
      icon: DollarSign,
      description: 'Total cryptocurrency market capitalization',
    },
    {
      title: 'Total Volume (24h)',
      value: globalData ? formatLargeNumber(globalData.total_volume[currency] || 0) : '--',
      change: 0,
      icon: BarChart3,
      description: 'Total trading volume in the last 24 hours',
    },
    {
      title: 'Active Cryptocurrencies',
      value: globalData ? globalData.active_cryptocurrencies.toLocaleString() : '--',
      change: 0,
      icon: Activity,
      description: 'Number of active cryptocurrencies',
    },
    {
      title: 'Active Markets',
      value: globalData ? globalData.markets.toLocaleString() : '--',
      change: 0,
      icon: Users,
      description: 'Number of active trading markets',
    },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Cryptocurrency Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track cryptocurrency prices, market data, and global market statistics
        </p>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {marketStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {globalLoading ? (
                    <div className="h-8 w-24 bg-muted animate-pulse rounded-md" />
                  ) : (
                    stat.value
                  )}
                </div>
                {stat.change !== 0 && (
                  <div className={`flex items-center text-xs ${getChangeColorClass(stat.change)}`}>
                    {stat.change > 0 ? (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3" />
                    )}
                    {formatPercentage(stat.change)} from yesterday
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Market Dominance */}
      {globalData && (
        <Card>
          <CardHeader>
            <CardTitle>Market Dominance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {Object.entries(globalData.market_cap_percentage)
                .slice(0, 4)
                .map(([symbol, percentage]) => (
                  <div key={symbol} className="flex items-center justify-between">
                    <span className="text-sm font-medium uppercase">{symbol}</span>
                    <Badge variant="secondary">
                      {percentage.toFixed(1)}%
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trending Coins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Trending Coins</span>
            <Badge variant="secondary">Hot</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trendingLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border bg-card">
                  <div className="h-3 w-4 bg-muted animate-pulse rounded" />
                  <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-12 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-5 w-8 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingCoins.slice(0, 6).map((coin: { item: { id: string; name: string; symbol: string; thumb: string; market_cap_rank: number } }, index: number) => (
                <div
                  key={coin.item.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border bg-card hover:bg-muted/50 hover:shadow-sm hover:border-muted-foreground/20 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex-shrink-0">
                    <span className="text-sm font-medium text-muted-foreground">
                      #{index + 1}
                    </span>
                  </div>
                  <Image
                    src={coin.item.thumb}
                    alt={coin.item.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{coin.item.name}</p>
                    <p className="text-xs text-muted-foreground uppercase">
                      {coin.item.symbol}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    #{coin.item.market_cap_rank}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Coin Table */}
      <CoinTable />
    </div>
  );
}