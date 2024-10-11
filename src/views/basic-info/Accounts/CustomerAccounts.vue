<template>
  <ListBar/>
  <div class="page-title"><h2>{{ pageTitle }}</h2></div>
  <div>
      <BreadCrumb/>
  </div>
  <div>
      <el-form-item label="查詢核銷狀態">
          <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="選擇結轉日"
          :disabled-date="DateBeforeToday"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="width: 300px; margin-right:20px;">
        </el-date-picker>
        <el-button  type="danger" @click=dialog>查詢</el-button>
      </el-form-item>
     </div> 
    <el-form-item label="核銷狀態" class="section-header">
  <div class="table-container">
    <el-table :data="cpcData" style="flex: 1; margin-right: 20px;">
      <el-table-column prop="data_source" label="中油核銷" ></el-table-column>
      <el-table-column prop="count" label="數量"></el-table-column>
    </el-table>
    <el-table :data="bankData" style="flex: 1;">
      <el-table-column prop="bank" label="銀行" ></el-table-column>
      <el-table-column prop="count" label="數量" ></el-table-column>
    </el-table>
  </div>
</el-form-item>

<el-form-item label="中油未核銷" class="section-header" >
  <el-table :data="writeoff" style="width: 100%">
  <el-table-column prop="" label="客代" width="100" />
  <el-table-column prop="" label="車牌" width="100" />
  <el-table-column prop="" label="交易時間" width="150" />
  <el-table-column prop="" label="結轉日" width="150" />
  <el-table-column prop="" label="油品類型" width="100" />
  <el-table-column prop="" label="加油站"  width="150"/>
  <el-table-column prop="" label="卡號"  width="250"/>
  <el-table-column prop="" label="油量" width="100" />
  <el-table-column prop="" label="參考單價"  width="100"/>
  <el-table-column prop="" label="參考金額" width="100" />
  <el-table-column label="操作">
  <template v-slot="scope">
  <el-button type="primary" @click="onContact(scope.row)">核銷</el-button>
  </template>
</el-table-column>
</el-table>
</el-form-item>
<el-form-item label="銀行未核銷" class="section-header" >
  <el-table :data="writeoff" style="width: 100%">
  <el-table-column prop="" label="客代" width="350" />
  <el-table-column prop="" label="入帳來源" width="350" />
  <el-table-column prop="" label="虛擬帳號" width="350" />
  <el-table-column prop="" label="交易時間"  />
  <el-table-column prop="" label="正確帳號"  />
  <el-table-column prop="" label="不核銷原因"  />
  <el-table-column label="操作">
  <template v-slot="scope">
  <el-button type="primary" @click="onContact(scope.row)">核銷</el-button>
  </template>
</el-table-column>
</el-table>
</el-form-item>
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
    selectedDate: null ,
    cpcData: [],  // 用來儲存來自 "cpc_dataCount" 的資料
    bankData: []  // 用來儲存來自 "bank_dataCount" 的資料
  };
},
created() {
   this.getselectData();
 },
  methods:{
    DateBeforeToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // 將時間設置為當天午夜
      return date.getTime() > today.getTime(); // 禁用今天以後的日期
    },
    async getselectData() {
     
     await axios.get('http://122.116.23.30:3345/finance/unverified')
       .then(response => {
         this.BankData = response.data.data;
         this.BankData.sort((a, b) => b.invoice.localeCompare(a.invoice));
       })
       .catch(error => {
         // 處理錯誤
         console.error('API request failed:', error);
       });
    },
    async dialog(){
      const postData = {
        account_date :this.selectedDate,
      };
      await axios.post('http://122.116.23.30:3345/finance/unverified',postData)
        .then(response => {
          this.cpcData = response.data.data.cpc_dataCount;
          this.bankData = response.data.data.bank_dataCount;
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });

    },
  }
}
</script>

<style scoped>
.page-title {
  margin-top: 30px; 
  margin-bottom: 30px; 
  }
  .section-header {
  margin-top: 50px;
  font-weight: bold;
  background-color: #f0ecec; /* 浅灰色背景 */
  border-radius: 10px; /* 圆角 */
  padding: 10px; /* 内边距 */
  margin-bottom: 10px; /* 项目之间的间距 */
}
.table-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>