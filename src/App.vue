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
      text: "首頁",
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
  position: absolute; /* 绝对定位，让 footer 固定在容器底部 */
  bottom: 0; /* 距离容器底部 0 像素 */
  left: 0; /* 距离容器左侧 0 像素 */
  width: 1600px; /* 与 .container-fluid 宽度一致 */
  background-color: #f8f9fa; /* 可以设置背景颜色 */
  padding: 10px; /* 内边距 */
}

/* 默认隐藏非桌面设备消息 */
.non-desktop-message {
  display: none;
  text-align: center;
  font-size: 24px;
  color: red;
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
