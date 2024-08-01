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
    padding: 10px 20px;
    background-color: #f8f9fa;
    border-top: 1px solid #e9ecef;
  }
  .left {
    text-align: left;
  }
  .right {
    text-align: right;
  }
  </style>
  