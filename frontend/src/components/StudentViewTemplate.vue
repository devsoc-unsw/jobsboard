<template>
  <div class='viewport'>
    <div class='stretchyPage'>
      <Header />
      <div class='content'>
        <div class='contentWidth'>
          <slot />
        </div>
      </div>
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { useApiTokenStore } from '@/store/apiToken';

const router = useRouter();
const apiTokenStore = useApiTokenStore();

const props = defineProps({
  notLoggedIn: {
    type: Boolean,
    default: false,
  },
});

onMounted(async () => {
  if (props.notLoggedIn === true) {
    return;
  } else if (apiTokenStore.getApiToken() === undefined) {
    router.push('/');
  }
});
</script>

<style lang="scss">
.content {
  background: #f6f9fc;
  color: $black;
  min-height: 100%;
  flex: 1 1 auto;
  padding: 2rem 0 0 0;
}

.contentWidth {
  width: 100%;
  margin: auto;
}

.stretchyPage {
  display: flex;
  flex-flow: column;
  min-height: 100vh;
  position: relative;
  padding-bottom: 18rem;
}

.navButtons {
  color: $white;
  padding: 0.5rem;
}

.footer {
  margin-top: 40px;
  float: below;
}

@media screen
and (min-width: 320px)
and (max-width: 768.98px) {
  .footer {
    margin-top: 100px;
  }
}

.footer {
  margin-top: 40px;
  float: below;
}

@media screen
and (min-width: 320px)
and (max-width: 768.98px) {
  .footer {
    margin-top: 100px;
  }
}
</style>
