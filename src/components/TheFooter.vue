<template>
    <footer class="footer">
      <div class="left">{{ currentYear }} 雲研科技</div>
      <div class="right">Version 1.0.0</div>
    </footer>
  </template>
  
  <script>
  export default {
  name: 'TheFooter',
  data() {
    return {
      // 計算當前年份
      currentYear: new Date().getFullYear()
    };
  }
};
  </script>
  
  <style scoped>
  .footer {
    display: flex;
    justify-content: space-between;
    background-color: #f8f9fa;
    margin-top: 50px;
  }
  .left {
    text-align: left;
  }
  .right {
    text-align: right;
  }
  </style>
  