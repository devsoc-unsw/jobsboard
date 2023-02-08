import { keyframes } from '@stitches/react';
import { styled } from 'stitches.config';

const PageWrapper = styled('div', {
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column'
});

const pulse = keyframes({
  '0%': {
    boxShadow: '0 0 0 0px rgba(84, 72, 91, 0.2)'
  },
  '100%': {
    boxShadow: '0 0 0 40px rgba(17, 3, 52, 0)'
  }
});

const LoadingLogo = styled('div', {
  width: '200px',
  borderRadius: '50%',
  animation: `${pulse()} 1.5s infinite`
});

export default { PageWrapper, LoadingLogo };
