<template>
  <div class="container-fluid">
    <div class="non-desktop-message">只支援解析度1024px電腦瀏覽</div>
    <div class="content">
      <RouterView />
      <TheFooter class="footer">
      </TheFooter>
    </div>
  </div>
</template>

<script>
import TheFooter from '@/components/TheFooter.vue'
export default {
  components: {
    TheFooter
  },
  data() {
    return {
      text: "首頁 ",
    };
  },
};
</script>

<style scoped>
.container-fluid {
  margin-left: 250px;
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
@media (max-width: 1024px) {
  .non-desktop-message {
    display: block;
  }
  .content {
    display: none;
  }
}
</style>
