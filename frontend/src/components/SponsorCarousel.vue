<template>
  <div class='relative overflow-hidden grow-0 shrink-0 basis-[230px]'>
    <div class='carousel-bar-left' />
    <div class='relative w-[1450px] h-[100px] my-10 grow-0 shrink-0 basis-auto'>
      <div class='sponsor-container carousel-animation-first'>
        <div class='grow-1 shrink-1 basis-[200px] min-w-0 m-5'>
          <img
            class='select-none pointer-events-none object-contain w-full'
            :src='GoogleLogo'
            loading='lazy'
            alt='sponsor logo'
          >
        </div>
        <div class='grow-1 shrink-1 basis-[200px] min-w-0 m-5'>
          <img
            class='select-none pointer-events-none object-contain w-full'
            :src='AmazonLogo'
            loading='lazy'
            alt='sponsor logo'
          >
        </div>
        <div class='grow-1 shrink-1 basis-[200px] min-w-0 m-5'>
          <img
            class='select-none pointer-events-none object-contain w-full'
            :src='MicrosoftLogo'
            loading='lazy'
            alt='sponsor logo'
          >
        </div>
        <div class='grow-1 shrink-1 basis-[200px] min-w-0 m-5'>
          <img
            class='select-none pointer-events-none object-contain w-full'
            :src='CanvaLogo'
            loading='lazy'
            alt='sponsor logo'
          >
        </div>
        <div class='grow-1 shrink-1 basis-[200px] min-w-0 m-5'>
          <img
            class='select-none pointer-events-none object-contain w-full'
            :src='JaneStreetLogo'
            loading='lazy'
            alt='sponsor logo'
          >
        </div>
        <div class='grow-1 shrink-1 basis-[200px] min-w-0 m-5'>
          <img
            class='select-none pointer-events-none object-contain w-full'
            :src='AtlassianLogo'
            loading='lazy'
            alt='sponsor logo'
          >
        </div>
      </div>
      <div class='sponsor-container carousel-animation-second'>
        <div class='grow-1 shrink-1 basis-[200px] min-w-0 m-5'>
          <img
            class='select-none pointer-events-none object-contain w-full'
            :src='GoogleLogo'
            loading='lazy'
            alt='sponsor logo'
          >
        </div>
        <div class='grow-1 shrink-1 basis-[200px] min-w-0 m-5'>
          <img
            class='select-none pointer-events-none object-contain w-full'
            :src='AmazonLogo'
            loading='lazy'
            alt='sponsor logo'
          >
        </div>
        <div class='grow-1 shrink-1 basis-[200px] min-w-0 m-5'>
          <img
            class='select-none pointer-events-none object-contain w-full'
            :src='MicrosoftLogo'
            loading='lazy'
            alt='sponsor logo'
          >
        </div>
        <div class='grow-1 shrink-1 basis-[200px] min-w-0 m-5'>
          <img
            class='select-none pointer-events-none object-contain w-full'
            :src='CanvaLogo'
            loading='lazy'
            alt='sponsor logo'
          >
        </div>
        <div class='grow-1 shrink-1 basis-[200px] min-w-0 m-5'>
          <img
            class='select-none pointer-events-none object-contain w-full'
            :src='JaneStreetLogo'
            loading='lazy'
            alt='sponsor logo'
          >
        </div>
        <div class='grow-1 shrink-1 basis-[200px] min-w-0 m-5'>
          <img
            class='select-none pointer-events-none object-contain w-full'
            :src='AtlassianLogo'
            loading='lazy'
            alt='sponsor logo'
          >
        </div>
      </div>
    </div>
    <div class='carousel-bar-right' />
  </div>
</template>

<script setup lang="ts">
import GoogleLogo from '@/assets/companies/googleLogo.png';
import AmazonLogo from '@/assets/companies/amazonLogo.png';
import MicrosoftLogo from '@/assets/companies/microsoftLogo.svg';
import CanvaLogo from '@/assets/companies/canvaLogo.png';
import JaneStreetLogo from '@/assets/companies/janeStreetLogo.png';
import AtlassianLogo from '@/assets/companies/atlassianLogo.png';
</script>

<style scoped lang="scss">
// ticker tape carousel
@keyframes carousel-right-container {
  0% {
    transform: translate3d(0, 0, 0);
    visibility: visible;
  }

  100% {
    transform: translate3d(-100%, 0, 0);
  }
}

@keyframes carousel-left-container {
  0% {
    transform: translate3d(0, 0, 0);
    visibility: visible;
  }

  100% {
    transform: translate3d(-100%, 0, 0);
  }
}

.carousel-animation-second {
  animation-name: carousel-right-container;
  left: 100%;
}

.carousel-animation-first {
  animation-name: carousel-left-container;
}

.sponsor-container {
  display: flex;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  animation-duration: 20s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.carousel-bar-left {
  left: 0;
  top: 0;
  background-image: linear-gradient(
    to right,
    #f6f9fc 30%,
    rgba(255, 255, 255, 0)
  );
  height: 100%;
  width: 2.5rem;
  position: absolute;
  z-index: 1;
}

.carousel-bar-right {
  right: 0;
  top: 0;
  background-image: linear-gradient(
    to left,
    #f6f9fc 30%,
    rgba(255, 255, 255, 0)
  );
  height: 100%;
  width: 2.5rem;
  position: absolute;
  z-index: 1;
}
</style>
