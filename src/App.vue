<script setup>
import { RouterView, useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const goTo = (path) => {
  if (route.path !== path) {
    router.push(path);
  } else {
    console.log('已在當前路徑，無須前往');
  }
};
</script>

<template>
  <div class="d-flex">
    <!-- 側欄 -->
    <div class="bg-light border-right" id="sidebar-wrapper">
      <div class="sidebar-heading">
    <img src="@/assets/logo.png" alt="Logo" class="img-fluid" @click="goTo('/')" />
    </div>
      <div class="list-group list-group-flush">
        <button class="btn btn-light w-100 text-start" data-bs-toggle="collapse" href="#collapseExample1" role="button" aria-expanded="false" aria-controls="collapseExample1">
          基本資料維護↓
        </button>
        <div class="collapse" id="collapseExample1">
          <button class="btn btn-light w-100 text-start custom-color" @click="() => goTo('/basic-info/customer')">客戶資料維護</button>
          <button class="btn btn-light w-100 text-start custom-color" @click="() => goTo('/basic-info/contact')">聯絡人資料維護</button>
          <button class="btn btn-light w-100 text-start custom-color" @click="() => goTo('/basic-info/bill')">帳單資料維護</button>
          <button class="btn btn-light w-100 text-start custom-color" @click="() => goTo('/basic-info/vehicle')">車籍資料維護</button>
          <button class="btn btn-light w-100 text-start custom-color" @click="() => goTo('/basic-info/communication-records')">通訊紀錄維護</button>
          <button class="btn btn-light w-100 text-start custom-color" @click="() => goTo('/basic-info/salesperson')">業務員資料維護</button>
          <button class="btn btn-light w-100 text-start custom-color" @click="() => goTo('/basic-info/supplier')">供應商資料維護</button>
        </div>
        <button class="btn btn-light w-100 text-start" @click="() => goTo('/basic-info/FinanceManagement')">帳務管理</button>
        <button class="btn btn-light w-100 text-start" @click="() => goTo('/basic-info/SalesControl')">銷售管理</button>
        <button class="btn btn-light w-100 text-start" @click="() => goTo('/basic-info/ReportManagement')">報表</button>
        <button class="btn btn-light w-100 text-start" @click="() => goTo('/basic-info/AccessControl')">權限管理</button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="container-fluid">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
#sidebar-wrapper {
  width: 250px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  overflow-y: auto;
}

.sidebar-heading img {
  cursor: pointer; 
}

.container-fluid {
  margin-left: 250px;
  padding-top: 20px;
}

.sidebar-heading {
  padding: 10px;
  text-align: center;
}

.img-fluid {
  max-width: 80%;
  height: auto;
}

.btn {
  margin-bottom: 5px;
}

.custom-color {
  background-color: #faca2a; 
}
.custom-color:hover {
  background-color: #be4e04; 
}

</style>
