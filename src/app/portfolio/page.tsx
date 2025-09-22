'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useStore } from '@/store/useStore';
import { formatCurrency, formatPercentage, getChangeColorClass } from '@/lib/utils/format';
import { Plus, Wallet, TrendingUp, TrendingDown, Edit, Trash2 } from 'lucide-react';
import { Portfolio, PortfolioHolding } from '@/types/crypto';

export default function PortfolioPage() {
  const { portfolios, activePortfolioId, addPortfolio, setActivePortfolio, currency } = useStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');

  const activePortfolio = portfolios.find(p => p.id === activePortfolioId);

  const handleCreatePortfolio = () => {
    if (!newPortfolioName.trim()) return;

    const newPortfolio: Portfolio = {
      id: `portfolio-${Date.now()}`,
      name: newPortfolioName,
      holdings: [],
      total_value: 0,
      total_change_24h: 0,
      total_change_percentage_24h: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addPortfolio(newPortfolio);
    setNewPortfolioName('');
    setIsCreateDialogOpen(false);
  };

  const mockHoldings: PortfolioHolding[] = [
    {
      coin_id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      amount: 0.5,
      average_cost: 45000,
      current_price: 50000,
      value: 25000,
      profit_loss: 2500,
      profit_loss_percentage: 11.11,
    },
    {
      coin_id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      amount: 10,
      average_cost: 2500,
      current_price: 3000,
      value: 30000,
      profit_loss: 5000,
      profit_loss_percentage: 20.00,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground mt-2">
            Track your cryptocurrency investments and portfolio performance
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Portfolio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Portfolio</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Portfolio Name</label>
                <Input
                  value={newPortfolioName}
                  onChange={(e) => setNewPortfolioName(e.target.value)}
                  placeholder="My Crypto Portfolio"
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePortfolio}>
                  Create Portfolio
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Beta Notice */}
      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">Beta</Badge>
            <span className="text-sm">
              Portfolio tracking is currently in beta. Full functionality will be available soon.
            </span>
          </div>
        </CardContent>
      </Card>

      {portfolios.length === 0 ? (
        /* Empty State */
        <Card>
          <CardContent className="text-center py-12">
            <Wallet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Portfolios Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first portfolio to start tracking your cryptocurrency investments.
            </p>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Portfolio
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Portfolio Selector */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Active Portfolio:</span>
            <div className="flex space-x-2">
              {portfolios.map((portfolio) => (
                <Button
                  key={portfolio.id}
                  variant={activePortfolioId === portfolio.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActivePortfolio(portfolio.id)}
                >
                  {portfolio.name}
                </Button>
              ))}
            </div>
          </div>

          {activePortfolio && (
            <>
              {/* Portfolio Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(55000, currency.toUpperCase())}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Portfolio value
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      +{formatCurrency(7500, currency.toUpperCase())}
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      +15.79% total return
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">24h Change</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      +{formatCurrency(1250, currency.toUpperCase())}
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      +2.33% today
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Holdings</CardTitle>
                    <Badge variant="secondary">2</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2</div>
                    <p className="text-xs text-muted-foreground">
                      Different cryptocurrencies
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Holdings Table */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Holdings</CardTitle>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Holding
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockHoldings.map((holding) => (
                      <div
                        key={holding.coin_id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                      >
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="font-medium">{holding.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {holding.amount} {holding.symbol.toUpperCase()}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 text-right">
                          <div>
                            <div className="text-sm text-muted-foreground">Avg Cost</div>
                            <div className="font-medium">
                              {formatCurrency(holding.average_cost, currency.toUpperCase())}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-muted-foreground">Current Price</div>
                            <div className="font-medium">
                              {formatCurrency(holding.current_price, currency.toUpperCase())}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-muted-foreground">Value</div>
                            <div className="font-medium">
                              {formatCurrency(holding.value, currency.toUpperCase())}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-muted-foreground">P&L</div>
                            <div className={`font-medium ${getChangeColorClass(holding.profit_loss_percentage)}`}>
                              <div className="flex items-center justify-end space-x-1">
                                {holding.profit_loss_percentage > 0 ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingDown className="h-3 w-3" />
                                )}
                                <span>
                                  {formatPercentage(holding.profit_loss_percentage)}
                                </span>
                              </div>
                              <div className="text-xs">
                                {formatCurrency(holding.profit_loss, currency.toUpperCase())}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}