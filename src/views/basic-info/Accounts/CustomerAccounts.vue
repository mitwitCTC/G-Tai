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
    <el-table :data="cpcData" style="flex: 1; margin-right: 20px;" v-loading="loading">
      <el-table-column prop="data_source" label="中油核銷" ></el-table-column>
      <el-table-column prop="count" label="數量"></el-table-column>
    </el-table>
    <el-table :data="bankData" style="flex: 1;" v-loading="loading">
      <el-table-column prop="bank" label="銀行" ></el-table-column>
      <el-table-column prop="count" label="數量" ></el-table-column>
    </el-table>
  </div>
</el-form-item>

      <!-- 顯示表格 -->
      <el-form-item label="中油未核銷" class="section-header"  >
        <el-button type="primary" @click="onContact(1)">核銷</el-button>
        <el-table :data="errcpc" style="width: 100%" v-loading="loading">
        <el-table-column prop="customerId" label="客代" width="100" />
        <el-table-column prop="license_plate" label="車牌" width="100" />
        <el-table-column prop="trade_time" label="交易時間" width="150" />
        <el-table-column prop="account_date" label="結轉日" width="150" />
        <el-table-column prop="fuel_type" label="油品類型" width="100" />
        <el-table-column prop="station_name" label="加油站"  width="150"/>
        <el-table-column prop="card_number" label="卡號"  width="250"/>
        <el-table-column prop="fuel_volume" label="油量" width="100" />
        <el-table-column prop="reference_price" label="參考單價" align="right"  width="100"/>
        <el-table-column prop="reference_amount" label="參考金額" align="right" width="100" />
      </el-table>
      </el-form-item>

      <el-form-item label="銀行未核銷" class="section-header" >
        <el-button type="primary" @click="onContact(2)">核銷</el-button>
        <el-table :data="errbank" style="width: 100%" v-loading="loading">
          <el-table-column prop="customerId" label="客代" width="200" />
          <el-table-column prop="bank" label="入帳來源" width="200" />
          <el-table-column prop="account" label="虛擬帳號" width="200" />
          <el-table-column prop="account_time" label="交易時間" />   
           <!-- 可編輯的 account_new -->
          <el-table-column prop="account_new" label="正確帳號">
            <template v-slot="scope">
              <el-input v-model="scope.row.account_new"maxlength=14 v-if="editingRow === scope.row"></el-input>
            </template>
          </el-table-column> 
          <!-- 可編輯的 correct -->
          <el-table-column prop="correct" label="不核銷原因">
            <template v-slot="scope">
              <el-input v-model="scope.row.correct"v-if="editingRow === scope.row"></el-input>
            </template>
          </el-table-column>
          <!-- 金額使用格式化 -->
          <el-table-column prop="amount" label="金額" align="right">
            <template v-slot="scope">{{ formatAmount(scope.row.amount) }}</template>
          </el-table-column>
          <el-table-column label="操作">
                <template v-slot="scope">
                    <el-button type="warning" @click="Edit(scope.row)"  v-if="editingRow !== scope.row">修改</el-button>
                    <el-button type="success" @click="Save(scope.row)" v-if="editingRow === scope.row">儲存</el-button>
                </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="銀行已核銷" class="section-header" >
       
        <el-select 
          v-model="customerId" 
          placeholder="輸入客戶名稱/客代"
          filterable
          :clearable="true"
          style="width: 300px; margin-right:20px;" 
          @change="getdata()" 
        >
          <!-- 使用 cusdata 直接顯示每個字符串 -->
        <el-option
            v-for="item in cusdata"
            :key="item"
            :label="item"
            :value="item.split(' ')[0]"  
          ></el-option>
          </el-select>


        <el-table :data="isDiscount" style="width: 100%" v-loading="loading">
          <el-table-column prop="customerId" label="客代" width="200" />
          <el-table-column prop="bank" label="入帳來源" width="200" />
          <el-table-column prop="account" label="虛擬帳號" width="200" />
          <el-table-column prop="account_time" label="交易時間" />   
           <!-- 可編輯的 account_new -->
          <el-table-column prop="account_new" label="正確帳號">
            <template v-slot="scope">
              <el-input v-model="scope.row.account_new"maxlength=14 v-if="isEditable === scope.row"></el-input>
            </template>
          </el-table-column> 
          <!-- 可編輯的 correct -->
          <el-table-column prop="correct" label="修改原因">
            <template v-slot="scope">
              <el-input v-model="scope.row.correct" v-if="isEditable === scope.row"></el-input>
            </template>
          </el-table-column>
          <!-- 金額使用格式化 -->
          <el-table-column prop="amount" label="金額" align="right">
            <template v-slot="scope">{{ formatAmount(scope.row.amount) }}</template>
          </el-table-column>
          <el-table-column label="操作">
                <template v-slot="scope">
                    <el-button type="warning" @click="isEdit(scope.row)" v-if="isEditable !== scope.row">修改</el-button>
                    <el-button type="success" @click="isSave(scope.row)" v-if="isEditable === scope.row">儲存</el-button>
                </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <div style="margin-bottom: 100px;"></div>
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
    editingRow: null,  // 追踪正在編輯的行
    loading: false,  // 加載狀態
    selectedDate: null ,
    isEditable: null, // 控制是否可以編輯的布爾變量
    cpcData: [],  // 用來儲存來自 "cpc_dataCount" 的資料
    bankData: [],  // 用來儲存來自 "bank_dataCount" 的資料
    customerId:'',
    errcpc:[],
    errbank:[],
    cusdata:[],
    isDiscount:[]
  };
},
created() {
   this.getselectData();
   this.getcusdata();
 },
  methods:{
    async getdata(){
      const postData={
        customerId :this.customerId
      }
      await axios.post('http://122.116.23.30:3345/finance/searchReconciledTBB',postData)
      .then(response => {
          this.isDiscount=response.data.data
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
    DateBeforeToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // 將時間設置為當天午夜
      return date.getTime() > today.getTime(); // 禁用今天以後的日期
    },
    async getselectData() {
      this.loading = true;  // 開始加載
      const postData = {
        account_date :"",
      };
      try {
        const response = await axios.post('http://122.116.23.30:3345/finance/unverified', postData);
        this.errcpc = response.data.data.cpc_data;
        this.errbank = response.data.data.bank_data;
     } catch (error) {
       console.error('API request failed:', error);
      } finally {
        this.loading = false;  // 請求完成後關閉加載狀態
      }
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
    formatAmount(value) {
      // 將金額字串轉換為數字並移除前導零
      const num = parseInt(value, 10);
      // 如果解析後不是數字，返回空字串
      if (isNaN(num)) {
        return '';
      }
      // 使用toLocaleString將數字格式化為千分位
      return num.toLocaleString();
    },
    async onContact(type){
      if(type===1){
        await axios.get('http://122.116.23.30:3345/finance/reconciliationCPC')
        .then(response => {
          if(response.data.returnCode==0){
            this.$message({
              message: '中油資料已核銷',
              type: 'success'
            });
            this.getselectData();
          }
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
      }else if(type===2){
        await axios.get('http://122.116.23.30:3345/finance/reconciliationTBB')
        .then(response => {
          if(response.data.returnCode==0){
            this.$message({
              message: '銀行資料已核銷',
              type: 'success'
            });
            this.getselectData();
          }
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
      }
      
    },
    Edit(row){
      this.editingRow = row;  // 設置當前正在編輯
    },
    async Save(row){
      
      const postData ={
        id:row.id,
        account :row.account_new,
        correct:row.correct
      }
      if((!row.account_new)||(!row.correct)){
        this.$message({
              message: '欄位不得為空',
              type: 'error'
            });
            return
      }
      this.editingRow = null; // 取消編輯狀態
      await axios.post('http://122.116.23.30:3345/finance/updateTBBAccount',postData)
        .then(response => {
          if(response.data.returnCode==0){
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.getselectData();
          }
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
    },
    isEdit(row){
      this.isEditable = row;
    },
    async isSave(row){
      
      const postData ={
        id:row.id,
        account :row.account_new,
        correct:row.correct
      }
      if((!row.account_new)||(!row.correct)){
        this.$message({
              message: '欄位不得為空',
              type: 'error'
            });
            return
      }
      this.isEditable=null
      await axios.post('http://122.116.23.30:3345/finance/updateReconciledTBB',postData)
        .then(response => {
          if(response.data.returnCode==0){
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.getdata()
            this.getselectData();
          }
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