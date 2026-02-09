<template>
  
   <div v-if="isLogin" class="login-container">
    <RouterView />
  </div>

  <div v-if="!isAccessControlPage && !isLogin" class="container-fluid"  :class="{ 'sidebar-collapsed': !sidebarOpen }">
    <ListBar  @toggle-sidebar="sidebarOpen = $event" v-if="sidebarOpen"/>
    <button @click="sidebarOpen=true" v-if="sidebarOpen==false" class="intor">展開選單▶</button>
    <!-- <div>sidebarOpen: {{ sidebarOpen }}</div> -->
    <div class="non-desktop-message">只支援解析度1024px電腦瀏覽</div>
    <div class="content">
      <RouterView />
      
    </div>
    <TheFooter class="footer"></TheFooter>
  </div>
  

  <div v-if="isAccessControlPage">
    <RouterView />
  </div>

</template>


<script>
import TheFooter from '@/components/TheFooter.vue'
import ListBar from "@/components/ListBar.vue";
export default {
  components: {
    TheFooter,ListBar
  },
  data() {
    return {
      text: "首頁 ",
      sidebarOpen: true,
    };
  },
  computed: {
    // 檢查當前路由是否為 /AccessControl
    isAccessControlPage() {
      return this.$route.path === '/basic-info/AccessControl' ;
    },
    isLogin() {
      return this.$route.path === '/login' ;
    }
  }
};
</script>

<style scoped>
  .intor{
    margin-bottom:10px;
  }
   
  .container-fluid.sidebar-collapsed {
  margin-left: 50px;

}
.login-container {
  display: flex;
  justify-content: center;  /* 水平置中 */
  align-items: center;      /* 垂直置中 */
  height: 100vh;           /* 讓畫面高度等於視窗高度 */
  width: 100vw;            /* 讓畫面寬度等於視窗寬度 */
}

.login-content {
  width: 100%;             /* 讓內容區塊也置中 */
  max-width: 400px;        /* 設定最大寬度，避免過寬 */
  text-align: center;      /* 讓內部文字或 inline-block 元素置中 */
}
.container-fluid {
  margin-left: 200px;
  padding-top: 20px;
  max-width: 1600px; 
  position: relative; /* 为了 footer 能够固定在页面底部 */
}
.footer {
  position: absolute; /*绝对定位，让 footer 固定在容器底部*/
  bottom: 0; /* 距离容器底部 0 像素 */
  left: 0; /* 距离容器左侧 0 像素 */
  width: 1600px; /* 与 .container-fluid 宽度一致 */
  background-color: #f8f9fa; /* 可以设置背景颜色 */
  padding: 10px; /* 内边距 */
  margin-top: 50px;
  margin-left: 50px;
}

/* 默认隐藏非桌面设备消息 */
.non-desktop-message {
  display: none;
  text-align: center;
  font-size: 24px;
  color: red;
  position: fixed; /* 固定在螢幕上 */
  top: 50%; /* 垂直居中 */
  left: 50%; /* 水平居中 */
  transform: translate(-50%, -50%); /* 完全居中對齊 */
  background-color: rgba(255, 255, 255, 0.8); /* 可選：增加背景顏色以提高可讀性 */
  padding: 20px; /* 可選：增加內邊距 */
  border-radius: 8px; /* 可選：增加圓角邊框 */
}

/* 对非桌面设备显示消息，隐藏内容 */
@media (max-width: 950px) {
  .non-desktop-message {
    display: block;
  }
  .content {
    display: none;
  }
}
</style>
