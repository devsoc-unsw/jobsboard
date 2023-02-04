import Footer from 'components/Footer/Footer';
import 'styles/globals.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Assistant } from '@next/font/google';
import AppProvider from './AppProvider';
import { getCssText } from 'stitches.config';
import globalStyles from '../styles/globalStyles';

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
  // useServerInsertedHTML(() => {
  //   return <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />;
  // });

  // globalStyles();
  return (
    <html>
      {/* <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} /> */}
      <body className={assistant.className}>
        <AppProvider>
          {children}
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
};

export default RootLayout;
