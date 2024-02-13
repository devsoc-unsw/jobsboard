import React from 'react';
import Image from 'next/image';
import jobsboardLogo from 'assets/logos/JobsboardLogo.png';

const PageLoading = () => (
  <div className="h-screen flex items-center justify-center flex-col">
    <div className="w-200 rounded-full animate-[pulseShadow_1.5s_infinite]">
      <Image src={jobsboardLogo} alt="Jobsboard Logo" width={200} height={200} />
    </div>
  </div>
);

export default PageLoading;
