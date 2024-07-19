<template>
    <footer class="footer">
      <div class="left">2024雲研科技</div>
      <div class="right">Version 1.0.0</div>
    </footer>
  </template>
  
  <script>
  export default {
    name: "Footer",
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
  