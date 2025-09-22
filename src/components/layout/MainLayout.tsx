'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { StoreProvider } from '@/providers/StoreProvider';
import { useTheme } from '@/store/useStore';

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayoutContent({ children }: MainLayoutProps) {
  const { theme } = useTheme();

  return (
    <div className={theme}>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <StoreProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </StoreProvider>
  );
}