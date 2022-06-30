<template>
  <div>
    <ul class="flex justify-start mx-[25%] p-0 list-none font-bold">
      <li
        class="flex float-left h-5 w-auto items-center"
        v-for="(breadcrumb, idx) in breadcrumbList"
        :key="idx"
        @click="routeTo(idx)"
        :class="{'active-link': breadcrumb.link}"
      >
        {{ breadcrumb.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Breadcrumbs',
  data() {
    return {
      breadcrumbList: [] as any[]
    }
  },
  mounted() { 
    this.updateList();
  },
  watch: { 
    '$route'() { 
      this.updateList();
    } 
  },
  methods: {
    routeTo(idx : number) {
      if (this.breadcrumbList[idx].link) {
        this.$router.push(this.breadcrumbList[idx].link);
      }
    },
    updateList() { 
      this.breadcrumbList = this.$route.meta.breadcrumb;
    }
  }
}
</script>

<style scoped lang="scss">
  ul > li:not(:last-child)::after {
    content: '/';
    margin: 0 .5em;
  }

  .active-link {
    cursor: pointer;
    font-size: 1em;
    font-weight: normal;
  }
</style>