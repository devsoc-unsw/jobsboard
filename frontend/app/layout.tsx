import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import { Assistant } from '@next/font/google';
import ThemeProvider from 'contexts/ThemeProvider';
import { getCssText } from 'stitches.config';
import Footer from 'components/Footer/Footer';
import AppProvider from '../contexts/AppProvider';
import 'styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false;
const assistant = Assistant({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
  subsets: ['latin']
});

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <head>
        <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
      </head>
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
