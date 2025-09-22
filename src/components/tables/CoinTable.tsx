'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CoinGeckoAPI } from '@/lib/api/coingecko';
import { useStore } from '@/store/useStore';
import { formatCurrency, formatLargeNumber, formatPercentage, getChangeColorClass } from '@/lib/utils/format';
import { CoinData } from '@/types/crypto';

interface CoinTableProps {
  title?: string;
  limit?: number;
  showPagination?: boolean;
}

export function CoinTable({ title = 'Top Cryptocurrencies', limit = 50, showPagination = true }: CoinTableProps) {
  const [page, setPage] = useState(1);
  const { currency } = useStore();

  const { data: coins = [], isLoading, error } = useQuery({
    queryKey: ['coins', currency, page, limit],
    queryFn: () =>
      CoinGeckoAPI.getCoins({
        vs_currency: currency,
        per_page: limit,
        page,
        price_change_percentage: '1h,24h,7d,30d',
        sparkline: true,
      }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });


  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Failed to load cryptocurrency data. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-xl font-bold">
          {title}
          <Badge variant="secondary" className="ml-2 font-medium text-xs">
            {coins.length} coins
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-border/50 overflow-hidden shadow-sm bg-card/50 backdrop-blur-sm">
          <div className="overflow-x-auto">
          <Table className="table-auto">
            <TableHeader>
              <TableRow className="border-b border-border/50 bg-muted/30">
                <TableHead className="w-12 text-sm font-semibold text-muted-foreground/80 py-4">#</TableHead>
                <TableHead className="min-w-[200px] sticky left-0 bg-muted/30 z-10 text-sm font-semibold text-muted-foreground/80 py-4">Name</TableHead>
                <TableHead className="text-right min-w-[100px] text-sm font-semibold text-muted-foreground/80 py-4">Price</TableHead>
                <TableHead className="text-right min-w-[80px] hidden sm:table-cell text-sm font-semibold text-muted-foreground/80 py-4">1h %</TableHead>
                <TableHead className="text-right min-w-[80px] text-sm font-semibold text-muted-foreground/80 py-4">24h %</TableHead>
                <TableHead className="text-right min-w-[80px] hidden lg:table-cell text-sm font-semibold text-muted-foreground/80 py-4">7d %</TableHead>
                <TableHead className="text-right min-w-[80px] hidden xl:table-cell text-sm font-semibold text-muted-foreground/80 py-4">30d %</TableHead>
                <TableHead className="text-right min-w-[120px] hidden md:table-cell text-sm font-semibold text-muted-foreground/80 py-4">Market Cap</TableHead>
                <TableHead className="text-right min-w-[120px] hidden lg:table-cell text-sm font-semibold text-muted-foreground/80 py-4">Volume (24h)</TableHead>
                <TableHead className="text-right min-w-[120px] hidden xl:table-cell text-sm font-semibold text-muted-foreground/80 py-4">FDV</TableHead>
                <TableHead className="text-right min-w-[100px] hidden xl:table-cell text-sm font-semibold text-muted-foreground/80 py-4">MCap/FDV</TableHead>
                <TableHead className="text-right min-w-[140px] hidden xl:table-cell text-sm font-semibold text-muted-foreground/80 py-4">Circulating Supply</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 10 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="h-4 w-6 bg-muted animate-pulse rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-6 w-6 bg-muted animate-pulse rounded-full" />
                          <div className="space-y-1">
                            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                            <div className="h-3 w-12 bg-muted animate-pulse rounded" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-4 w-16 bg-muted animate-pulse rounded ml-auto" />
                      </TableCell>
                      <TableCell className="text-right hidden sm:table-cell">
                        <div className="h-4 w-12 bg-muted animate-pulse rounded ml-auto" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-4 w-12 bg-muted animate-pulse rounded ml-auto" />
                      </TableCell>
                      <TableCell className="text-right hidden lg:table-cell">
                        <div className="h-4 w-12 bg-muted animate-pulse rounded ml-auto" />
                      </TableCell>
                      <TableCell className="text-right hidden xl:table-cell">
                        <div className="h-4 w-12 bg-muted animate-pulse rounded ml-auto" />
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell">
                        <div className="h-4 w-20 bg-muted animate-pulse rounded ml-auto" />
                      </TableCell>
                      <TableCell className="text-right hidden lg:table-cell">
                        <div className="h-4 w-18 bg-muted animate-pulse rounded ml-auto" />
                      </TableCell>
                      <TableCell className="text-right hidden xl:table-cell">
                        <div className="h-4 w-20 bg-muted animate-pulse rounded ml-auto" />
                      </TableCell>
                      <TableCell className="text-right hidden xl:table-cell">
                        <div className="h-4 w-16 bg-muted animate-pulse rounded ml-auto" />
                      </TableCell>
                      <TableCell className="text-right hidden xl:table-cell">
                        <div className="space-y-1">
                          <div className="h-4 w-24 bg-muted animate-pulse rounded ml-auto" />
                          <div className="h-3 w-8 bg-muted animate-pulse rounded ml-auto" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : coins.map((coin: CoinData) => (
                    <TableRow key={coin.id} className="border-b border-border/30 hover:bg-accent/30 cursor-pointer transition-colors duration-150">
                      <TableCell className="font-semibold text-muted-foreground text-sm py-4">
                        <div className="w-8 text-center">
                          {coin.market_cap_rank || '--'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/coins/${coin.id}`}
                          className="flex items-center space-x-3 group hover:bg-accent/50 p-2 -mx-2 rounded-md transition-all duration-200"
                        >
                          <div className="relative">
                            <Image
                              src={coin.image}
                              alt={coin.name}
                              width={28}
                              height={28}
                              className="rounded-full ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-200"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                              {coin.name}
                            </div>
                            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider opacity-75 group-hover:opacity-100 transition-opacity duration-200">
                              {coin.symbol}
                            </div>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right font-bold text-foreground text-base py-4">
                        <span className="group-hover:text-primary transition-colors duration-200">
                          {formatCurrency(coin.current_price, currency.toUpperCase())}
                        </span>
                      </TableCell>
                      <TableCell className={`text-right hidden sm:table-cell py-4 ${getChangeColorClass(coin.price_change_percentage_1h_in_currency?.[currency] || 0)}`}>
                        <div className="flex items-center justify-end space-x-1">
                          {coin.price_change_percentage_1h_in_currency?.[currency] > 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          <span>
                            {formatPercentage(coin.price_change_percentage_1h_in_currency?.[currency] || 0)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={`text-right py-4 ${getChangeColorClass(coin.price_change_percentage_24h || 0)}`}>
                        <div className="flex items-center justify-end space-x-1">
                          {coin.price_change_percentage_24h > 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          <span>
                            {formatPercentage(coin.price_change_percentage_24h || 0)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={`text-right hidden lg:table-cell py-4 ${getChangeColorClass(coin.price_change_percentage_7d_in_currency?.[currency] || 0)}`}>
                        <div className="flex items-center justify-end space-x-1">
                          {coin.price_change_percentage_7d_in_currency?.[currency] > 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          <span>
                            {formatPercentage(coin.price_change_percentage_7d_in_currency?.[currency] || 0)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={`text-right hidden xl:table-cell py-4 ${getChangeColorClass(coin.price_change_percentage_30d_in_currency?.[currency] || 0)}`}>
                        <div className="flex items-center justify-end space-x-1">
                          {(coin.price_change_percentage_30d_in_currency?.[currency] || 0) > 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          <span>
                            {formatPercentage(coin.price_change_percentage_30d_in_currency?.[currency] || 0)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-muted-foreground hidden md:table-cell py-4">
                        {formatLargeNumber(coin.market_cap)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-muted-foreground hidden lg:table-cell py-4">
                        {formatLargeNumber(coin.total_volume)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-muted-foreground hidden xl:table-cell py-4">
                        {coin.fully_diluted_valuation ? formatLargeNumber(coin.fully_diluted_valuation) : '--'}
                      </TableCell>
                      <TableCell className="text-right font-medium text-muted-foreground hidden xl:table-cell py-4">
                        {coin.fully_diluted_valuation && coin.market_cap
                          ? (coin.market_cap / coin.fully_diluted_valuation).toFixed(2)
                          : '--'
                        }
                      </TableCell>
                      <TableCell className="text-right hidden xl:table-cell py-4">
                        <div className="font-medium text-foreground">
                          {formatLargeNumber(coin.circulating_supply)}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                          {coin.symbol.toUpperCase()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          </div>
        </div>

        {showPagination && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-muted-foreground/10">
            <div className="text-sm text-muted-foreground font-medium">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, coins.length)} entries
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="transition-all duration-200 hover:shadow-sm"
              >
                Previous
              </Button>
              <span className="text-sm font-medium bg-muted/50 px-3 py-1 rounded-md">Page {page}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={coins.length < limit}
                className="transition-all duration-200 hover:shadow-sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}