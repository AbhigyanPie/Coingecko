'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CoinGeckoAPI } from '@/lib/api/coingecko';
import { formatLargeNumber } from '@/lib/utils/format';
import { ExternalLink, TrendingUp, Shield } from 'lucide-react';
import { Exchange } from '@/types/crypto';

export default function ExchangesPage() {
  const { data: exchanges = [], isLoading, error } = useQuery({
    queryKey: ['exchanges'],
    queryFn: CoinGeckoAPI.getExchanges,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  if (error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-destructive mb-4">Failed to Load Exchanges</h1>
        <p className="text-muted-foreground">
          Unable to fetch exchange data. Please try again later.
        </p>
      </div>
    );
  }

  const getTrustScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 dark:text-green-400';
    if (score >= 6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getTrustScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 8) return 'default';
    if (score >= 6) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Cryptocurrency Exchanges</h1>
        <p className="text-muted-foreground mt-2">
          Top cryptocurrency exchanges ranked by trust score and trading volume
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exchanges</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-6 bg-muted animate-pulse rounded" />
              ) : (
                exchanges.length
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Active trading platforms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Trust Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-6 bg-muted animate-pulse rounded" />
              ) : (
                exchanges.filter(ex => ex.trust_score >= 8).length
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Exchanges with trust score ≥ 8
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume (24h)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-6 bg-muted animate-pulse rounded" />
              ) : (
                formatLargeNumber(
                  exchanges.reduce((sum, ex) => sum + (ex.trade_volume_24h_btc || 0), 0)
                ) + ' BTC'
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Combined trading volume
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Exchanges Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Exchanges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Exchange</TableHead>
                  <TableHead className="text-right">Trust Score</TableHead>
                  <TableHead className="text-right">Volume (24h) BTC</TableHead>
                  <TableHead className="text-right">Volume (24h) Normalized</TableHead>
                  <TableHead className="text-center">Country</TableHead>
                  <TableHead className="text-center">Established</TableHead>
                  <TableHead className="text-center">Website</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 10 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell colSpan={8}>
                          <div className="h-12 bg-muted animate-pulse rounded" />
                        </TableCell>
                      </TableRow>
                    ))
                  : exchanges.map((exchange: Exchange, index: number) => (
                      <TableRow key={exchange.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {exchange.trust_score_rank || index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Image
                              src={exchange.image}
                              alt={exchange.name}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                            <div>
                              <div className="font-medium">{exchange.name}</div>
                              {exchange.has_trading_incentive && (
                                <Badge variant="outline" className="text-xs mt-1">
                                  Trading Incentive
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={getTrustScoreBadgeVariant(exchange.trust_score)}
                            className={getTrustScoreColor(exchange.trust_score)}
                          >
                            {exchange.trust_score}/10
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {exchange.trade_volume_24h_btc
                            ? formatLargeNumber(exchange.trade_volume_24h_btc)
                            : '--'}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {exchange.trade_volume_24h_btc_normalized
                            ? formatLargeNumber(exchange.trade_volume_24h_btc_normalized)
                            : '--'}
                        </TableCell>
                        <TableCell className="text-center">
                          {exchange.country || '--'}
                        </TableCell>
                        <TableCell className="text-center">
                          {exchange.year_established || '--'}
                        </TableCell>
                        <TableCell className="text-center">
                          {exchange.url && (
                            <a
                              href={exchange.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-primary hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}