<template>
    <div class="breadcrumb-container">
      <h6 v-if="isSpecialPage">基本資料維護 ⮕ {{ pageTitle }}</h6>
      <h6 v-else>{{ pageTitle }}</h6>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BreadCrumb',
    props: {
      isSpecialPage: {
        type: Boolean,
      }
    },
  };
  </script>
  
  <style scoped>
  .breadcrumb-container {
    margin: 16px 0;
  }
  h6 {
    color: gray; /* 文字颜色设置为灰色 */
  }
  </style>
  