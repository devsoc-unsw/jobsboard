import React from 'react';
import container from 'styles/container.module.css';
import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Header from 'components/Header/Header';

type MainRootLayoutProps = {
  children: React.ReactNode;
};

const MainRootLayout = ({ children }: MainRootLayoutProps) => {
  return (
    <>
      <Header />
      <div className={container.pageContainer}>
        <Breadcrumbs />
        {children}
      </div>
    </>
  );
};

export default MainRootLayout;
