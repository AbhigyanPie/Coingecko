import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CoinData, Portfolio } from '@/types/crypto';

interface AppState {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Currency
  currency: string;
  setCurrency: (currency: string) => void;

  // Favorites
  favorites: string[];
  addToFavorites: (coinId: string) => void;
  removeFromFavorites: (coinId: string) => void;
  isFavorite: (coinId: string) => boolean;

  // Portfolio
  portfolios: Portfolio[];
  activePortfolioId: string | null;
  addPortfolio: (portfolio: Portfolio) => void;
  updatePortfolio: (id: string, portfolio: Partial<Portfolio>) => void;
  deletePortfolio: (id: string) => void;
  setActivePortfolio: (id: string) => void;

  // Market data cache
  coins: CoinData[];
  setCoins: (coins: CoinData[]) => void;
  lastUpdated: number | null;
  setLastUpdated: (timestamp: number) => void;

  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Search
  searchHistory: string[];
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      // Currency
      currency: 'usd',
      setCurrency: (currency) => set({ currency }),

      // Favorites
      favorites: [],
      addToFavorites: (coinId) =>
        set((state) => ({
          favorites: [...state.favorites, coinId],
        })),
      removeFromFavorites: (coinId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== coinId),
        })),
      isFavorite: (coinId) => get().favorites.includes(coinId),

      // Portfolio
      portfolios: [],
      activePortfolioId: null,
      addPortfolio: (portfolio) =>
        set((state) => ({
          portfolios: [...state.portfolios, portfolio],
          activePortfolioId: portfolio.id,
        })),
      updatePortfolio: (id, updates) =>
        set((state) => ({
          portfolios: state.portfolios.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      deletePortfolio: (id) =>
        set((state) => ({
          portfolios: state.portfolios.filter((p) => p.id !== id),
          activePortfolioId:
            state.activePortfolioId === id ? null : state.activePortfolioId,
        })),
      setActivePortfolio: (id) => set({ activePortfolioId: id }),

      // Market data cache
      coins: [],
      setCoins: (coins) => set({ coins }),
      lastUpdated: null,
      setLastUpdated: (timestamp) => set({ lastUpdated: timestamp }),

      // UI state
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Search
      searchHistory: [],
      addToSearchHistory: (query) =>
        set((state) => {
          const newHistory = [
            query,
            ...state.searchHistory.filter((q) => q !== query),
          ].slice(0, 10);
          return { searchHistory: newHistory };
        }),
      clearSearchHistory: () => set({ searchHistory: [] }),
    }),
    {
      name: 'crypto-tracker-store',
      partialize: (state) => ({
        theme: state.theme,
        currency: state.currency,
        favorites: state.favorites,
        portfolios: state.portfolios,
        activePortfolioId: state.activePortfolioId,
        searchHistory: state.searchHistory,
      }),
    }
  )
);

// Hook for theme management with system preference detection
export const useTheme = () => {
  const { theme, toggleTheme } = useStore();

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  };
};