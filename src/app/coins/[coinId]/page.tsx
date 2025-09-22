'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CoinGeckoAPI } from '@/lib/api/coingecko';
import { useStore } from '@/store/useStore';
import { formatCurrency, formatLargeNumber, formatPercentage, getChangeColorClass, formatDate } from '@/lib/utils/format';
import { ArrowLeft, Star, TrendingUp, TrendingDown, ExternalLink, Globe, MessageCircle } from 'lucide-react';

export default function CoinDetailPage() {
  const params = useParams();
  const coinId = params.coinId as string;
  const { currency, isFavorite, addToFavorites, removeFromFavorites } = useStore();

  const { data: coin, isLoading, error } = useQuery({
    queryKey: ['coin-details', coinId],
    queryFn: () => CoinGeckoAPI.getCoinDetails(coinId),
    enabled: !!coinId,
    staleTime: 5 * 60 * 1000,
  });

  const handleFavoriteToggle = () => {
    if (isFavorite(coinId)) {
      removeFromFavorites(coinId);
    } else {
      addToFavorites(coinId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-muted animate-pulse rounded" />
            <div className="h-48 bg-muted animate-pulse rounded" />
          </div>
          <div className="space-y-6">
            <div className="h-96 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-destructive mb-4">Coin Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The cryptocurrency you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.
        </p>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const currentPrice = coin.market_data.current_price[currency] || 0;
  const priceChange24h = coin.market_data.price_change_percentage_24h || 0;
  const marketCap = coin.market_data.market_cap[currency] || 0;
  const volume24h = coin.market_data.total_volume[currency] || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <Image
              src={coin.image.large}
              alt={coin.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">{coin.name}</h1>
              <p className="text-muted-foreground uppercase">{coin.symbol}</p>
            </div>
            <Badge variant="outline">Rank #{coin.market_cap_rank}</Badge>
          </div>
        </div>
        <Button
          variant={isFavorite(coinId) ? "default" : "outline"}
          onClick={handleFavoriteToggle}
        >
          <Star
            className={`mr-2 h-4 w-4 ${
              isFavorite(coinId) ? 'fill-current' : ''
            }`}
          />
          {isFavorite(coinId) ? 'Remove from Favorites' : 'Add to Favorites'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Information */}
          <Card>
            <CardHeader>
              <CardTitle>Price Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold">
                    {formatCurrency(currentPrice, currency.toUpperCase())}
                  </div>
                  <div className={`flex items-center text-lg ${getChangeColorClass(priceChange24h)}`}>
                    {priceChange24h > 0 ? (
                      <TrendingUp className="mr-1 h-4 w-4" />
                    ) : (
                      <TrendingDown className="mr-1 h-4 w-4" />
                    )}
                    {formatPercentage(priceChange24h)} (24h)
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Market Cap</span>
                    <span className="font-medium">{formatLargeNumber(marketCap)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Volume (24h)</span>
                    <span className="font-medium">{formatLargeNumber(volume24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Circulating Supply</span>
                    <span className="font-medium">
                      {formatLargeNumber(coin.market_data.circulating_supply)} {coin.symbol.toUpperCase()}
                    </span>
                  </div>
                  {coin.market_data.max_supply && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max Supply</span>
                      <span className="font-medium">
                        {formatLargeNumber(coin.market_data.max_supply)} {coin.symbol.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* All-Time High/Low */}
          <Card>
            <CardHeader>
              <CardTitle>All-Time High & Low</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">All-Time High</h4>
                  <div className="text-2xl font-bold">
                    {formatCurrency(coin.market_data.ath[currency] || 0, currency.toUpperCase())}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(coin.market_data.ath_date[currency] || '')}
                  </div>
                  <div className={`text-sm ${getChangeColorClass(coin.market_data.ath_change_percentage[currency] || 0)}`}>
                    {formatPercentage(coin.market_data.ath_change_percentage[currency] || 0)} from ATH
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">All-Time Low</h4>
                  <div className="text-2xl font-bold">
                    {formatCurrency(coin.market_data.atl[currency] || 0, currency.toUpperCase())}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(coin.market_data.atl_date[currency] || '')}
                  </div>
                  <div className={`text-sm ${getChangeColorClass(coin.market_data.atl_change_percentage[currency] || 0)}`}>
                    {formatPercentage(coin.market_data.atl_change_percentage[currency] || 0)} from ATL
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {coin.description.en && (
            <Card>
              <CardHeader>
                <CardTitle>About {coin.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: coin.description.en.split('</a>')[0] + (coin.description.en.includes('</a>') ? '</a>' : ''),
                  }}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {coin.links.homepage[0] && (
                <a
                  href={coin.links.homepage[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>Website</span>
                  </div>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}

              {coin.links.blockchain_site[0] && (
                <a
                  href={coin.links.blockchain_site[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>Explorer</span>
                  </div>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}

              {coin.links.subreddit_url && (
                <a
                  href={coin.links.subreddit_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>Reddit</span>
                  </div>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}

              {coin.links.repos_url.github[0] && (
                <a
                  href={coin.links.repos_url.github[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>GitHub</span>
                  </div>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </CardContent>
          </Card>

          {/* Categories */}
          {coin.categories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {coin.categories.slice(0, 6).map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Genesis Date</span>
                <span className="font-medium">
                  {coin.genesis_date ? formatDate(coin.genesis_date) : 'N/A'}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hashing Algorithm</span>
                <span className="font-medium">{coin.hashing_algorithm || 'N/A'}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Block Time</span>
                <span className="font-medium">
                  {coin.block_time_in_minutes ? `${coin.block_time_in_minutes} min` : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}