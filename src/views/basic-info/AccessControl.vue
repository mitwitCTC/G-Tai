<template>
   <div class="access-control-page">
 <div class="heading">
    <img src="@/assets/logo.png" alt="Logo" class="logo-image" />
</div>
<div class="section-header">
    <el-form  label-width="100px">
      <!-- 身分證或統編輸入框 -->
      <h5>請輸入簽約公司資訊</h5>
      <el-form-item label="身分證 / 統編">
        <el-input v-model="idOrCompanyNumber" placeholder="請輸入身分證或統編" maxlength=9></el-input>
      </el-form-item>
    </el-form>
  </div>
  <div class="section-header">
    <h5>每月對帳單及發票寄送方式</h5>
    <!-- 單選 -->
    <el-form-item>
        <el-radio-group v-model="selectedOption" @change="handleRadioChange">
            <el-radio label="LINE">LINE</el-radio>
            <el-radio label="EMAIL">EMAIL</el-radio>
        </el-radio-group>
    </el-form-item>
    <!-- Email 輸入框 -->
    <el-form label-width="80px">
        <el-form-item label="Email" v-if="selectedOption === 'EMAIL'">
            <el-input v-model="email" placeholder="請輸入 Email"></el-input>
        </el-form-item>
    </el-form>
</div>

<div class="section-header">
    <h5>預付款不足餘額通知</h5>
    <!-- 單選 -->
    <el-form-item>
        <el-radio-group v-model="selectedOption2" @change="handleRadioChange2">
            <el-radio label="手機號碼">手機號碼</el-radio>
            <el-radio label="LINE">LINE</el-radio>
            <el-radio label="EMAIL">EMAIL</el-radio>
        </el-radio-group>
    </el-form-item>
    <el-form label-width="80px">
        <!-- 手機 輸入框 -->
        <el-form-item label="手機號碼" v-if="selectedOption2 === '手機號碼'">
            <el-input v-model="phone" placeholder="請輸入手機號碼"></el-input>
        </el-form-item>
        <!-- Email 輸入框 -->
        <el-form-item label="Email" v-if="selectedOption2 === 'EMAIL'">
            <el-input v-model="email2" placeholder="請輸入 Email"></el-input>
        </el-form-item>
    </el-form>
</div>

  <div class="button-container">
    <el-button type="primary" @click="save">送出</el-button>
  </div>
</div>

</template>

<script>

export default {

data() {
  return {
    selectedOption: '',
    selectedOption2: '',
    idOrCompanyNumber: '', // 身分證或統編
    email: '',
    email2: '',
    phone: '',
  };
},
methods: {
   
  },
mounted() {
    // 為 #app 添加 access-control-page 的 class
    document.getElementById("app").classList.add("access-control-page");
  },
  beforeDestroy() {
    // 移除該 class，避免影響其他頁面
    document.getElementById("app").classList.remove("access-control-page");
  },
};
</script>

<style scoped>
.heading {
  display: flex;
  justify-content: center; /* 水平置中 */
  align-items: center;    /* 垂直置中，如果 heading 高度固定 */
}
.heading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* 可以調整為固定高度或100vh根據需要 */
}

.logo-image {
  max-width: 200px; /* 設定圖片最大寬度 */
  max-height: 100px; /* 設定圖片最大高度 */
  width: auto; /* 保持圖片比例 */
  height: auto;
}
.section-header {
  margin-top: 20px;
  font-weight: bold;
  background-color: #f0ecec; /* 浅灰色背景 */
  border-radius: 10px; /* 圆角 */
  padding: 10px; /* 内边距 */
  margin-bottom: 10px; /* 项目之间的间距 */
  width: 100%; /* 設置固定寬度，這裡以80%為例 */
  max-width: 700px; /* 可選：設置最大寬度 */
  margin-left: auto;
  margin-right: auto; /* 使其水平居中 */
  text-align: center; /* 使所有子元素（水平方向）居中 */
}
.button-container {
  display: flex;
  justify-content: center; /* 水平置中 */
  height: 100vh; /* 讓容器高度占滿視窗，以便垂直居中 */
}
</style>