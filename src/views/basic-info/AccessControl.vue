<template>
  <bar/>
  <div class="page-title"><h2>{{ pageTitle }}</h2></div>
</template>

<script>
import bar from '@/components/bar.vue'
export default {
components: {
  bar
},
data() {
  return {
  };
},
};
</script>

<style scoped>
.page-title {
  margin-top: 30px; 
  margin-bottom: 30px; 
  }
</style>