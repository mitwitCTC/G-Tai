<template>
    <div class="breadcrumb-container">
      <h6 v-if="isSpecialPage">基本資料維護 ⮕ {{ pageTitle }}</h6>
      <h6 v-else-if="isLinkPage">基本資料維護 ⮕ 客戶資料維護 ⮕{{ pageTitle }}</h6>
      <h6 v-else-if="isVehiclePage">基本資料維護 ⮕ 客戶資料維護 ⮕ 帳單維護資料 ⮕{{ pageTitle }}</h6>
      <h6 v-else-if="isAccountsPage">帳務管理 ⮕{{ pageTitle }}</h6>
      <h6 v-else-if="isBankPage">帳務管理 ⮕ 銀行 ⮕{{ pageTitle }}</h6>
      <h6 v-else>{{ pageTitle }}</h6>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BreadCrumb',
    props: {
      isSpecialPage: {
        type: Boolean,
      },
      isLinkPage: {
        type: Boolean,
      },
    },
    data() {
    return {
        isSpecialPage: false,
        isLinkPage: false,
        isVehiclePage:false,
        isAccountsPage:false,
        isBankPage:false
      };
    }, 
    mounted() {
      this.isSpecialPage = this.$route.meta.isSpecialPage || false;
      this.isLinkPage = this.$route.meta.isLinkPage || false;
      this.isVehiclePage = this.$route.meta.isVehiclePage || false;
      this.isAccountsPage = this.$route.meta.isAccountsPage || false;
      this.isBankPage = this.$route.meta.isBankPage || false;
    }
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
  