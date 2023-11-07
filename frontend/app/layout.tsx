'use server';

import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import { Assistant } from '@next/font/google';
import ThemeProvider from 'contexts/ThemeProvider';
import Footer from 'components/Footer/Footer';
import AppProvider from '../contexts/AppProvider';
import 'styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Metadata } from 'next';

config.autoAddCss = false;
const assistant = Assistant({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Jobsboard',
  description: 'Connecting UNSW students with top employers since 2018.',
  manifest: '/manifest.webmanifest',
  themeColor: '#2c8bf4',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body className={assistant.className}>
        <ThemeProvider>
          <AppProvider>
            {children}
            <Footer />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
