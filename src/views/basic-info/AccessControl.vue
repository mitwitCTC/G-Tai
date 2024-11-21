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
        <el-input v-model="idOrCompanyNumber" placeholder="請輸入身分證或統編" maxlength=10></el-input>
      </el-form-item>
    </el-form>
  </div>
  <div class="section-header">
    <h5>每月對帳單及發票寄送方式</h5>
    <!-- 單選 -->
    <el-form-item>
        <el-radio-group v-model="selectedOption"@change="handleOptionChange">
            <el-radio label="LINE" value="2">LINE</el-radio>
            <el-radio label="EMAIL"value="3">EMAIL</el-radio>
        </el-radio-group>
    </el-form-item>
    <!-- Email 輸入框 -->
    <el-form label-width="80px">
        <el-form-item label="Email" v-if="selectedOption === '3'">
            <el-input v-model="email" placeholder="請輸入 Email"></el-input>
        </el-form-item>
    </el-form>
</div>

<div class="section-header">
    <h5>預付款不足餘額通知</h5>
    <!-- 單選 -->
    <el-form-item>
        <el-radio-group v-model="selectedOption2" @change="handleOptionChange2">
            <el-radio label="手機號碼" value="1">手機號碼</el-radio>
            <el-radio label="LINE" value="2">LINE</el-radio>
            <el-radio label="EMAIL"value="3">EMAIL</el-radio>
        </el-radio-group>
    </el-form-item>
    <el-form label-width="80px">
        <!-- 手機 輸入框 -->
        <el-form-item label="手機號碼" v-if="selectedOption2 === '1'">
            <el-input v-model="phone" placeholder="請輸入手機號碼"></el-input>
        </el-form-item>
        <!-- Email 輸入框 -->
        <el-form-item label="Email" v-if="selectedOption2 === '3'">
            <el-input v-model="email2" placeholder="請輸入 Email"></el-input>
        </el-form-item>
    </el-form>
</div>

  <div class="button-container">
    <el-button type="primary" @click="save">送出</el-button>
  </div>
  <el-dialog v-model="isLoading"  title="請稍後..." :close-on-click-modal="false"/>
</div>

</template>

<script>
import axios from 'axios';
export default {

data() {
  return {
    isLoading:false,
    selectedOption: '',
    selectedOption2: '',
    idOrCompanyNumber: '', // 身分證或統編
    email: '',
    email2: '',
    phone: '',
  };
},
methods: {
  handleOptionChange() {
      if (this.selectedOption !== '3') {
        this.email = ''; // 清空 Email
      }
    },
  handleOptionChange2() {
      if (this.selectedOption2 !== '1') {
        this.phone = ''; // 清空手機號碼
      } 
     if (this.selectedOption2 !== '3') {
        this.email2 = ''; // 清空 Email
      }  
    },
    async save(){
    if(!this.idOrCompanyNumber||!this.selectedOption2||!this.selectedOption){
      this.$message({
              message: '欄位不可為空',
              type: 'error'
            });
        return
    }
    if(this.selectedOption=='3'&&  (!this.email || this.email.trim() === '')){
      this.$message({
              message: '欄位不可為空',
              type: 'error'
            });
        return
    }
    if(this.selectedOption2=='3'&&  (!this.email2 || this.email2.trim() === '')){
      this.$message({
              message: '欄位不可為空',
              type: 'error'
            });
        return
    }
    if(this.selectedOption2=='1'&&  (!this.phone || this.phone.trim() === '')){
      this.$message({
              message: '欄位不可為空',
              type: 'error'
            });
        return
    }
    this.isLoading=true;
    const params = new URLSearchParams(window.location.search);
    // 取得 userId 值
    const userId = params.get("userId");

    const req={
      "memberLineId":userId,
      "vat_number":this.idOrCompanyNumber,
      "billNotify":this.selectedOption,
      "billMail":this.email,
      "messageNotify":this.selectedOption2,
      "mobile":this.phone,
      "messageMail":this.email2
    }
    console.log(JSON.stringify(req))
    await axios.post('http://122.116.23.30:3347/link/linkLine',req)
        .then(response => {
          if (response.status === 200 && response.data.returnCode === 0) {
            // 成功提示
            this.$message({
              message: '綁定成功',
              type: 'success'
            });
          }else if(response.status === 200 && response.data.returnCode === -1){
             // 成功提示
             this.$message({
              message: '此帳號已綁定兩人,如有問題,請聯絡客服',
              type: 'error'
            });
          }
          this.isLoading=false;
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
          this.isLoading=false;
          this.$message({
              message: '綁定失敗',
              type: 'error'
            });
        });
     
    },
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