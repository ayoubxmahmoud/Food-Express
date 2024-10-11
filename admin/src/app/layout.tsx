import * as React from 'react';
import type { Viewport } from 'next';

import '@/styles/global.css';

import { AdminProvider } from '@/contexts/admin-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false


export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <LocalizationProvider>
          <AdminProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </AdminProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
