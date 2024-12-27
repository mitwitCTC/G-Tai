<template>
  <!-- 側欄 -->
  <div class="bg-light border-right" id="sidebar-wrapper">
    <div class="sidebar-heading">
      <img src="@/assets/logo.png" alt="Logo" class="img-fluid" @click="goTo('/')" />
    </div>
    <div class="list-group list-group-flush">
      <button class="btn btn-light w-100 text-start" @click="toggleBasicInfoCollapse">
        {{ isBasicInfoCollapsed ? '基本資料維護⭢' : '基本資料維護↓' }}
      </button>
      <div class="collapse" :class="{ show: !isBasicInfoCollapsed }" id="collapseExample1">
        <button class="btn btn-light w-100 text-start custom-color" @click="() => goTo('/basic-info/customer')">客戶資料維護</button>
        <button class="btn btn-light w-100 text-start custom-color" @click="() => goTo('/basic-info/salesperson')">員工資料維護</button>
        <button class="btn btn-light w-100 text-start custom-color" @click="() => goTo('/basic-info/modifybill')">切換客代帳號</button>
        <button class="btn btn-light w-100 text-start custom-color" @click="() => goTo('/basic-info/discountrecords')">更改客戶折讓</button>
        <button class="btn btn-light w-100 text-start custom-color" @click="() => goTo('/basic-info/SalesControl')">通知客戶管理</button>
        <button class="btn btn-light w-100 text-start custom-color" @click="() => goTo('/basic-info/ReportManagement')">中油鎖卡/解卡處理</button>
      </div>
      <button class="btn btn-light w-100 text-start" @click="toggleData">
        {{ isData ? '大批管理客戶資料⭢' : '大批管理客戶資料⭢' }}
      </button>
      <div class="collapse" :class="{ show: !isData }" id="collapseExample4">
        <button class="btn btn-light w-100 text-start Data-color" @click="() => goTo('/basic-info/Export')">匯出車藉中油檔</button>
        <button class="btn btn-light w-100 text-start Data-color" @click="() => goTo('/basic-info/Import')">匯入車藉中油檔</button>
      </div>
      <button class="btn btn-light w-100 text-start" @click="toggleBasicInfoCollapseTrade">
        {{ isBasicInfoCollapsedTrade ? '帳務管理⭢' : '帳務管理↓' }}
      </button>
      <div class="collapse" :class="{ show: !isBasicInfoCollapsedTrade }" id="collapseExample2">
        <button class="btn btn-light w-100 text-start trade-color"  @click="toggleBasicInfoCollapseBank">
          {{ isBasicInfoCollapsedBank ? '銀行⭢' : '銀行↓' }}
        </button>
        <div class="collapse" :class="{ show: !isBasicInfoCollapsedBank }" id="collapseExample3">
          <button class="btn btn-light w-100 text-start bank-color" @click="() => goTo('/basic-info/TBB_View')">匯款/支票</button>
          <button class="btn btn-light w-100 text-start bank-color" @click="() => goTo('/basic-info/BANKSINOPAC_View')">刷卡帳務</button>
          </div>
        <button class="btn btn-light w-100 text-start trade-color" @click="() => goTo('/basic-info/CustomerAccounts')">未核銷帳務</button>
        <!-- <button class="btn btn-light w-100 text-start trade-color" @click="() => goTo('/basic-info/supplier')">結帳列印</button> -->
        <button class="btn btn-light w-100 text-start trade-color" @click="() => goTo('/basic-info/FinanceManagement')">會計傳票</button>
        <!-- <button class="btn btn-light w-100 text-start trade-color" @click="() => goTo('/basic-info/SpecialInvoice')">特殊發票處理</button> -->
      </div>
      
       <!-- <button class="btn btn-light w-100 text-start" @click="() => goTo('/basic-info/CardMake')">製卡明細</button>
      <button class="btn btn-light w-100 text-start" @click="() => goTo('/basic-info/AccessControl')">權限管理</button> -->
    </div>
    <div class="sidebar-TheFooter">
      <div class="divider"></div>
      <div class="user-info">
        <span>{{ userName }}</span>
      </div>
      <button @click="logout">登出</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const userName = ref('登入者：測試測試'); // 替換為實際的登入者名稱

const isBasicInfoCollapsed = ref(true);
const isBasicInfoCollapsedTrade = ref(true);
const isBasicInfoCollapsedBank = ref(true);
const isData = ref(true);

const goTo = (path) => {
  if (route.path !== path) {
    router.push(path);
  }
};

const toggleBasicInfoCollapse = () => {
  isBasicInfoCollapsed.value = !isBasicInfoCollapsed.value;
};
const toggleBasicInfoCollapseTrade = () => {
  isBasicInfoCollapsedTrade.value = !isBasicInfoCollapsedTrade.value;
};
const toggleBasicInfoCollapseBank = () => {
  isBasicInfoCollapsedBank.value = !isBasicInfoCollapsedBank.value;
};
const toggleData = () => {
  isData.value = !isData.value;
};

const logout = () => {
  // 登出邏輯，例如清除token，重定向到登入頁面等
  router.push('/login'); // 假設登出後重定向到登入頁面
};
</script>

<style scoped>
#sidebar-wrapper {
  width: 250px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  z-index: 1000; /* 確保側欄在最上層 */
}

.sidebar-heading img {
  cursor: pointer; 
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
.trade-color {
  background-color: #76fa2a; 
}
.trade-color:hover {
  background-color: #04b840; 
}
.bank-color {
  background-color: #1ad0fd; 
}
.bank-color:hover {
  background-color: #07a8f3; 
}
.Data-color {
  background-color: #ff5bf7; 
}
.Data-color:hover {
  background-color: #ff00f2; 
}
.sidebar-TheFooter {
  padding: 10px;
  text-align: center;
}

.user-info {
  margin-bottom: 10px;
}

.logout-btn {
  margin-bottom: 0;
}
.list-group {
  flex-grow: 1;
}
.sidebar-TheFooter .divider {
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px; /* 可以根据需要调整 */
}
</style>
