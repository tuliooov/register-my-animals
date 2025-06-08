"use cliente"

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Provider } from 'jotai';
import { ThemeProviderWrapper } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cadastro de Animais',
  description: 'Plataforma para cadastro e gerenciamento de animais',
  manifest: '/manifest.json',
  themeColor: '#2196f3',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Provider>
          <ThemeProviderWrapper>
            {children}
          </ThemeProviderWrapper>
        </Provider>
      </body>
    </html>
  );
}

