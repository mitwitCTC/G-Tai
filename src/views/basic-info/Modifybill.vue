<template>
  <ListBar/>
  <div class="page-title"><h2>{{ pageTitle }}</h2></div>
  <div>
      <BreadCrumb/>
      <div> 
      <el-form-item label="客戶代號">
          <!-- <el-input v-model="this.customerId" placeholder="輸入客戶代號" style="width: 225px; margin-right:20px;" @input="inputdata" maxlength="8" ></el-input> -->
          <el-select 
          v-model="this.customerId" 
          placeholder="輸入客戶名稱/客代"
          filterable
          :clearable="true" 
          @clear="clearFilterbill"
          style="width: 400px; margin-right:20px;" 
          @change="inputdata" 
        >
          <!-- 使用 cusdata 直接顯示每個字符串 -->
          <el-option
            v-for="item in cusdata"
            :key="item"
            :label="item"
            :value="item.split(' ')[0]"  
          ></el-option>
          </el-select>

          <el-select v-if="filterbill.length > 0" v-model="this.acc_name" placeholder="選擇帳單組別" style="margin-right:20px;" @change="filter" :clearable="true">
            <el-option
              v-for="bill in uniqueBills"
              :key="bill.account_sortId "
              :label="bill.acc_name+'(開立統編：'+bill.use_number+')'"
              :value="bill.account_sortId "
          ></el-option>
          </el-select>
          <el-button v-if="filterbill.length > 0" type="danger" @click=dialog>確認修改</el-button>
      </el-form-item>
    </div>
    
        <el-table  :data="paginatedData" style="width: 100%" v-if="filterbill.length > 0"  >
        <el-table-column label="選擇" width="55">
          <template v-slot="scope">
          <el-checkbox v-model="scope.row.selected"></el-checkbox>
         </template>
        </el-table-column>
        <el-table-column prop="license_plate" label="車號" width="200"></el-table-column>
        <el-table-column prop="account_sortId" label="帳單代號" width="150"></el-table-column>
        <el-table-column prop="acc_name" label="帳單名稱" width="350"></el-table-column>
        <el-table-column prop="use_number" label="統編" :formatter="formatRegion" width="150"></el-table-column>
        <el-table-column prop="invoice_name" label="抬頭" :formatter="formatIndustry" ></el-table-column>
      </el-table>
      <div class="pagination-container">
      <div class="pagination-info">
        Showing {{ startItem }} to {{ endItem }} of {{ this.filterbill.length }}
      </div>
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="this.filterbill.length"
        layout="prev, pager, next, jumper"
        class="pagination"
      />
    </div>
    <el-dialog title="修改帳單" v-model="dialogpage" width="75%" @close="handleClear" :close-on-click-modal="false">
    <el-form :model="form" label-width="120px" > <!-- 统一標籤寬度 -->
      <el-row style="margin-bottom: 20px">
        <el-form-item label="欲修改客戶" style="width: 900px; ">
          <el-input v-model="form.cus" type="textarea"  rows="10"  readonly   class="no-resize"></el-input>
        </el-form-item>
      </el-row>
      
      <el-form-item label="客戶代號">
          <!-- <el-input v-model="this.customerId" placeholder="輸入客戶代號" style="width: 225px; margin-right:20px;" @input="inputdata" maxlength="8" ></el-input> -->
          <el-select 
          v-model="this.form.customerId" 
          placeholder="輸入客戶名稱/客代"
          filterable
          clearable
          style="width: 400px; margin-right:20px;" 
          @change="inputformdata" 
        >
          <!-- 使用 cusdata 直接顯示每個字符串 -->
          <el-option
            v-for="item in cusdata"
            :key="item"
            :label="item"
            :value="item.split(' ')[0]"  
          ></el-option>
          </el-select>
    <!-- <el-input v-model="this.form.customerId" placeholder="輸入客戶代號" style="width: 225px; margin-right:20px;" @input="inputformdata" maxlength="8" ></el-input> -->
  </el-form-item>
  <el-form-item label="帳單組別">
    <el-select v-model="this.form.acc_name" placeholder="選擇帳單組別" style="margin-right:20px;" >
        <el-option
        v-for="bill in uniqueFormBills"
        :key="bill.account_sortId "
        :label="bill.acc_name+'(開立統編：'+bill.use_number+')'"
        :value="bill.account_sortId "
      ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="狀態"  >
      <el-select v-model="form.state" placeholder="狀態" disabled=true>     
        <el-option label="切換客代" :value="2"></el-option>
        <el-option label="切換帳單" :value="3"></el-option>
      </el-select>
    </el-form-item>
  <el-form-item label="結帳日期">
    <el-date-picker
      v-model="form.date"
      type="date"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      placeholder="選擇日期"
      :disabled-date="disabledDateBeforeToday"
      style="width: 300px;">
    </el-date-picker>
  </el-form-item>
  <div class="red"><h5 v-if="this.form.state==2">請至基本資料修改車籍資料</h5></div>
 
  </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button @click="handleClear">取消</el-button>
        <el-button type="primary" @click="savePass">送出</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="isLoading" width="15%" title="請稍後..." :close-on-click-modal="false">
  <!-- 這裡是你的表單或內容 -->
  </el-dialog>
    <div style="margin-bottom: 50px;"></div>
  </div>
</template>

<script>
import ListBar from '@/components/ListBar.vue'
import BreadCrumb from '@/components/BreadCrumb.vue';
import axios from 'axios';
export default {
  components: {
    BreadCrumb,
    ListBar
  },
data() {
  return {
    dialogpage:false,
    currentPage: 1,
    pageSize: 10,
    isLoading: false,
    customerId:'',
    acc_name:'',
    bills:[],
    cusdata:[],
    formbills:[],
    accountdata:[],
    filterbill:[],
    form:{},
  };
},
created() {
    this.getcusdata();
    this.getaccdata();
},
computed: {
 
  uniqueBills() {
      const seen = new Set();
      return this.bills.filter(bill => {
        // 只保留第一次出現的 account_sortId
        if (!seen.has(bill.account_sortId)) {
          seen.add(bill.account_sortId);
          return true;
        }
        return false;
      });
    },
    uniqueFormBills() {
      const seen = new Set();
      return this.formbills.filter(bill => {
        // 只保留第一次出現的 account_sortId
        if (!seen.has(bill.account_sortId)) {
          seen.add(bill.account_sortId);
          return true;
        }
        return false;
      });
    },
  paginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filterbill.slice(start, end);
  },
  startItem() {
    return (this.currentPage - 1) * this.pageSize + 1;
  },
  endItem() {
    return Math.min(this.currentPage * this.pageSize, this.filterbill.length);
  }
},
methods:{
  handleClear() {
    this.dialogpage=false
    this.form = {};
  },
  async savePass() {
     if (!this.form.customerId||!this.form.acc_name||!this.form.date) {
    this.$message({
      message: '欄位不可為空',
      type: 'error'
    });
    return;
  }
  const selectedRows = this.filterbill.filter(row => row.selected);
  let result = [];
  if (this.form.state == 2) {
    result = selectedRows.map(row => ({
      license_plate: row.license_plate,
      oldCustomerId: this.customerId, // 客戶代號
      newCustomerId: this.form.customerId, // 假設你有一個叫 cuscustomerId 的字段
      account_sortId: row.account_sortId, // 帳單代號
      mode: this.form.state,
      message:row.license_plate,
      date:this.form.date
    }));
  } else if (this.form.state == 3) {
    result = selectedRows.map(row => ({
      license_plate: row.license_plate,
      customerId: this.customerId, // 客戶代號
      account_sortId: row.account_sortId, // 帳單代號
      mode: this.form.state,
      message:row.license_plate,
      date:this.form.date
    }));
  }
  console.log(JSON.stringify(result)); // 將結果打印到控制台
  this.isLoading = true; // 請求開始，顯示 loading 標示
  await axios.post('http://122.116.23.30:3345/main/transformation',result)
      .then(response => {
          if(response.data.returnCode==0){
            this.$message({
              message: '更新成功',
              type: 'success'
            });
          }
          this.isLoading = false; // 無論成功還是失敗，隱藏 loading 標示
        })
        .catch(error => {
          // 處理錯誤
            this.$message({
              message: '系統有誤',
              type: 'error'
            });
          console.error('API request failed:', error);
        });
  this.form = {};
  this.dialogpage=false
},
  clearFilterbill() {
    this.form = {};
  },
  disabledDateBeforeToday(date) {
  const today = new Date(); // 當前日期
  today.setHours(0, 0, 0, 0); // 將時間設置為當天零點，避免時間誤差
  
  const currentYear = today.getFullYear(); 
  const currentMonth = today.getMonth(); // 當前月份
  
  const startOfMonth = new Date(currentYear, currentMonth, 1); // 當月的 1 號

  if (this.form.state === 2) {
    // 限制選擇從本月的 1 號到今天
    return date < startOfMonth || date > today; // 禁用小於本月 1 號或大於今天的日期
  } else if (this.form.state === 3) {
    // 限制只能選擇這個月的 1 號
    return date.getTime() !== startOfMonth.getTime(); // 只允許 1 號
  }
  
  return date.getTime() > today.getTime(); // 禁用未來的日期
  },
  dialog(){
    const selectedRows = this.filterbill.filter(row => row.selected);
    if(!selectedRows.length){
      this.$message({
              message: '請先勾選選擇修改帳號',
              type: 'error'
       });
       return
    }
    this.form.cus=''
    this.dialogpage=true
      // 將勾選的資料組合成字串，每個勾選項目換行
      const combinedData = selectedRows.map((row, index) => 
        `${index + 1}.車號:${row.license_plate}、帳單名稱: ${row.acc_name}、統編: ${row.use_number}、抬頭: ${row.invoice_name}`
      ).join('\n------------\n');
      // 更新 form.cus
      this.form.cus = combinedData;
  },
  filter() {
      this.filterbill.forEach(row => {
      row.selected = false;
      });
      if (this.acc_name) {
        this.filterbill = this.bills.filter(item => item.account_sortId == this.acc_name);
      } else {
        // 如果沒有選擇特定的帳號，顯示所有資料
        this.filterbill = this.bills;
      }
    },
  async getaccdata(){
      await axios.get('http://122.116.23.30:3345/main/selectAccount_sort')
      .then(response => {
          this.accountdata=response.data.data
          
        })
        .catch(error => {
          // 處理錯誤
            this.$message({
              message: '系統有誤',
              type: 'error'
            });
          console.error('API request failed:', error);
        });
  },
  async getcusdata(){
      await axios.get('http://122.116.23.30:3345/main/selectCustomer')
      .then(response => {
          this.cusdata=response.data.data
          this.cusdata = this.cusdata.map(item => `${item.cus_code} ${item.cus_name}`);
        })
        .catch(error => {
          // 處理錯誤
            this.$message({
              message: '系統有誤',
              type: 'error'
            });
          console.error('API request failed:', error);
        });
  },
  async getdata(customerId){
      const postData={
        customerId:customerId
      }
      await axios.post('http://122.116.23.30:3345/main/searchVehicle',postData)
      .then(response => {
          this.bills=response.data.data
          this.bills = response.data.data.sort((a, b) => {
          return a.license_plate.localeCompare(b.license_plate, 'zh-Hans-TW-u-kn-true');
        });
        })
        .catch(error => {
          // 處理錯誤
            this.$message({
              message: '請確認客戶代號是否有誤',
              type: 'error'
            });
          console.error('API request failed:', error);
        });
  },
  async getformdata(customerId){
      const postData={
        customerId:customerId
      }
      await axios.post('http://122.116.23.30:3345/main/searchVehicle',postData)
      .then(response => {
          this.formbills=response.data.data
        })
        .catch(error => {
          // 處理錯誤
            this.$message({
              message: '請確認客戶代號是否有誤',
              type: 'error'
            });
          console.error('API request failed:', error);
        });
  },
  // async inputdata(){
  //   this.acc_name=''
  //   if(this.customerId.length==8){
  //     await this.getdata(this.customerId);
  //     this.bills=this.bills.map((item) => {
  //             const accountInfo = this.accountdata.find(account => account.account_sortId === item.account_sortId);
  //             return {
  //               ...item,
  //               acc_name: accountInfo ? accountInfo.acc_name : '',
  //               use_number: accountInfo ? accountInfo.use_number : '',
  //               invoice_name: accountInfo ? accountInfo.invoice_name : ''
  //              };
  //         });
  //       if(!this.bills.length){
  //         this.$message({
  //             message: '請確認客戶代號是否有誤',
  //             type: 'error'
  //           });
  //       }else{
  //         this.filterbill = this.bills;
  //       }
  //   } 
  //   if(this.form.customerId.length==8){
  //     this.form.acc_name=''
  //     await this.getdata(this.form.customerId);
  //     this.bills=this.bills.map((item) => {
  //             const accountInfo = this.accountdata.find(account => account.account_sortId === item.account_sortId);
  //             return {
  //               ...item,
  //               acc_name: accountInfo ? accountInfo.acc_name : '',
  //               use_number: accountInfo ? accountInfo.use_number : '',
  //               invoice_name: accountInfo ? accountInfo.invoice_name : ''
  //              };
  //         });
  //       if(!this.bills.length){
  //         this.$message({
  //             message: '請確認客戶代號是否有誤',
  //             type: 'error'
  //           });
  //       }
  //     this.formbills=this.bills
  //   }
  // },
  
  async inputformdata() {
  if (this.form.customerId.length === 8) {
    this.form.acc_name = '';
    await this.processBills(this.form.customerId, true);
    if(this.form.customerId===this.customerId){
      this.form.state=3
      console.log("切帳單")
    }else{
      this.form.state=2
      console.log("切客戶")
    }
  }
},
  
  async inputdata() {
  this.acc_name = '';
  if (this.customerId.length === 8) {
    await this.processBills(this.customerId, false);
    this.filterbill.forEach(row => {
      row.selected = false;
      });
  } 
},
async processBills(customerId, isForm) {
  const billKey = isForm ? 'formbills' : 'bills'; // 動態設置使用 formbills 或 bills
  await this.getDataBasedOnType(customerId, isForm); // 根據 isForm 決定調用 getformdata 還是 getdata

  if (!this[billKey].length) {
    this.$message({
      message: '查無帳單資訊',
      type: 'error'
    });
    return;
  }

  // 更新賬單的 acc_name, use_number, invoice_name
  this[billKey] = this[billKey].map((item) => {
    const accountInfo = this.accountdata.find(account => account.account_sortId === item.account_sortId);
    return {
      ...item,
      acc_name: accountInfo ? accountInfo.acc_name : '',
      use_number: accountInfo ? accountInfo.use_number : '',
      invoice_name: accountInfo ? accountInfo.invoice_name : ''
    };
  });

  if (!isForm) {
    this.filterbill = this.bills;
  }
},

async getDataBasedOnType(customerId, isForm) {
  if (isForm) {
    await this.getformdata(customerId);
  } else {
    await this.getdata(customerId);
  }
},


  handlePageChange(page) {
      this.currentPage = page;
    },
 }
};
</script>

<style scoped>
.red{
  color: #f50404;
}
.el-select {
  width: 300px
}
.page-title {
  margin-top: 30px; 
  margin-bottom: 30px; 
  }
  .pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.pagination-info {
  margin-right: auto; /* 确保分页信息靠左 */
  padding-right: 890px; /* 可选: 添加右边距以与分页控件分开 */
  white-space: nowrap;
}
.pagination {
  flex: 1;
  text-align: right;
}
.no-resize >>> textarea {
  resize: none; /* 禁止調整大小 */
}
</style>