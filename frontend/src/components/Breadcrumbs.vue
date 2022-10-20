<template>
  <ul class='flex justify-start ml-[28%] mt-10 mb-4 p-0 list-none font-bold'>
    <li
      v-for='(breadcrumb, idx) in breadcrumbList'
      :key='idx'
      class='flex float-left h-5 w-auto items-center'
      :class='{ "text-jb-placeholder font-bold cursor-pointer text-base duration-200 ease-linear hover:text-jb-textlink-hovered": breadcrumb.link }'
      @click='routeTo(idx)'
    >
      <font-awesome-icon
        v-if='breadcrumb.name === "Home"'
        icon='house'
        size='xs'
      />
      <p
        v-else
        :class='{ "text-jb-headings text-base font-bold": !breadcrumb.link,
                  "text-jb-placeholder font-bold cursor-pointer text-base duration-200 ease-linear hover:text-jb-textlink-hovered ": breadcrumb.link }'
      >
        {{ breadcrumb.name }}
      </p>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const breadcrumbList = ref();

onMounted(() => {
  updateList();
});

watch(route, () => {
  updateList();
});

const routeTo = (idx: number) => {
  if (breadcrumbList.value[idx].link) {
    router.push(breadcrumbList.value[idx].link);
  }
};

const updateList = () => {
  breadcrumbList.value = route.meta.breadcrumb;
};
</script>

<style scoped lang="scss">
  li:not(:last-child)::after {
    content: '/';
    margin: 0 .5em;
    color: black;
    font-weight: bold;
  }
</style>
