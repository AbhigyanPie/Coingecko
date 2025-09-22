import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MainLayout } from '@/components/layout/MainLayout';
import { QueryProvider } from '@/providers/QueryProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CoinTracker - Cryptocurrency Tracking Platform',
  description: 'Track cryptocurrency prices, market data, and manage your portfolio',
  keywords: ['cryptocurrency', 'crypto', 'bitcoin', 'ethereum', 'portfolio', 'tracking'],
  authors: [{ name: 'CoinTracker' }],
  openGraph: {
    title: 'CoinTracker - Cryptocurrency Tracking Platform',
    description: 'Track cryptocurrency prices, market data, and manage your portfolio',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <MainLayout>
            {children}
          </MainLayout>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}