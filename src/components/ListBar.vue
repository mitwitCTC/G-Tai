<template>
  <!-- 側欄 -->
  <div class="sidebar">
  </div>
  <div class="bg-light border-right" id="sidebar-wrapper" >
    <button @click="toggleSidebar" >隱藏選單◀</button>
    <div class="sidebar-heading">
      <img
        src="@/assets/logo.png"
        alt="Logo"
        class="img-fluid"
        @click="goTo('/')"
      />
    </div>
    <!-- <div
      class="list-group list-group-flush"
      v-for="item in menuItems"
      :key="item.path"
    >
      <button
        class="btn btn-light w-100 text-start trade-color"
        @click="() => goTo(item.path, item.name)"
      >
        {{ item.label }}
      </button>
    </div> -->
    <div class="list-group list-group-flush" >
      <button class="btn btn-light w-100 text-start" @click="toggleBasicInfoCollapse">
        {{ isBasicInfoCollapsed ? "基本資料維護⭢" : "基本資料維護↓" }}
      </button>
      <div class="collapse" :class="{ show: !isBasicInfoCollapsed }" id="collapseExample4" v-for="item in toggleBasicInfoCollapseList" :key="item.path">
        <button
        class="btn btn-light w-100 text-start custom-color"
        @click="() => goTo(item.path, item.name)"
      >
        {{ item.label }}
      </button>
      </div>
      <button class="btn btn-light w-100 text-start" @click="toggleData">
        {{ isData ? "大批管理客戶資料⭢" : "大批管理客戶資料⭢" }}
      </button>
      <div class="collapse" :class="{ show: !isData }" id="collapseExample4" v-for="item in toggleDataList" :key="item.path">
        <button
        class="btn btn-light w-100 text-start Data-color"
        @click="() => goTo(item.path, item.name)"
      >
        {{ item.label }}
      </button>
      </div>
      <button class="btn btn-light w-100 text-start" @click="toggleBasicInfoCollapseTrade">
        {{ isBasicInfoCollapsedTrade ? "帳務管理⭢" : "帳務管理↓" }}
      </button>
      <div
        class="collapse"
        :class="{ show: !isBasicInfoCollapsedTrade }"
        id="collapseExample2"
      >
        <button
          class="btn btn-light w-100 text-start trade-color"
          @click="toggleBasicInfoCollapseBank"
        >
          {{ isBasicInfoCollapsedBank ? "銀行⭢" : "銀行↓" }}
        </button>
        <div
          class="collapse"
          :class="{ show: !isBasicInfoCollapsedBank }"
          id="collapseExample3"
          v-for="item in bankList" :key="item.path"
        >
        <button
        class="btn btn-light w-100 text-start trade-color"
        @click="() => goTo(item.path, item.name)"
      >
        {{ item.label }}
      </button>
        </div>
        </div>
      <div class="collapse" :class="{ show: !isBasicInfoCollapsedTrade }" id="collapseExample2" v-for="item in toggleBasicInfoCollapseTradeList" :key="item.path">
        <button
        class="btn btn-light w-100 text-start bank-color"
        @click="() => goTo(item.path, item.name)"
      >
        {{ item.label }}
      </button>
      </div>
      <button class="btn btn-light w-100 text-start" @click="Accounting">
        {{ isAccounting ? "會計系統⭢" : "會計系統⭢" }}
      </button>
      <div class="collapse" :class="{ show: !isAccounting }" id="collapseExample5" v-for="item in AccountingList" :key="item.path">
        <button
        class="btn btn-light w-100 text-start Acc-color"
        @click="() => goTo(item.path, item.name)"
      >
        {{ item.label }}
      </button>
      </div>
    <button class="btn btn-light w-100 text-start" @click="setData">
        {{ isset ? "系統設定⭢" : "系統設定⭢" }}
      </button>
      <div class="collapse" :class="{ show: !isset }" id="collapseExample4" v-for="item in setDataList" :key="item.path">
        <button
        class="btn btn-light w-100 text-start set-color"
        @click="() => goTo(item.path, item.name)"
      >
        {{ item.label }}
      </button>
      </div>
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
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Cookies from "js-cookie";
import axios from "axios";
import { ElMessage } from "element-plus";
const router = useRouter();
const route = useRoute();

const userName = ref("登入者："); // 替換為實際的登入者名稱
const ALLName = ref(); // 替換為實際的登入者名稱

const isBasicInfoCollapsed = ref(true);
const isBasicInfoCollapsedTrade = ref(true);
const isBasicInfoCollapsedBank = ref(true);
const isData = ref(true);
const isset = ref(true);
const isAccounting = ref(true);
const emit = defineEmits(["toggle-sidebar"]);

const toggleSidebar = () => {
  emit("toggle-sidebar", false); // 或 true / 切換用 !xxx
};
const toggleBasicInfoCollapseList = ref([]);// 基本資料維護
const toggleDataList  = ref([]);// 大批管理客戶資料
const bankList= ref([]);// 銀行管理 (帳務管理子項)
const toggleBasicInfoCollapseTradeList = ref([]);// 帳務管理
const AccountingList = ref([]);// 會計系統
const setDataList= ref([]);// 系統設定

// const toggleBasicInfoCollapseList = [
//   { label: "客戶資料維護", path: "/basic-info/customer", name: "李柏青"  },
//   { label: "員工資料維護", path: "/basic-info/salesperson" , name: "李柏青" },
//   { label: "切換客代帳號", path: "/basic-info/modifybill", name: "李柏青"  },
//   { label: "更改客戶折讓", path: "/basic-info/discountrecords", name: "李柏青"  },
//   { label: "通知客戶管理", path: "/basic-info/SalesControl", name: "李柏青"  },
//   { label: "中油鎖卡/解卡處理", path: "/basic-info/ReportManagement" , name: "李柏青" },
//   { label: "報表匯出", path: "/basic-info/export_data" , name: "李柏青" }
// ];

// //大批管理客戶資料
// const toggleDataList = [
//   { label: "匯出車藉中油檔", path: "/basic-info/Export", name: "李柏青"  },
//   { label: "匯入車藉中油檔", path: "/basic-info/Import", name: "李柏青"  },
//   { label: "大批新增車籍", path: "/basic-info/ImportVehicle", name: "李柏青"  },
//   { label: "大批停用車籍", path: "/basic-info/ImportVehicle_del" , name: "李柏青" }
// ];

// //銀行管理 (帳務管理子項)
// const bankList = [
//   { label: "匯款/支票", path: "/basic-info/TBB_View", name: "李柏青"  },
//   { label: "刷卡帳務", path: "/basic-info/BANKSINOPAC_View", name: "李柏青"  }
// ];

// //帳務管理
// const toggleBasicInfoCollapseTradeList = [
//   { label: "未核銷帳務", path: "/basic-info/CustomerAccounts", name: "李柏青"  },
//   { label: "中油交易", path: "/basic-info/cpctrade" , name: "李柏青" },
//   { label: "開立發票查詢", path: "/basic-info/definvoice" , name: 14 },
//   { label: "總表&明細列印", path: "/basic-info/supplier" , name: "李柏青" },
//   { label: "月底核帳", path: "/basic-info/monthaccount", name: "李柏青" }, // 範例：有權限限制
//   { label: "特殊發票處理", path: "/basic-info/SpecialInvoice" , name: "李柏青" },
//   { label: "確認寄送帳單名單", path: "/basic-info/billsend" , name: "李柏青" }
// ];

// // 會計系統
// const AccountingList = [
//   { label: "會計傳票", path: "/basic-info/FinanceManagement" , name: "李柏青" },
//   { label: "編輯會計科目", path: "/basic-info/Accedit" , name: "李柏青" }
// ];

// // 系統設定
// const setDataList = [
//   { label: "中油密碼更改", path: "/basic-info/cpcpwd", name: "李柏青"  }
// ];
const goTo = (path, id) => {
  // if (ALLName.value !== id) {
  //   ElMessage({ message: "您無權限造訪此頁面", type: "error" });
    
  //   return; // 停止後續執行
  // }
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
const setData = () => {
  isset.value = !isset.value;
};
const Accounting = () => {
  isAccounting.value = !isAccounting.value;
};

const logout = () => {
  // 清除 Cookie 或其他登出邏輯
  Cookies.remove("login");
  router.push("/login");
};

 onMounted(async() => {
  const login = Cookies.get("login");
  const parsedLogin = JSON.parse(login); // 解析 JSON
  if (login) {
    if (parsedLogin) {
      userName.value = `登入者：${parsedLogin.employee_name}`; // 設定登入者名稱
      ALLName.value = `${parsedLogin.salesmanId}`;
    }
  }
  try {
        // 發送 GET 請求到指定的 API
        const postdata={
          salesmanId:ALLName.value
        }
        // const response = await axios.post(
        //   "http://127.0.0.1:3347/main/getvueform",postdata
        // );
        const response = await axios.post(
          "/apiServer/main/getvueform",postdata
        );
        toggleBasicInfoCollapseList.value.push(...response.data.toggleBasicInfoCollapseList)
        toggleDataList.value.push(...response.data.toggleDataList)
        bankList.value.push(...response.data.bankList)
        toggleBasicInfoCollapseTradeList.value.push(...response.data.toggleBasicInfoCollapseTradeList)
        AccountingList.value.push(...response.data.AccountingList)
        setDataList.value.push(...response.data.setDataList)
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
});
</script>

<style scoped>
#sidebar-wrapper {
  width: 200px;
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
.set-color {
  background-color: #8c5bff;
}
.set-color:hover {
  background-color: #824caf;
}
.Acc-color {
  background-color: #ee3e3e;
}
.Acc-color:hover {
  background-color: #b10505;
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
