<template>
  <bar/>
  <div class="page-title"><h2>{{ pageTitle }}</h2></div>
  <div>
    <Breadcrumb :isSpecialPage="true"/>
  </div>
</template>

<script>
import bar from '@/components/bar.vue'
import Breadcrumb from '@/components/Breadcrumb.vue';
export default {
  components: {
    Breadcrumb,
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