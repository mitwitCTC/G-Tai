<template>
  <bar/>
  <h1>{{ text }}</h1>
</template>

<script>
import bar from '@/components/bar.vue'
export default {
  components: {
    bar
  },
  data() {
    return {
      text: "首頁",
    };
  },
};
</script>
