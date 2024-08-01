<template>
  <ListBar/>
  <h1>{{ text }}</h1>
</template>

<script>
import ListBar from '@/components/ListBar.vue'
export default {
  components: {
    ListBar
  },
  data() {
    return {
      text: "首頁",
    };
  },
};
</script>
