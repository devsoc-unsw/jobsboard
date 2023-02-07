import React from 'react';
import Image from 'next/image';
import jobsboardLogo from 'assets/logos/JobsboardLogo.png';
import S from './styles';

const PageLoading = () => (
  <S.PageWrapper>
    <S.LoadingLogo>
      <Image src={jobsboardLogo} alt="Jobsboard Logo" width={200} height={200} />
    </S.LoadingLogo>
  </S.PageWrapper>
);

export default PageLoading;
