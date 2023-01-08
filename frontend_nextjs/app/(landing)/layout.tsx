import React from 'react';

type LandingRootLayoutProps = {
  children: React.ReactNode;
};

const LandingRootLayout = ({ children }: LandingRootLayoutProps) => {
  return <div>{children}</div>;
};

export default LandingRootLayout;
