'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { useStore, useTheme } from '@/store/useStore';
import { Search, Moon, Sun, Star, Wallet, TrendingUp, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Coins', href: '/coins', icon: TrendingUp },
  { name: 'Exchanges', href: '/exchanges', icon: BarChart3 },
  { name: 'Portfolio', href: '/portfolio', icon: Wallet },
];

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency, sidebarOpen, setSidebarOpen } = useStore();

  return (
    <header className="header-enhanced">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="logo-enhanced">
            <div className="logo-icon-enhanced">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="logo-text-enhanced">CoinTracker</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2" role="navigation" aria-label="Main navigation">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'nav-link-enhanced',
                    isActive && 'active'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{item.name}</span>
                  {item.name === 'Portfolio' && (
                    <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
                      Beta
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Search Bar */}
        <div className="search-container-enhanced">
          <Search className="search-icon-enhanced" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            className="search-input-enhanced"
            aria-label="Search cryptocurrencies"
            role="searchbox"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Currency Selector */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="currency-selector-enhanced"
            aria-label="Select currency"
          >
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="btc">BTC</option>
            <option value="eth">ETH</option>
          </select>

          {/* Favorites */}
          <button
            className="action-button-enhanced"
            aria-label="View favorites"
            type="button"
          >
            <Star className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Favorites</span>
          </button>

          {/* Theme Toggle */}
          <button
            className="action-button-enhanced"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            type="button"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="sr-only">Toggle theme</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className={cn("menu-toggle-enhanced md:hidden", sidebarOpen && "open")}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            aria-expanded={sidebarOpen}
            aria-controls="mobile-navigation"
            type="button"
          >
            <div className="menu-icon-enhanced" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        id="mobile-navigation"
        className={cn("mobile-menu-enhanced md:hidden", sidebarOpen && "open")}
        aria-hidden={!sidebarOpen}
      >
        <nav className="mobile-menu-grid-enhanced" role="navigation" aria-label="Mobile navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'mobile-nav-link-enhanced',
                  isActive && 'active'
                )}
                onClick={() => setSidebarOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                tabIndex={sidebarOpen ? 0 : -1}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{item.name}</span>
                {item.name === 'Portfolio' && (
                  <Badge variant="secondary" className="ml-auto px-1 py-0 text-xs">
                    Beta
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}