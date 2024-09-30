<template>
  <ListBar/>
  <div class="page-title"><h2>{{ pageTitle }}</h2></div>
  <div>
      <BreadCrumb/>
      <div> 
      <el-form-item label="客戶代號">
          <el-input v-model="this.customerId" placeholder="輸入客戶代號" style="width: 225px; margin-right:20px;" @input="inputdata" maxlength="8" ></el-input>
          <el-select v-if="bills.length > 0" v-model="this.acc_name" placeholder="選擇帳單組別" style="margin-right:20px;" @change="filter">
            <el-option
              v-for="bill in uniqueBills"
              :key="bill.account_sortId "
              :label="bill.acc_name+'(開立統編：'+bill.use_number+')'"
              :value="bill.account_sortId "
          ></el-option>
          </el-select>
          <el-button v-if="bills.length > 0" type="danger" @click=dialog>確認修改</el-button>
      </el-form-item>
    </div>
        <el-table :data="paginatedData" style="width: 100%">
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
    <el-dialog title="修改帳單" v-model="dialogpage" width="75%">
 
    <el-form :model="form" label-width="120px" > <!-- 统一標籤寬度 -->
      <el-row style="margin-bottom: 20px">
        <el-form-item label="欲修改客戶" style="width: 900px; ">
          <el-input v-model="form.cus" type="textarea" readonly></el-input>
        </el-form-item>
      </el-row>
  <el-form-item label="客戶代號">
    <el-input v-model="this.form.customerId" placeholder="輸入客戶代號" style="width: 225px; margin-right:20px;" @input="inputdata" maxlength="8" ></el-input>
  </el-form-item>
  <el-form-item label="帳單組別">
    <el-select v-model="this.form.acc_name" placeholder="選擇帳單組別" style="margin-right:20px;" @change="filter">
        <el-option
        v-for="bill in uniqueBills"
        :key="bill.account_sortId "
        :label="bill.acc_name+'(開立統編：'+bill.use_number+')'"
        :value="bill.account_sortId "
      ></el-option>
      </el-select>
    </el-form-item>
  <el-form-item label="合約日期(迄)">
        <el-date-picker
          v-model="form.contract_end"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="選擇日期"
          style="width: 300px;">
        </el-date-picker>
    </el-form-item>
  </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button @click="dialogpage = false">取消</el-button>
        <el-button type="primary" @click="savePass">送出</el-button>
      </div>
    </template>
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
    customerId:'',
    acc_name:'',
    bills:[],
    accountdata:[],
    filterbill:[],
    form:{},
  };
},
created() {
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
  dialog(){
    const selectedRows = this.paginatedData.filter(row => row.selected);
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
      const combinedData = selectedRows.map(row => 
        `車號:${row.license_plate}、帳單名稱: ${row.acc_name}、統編: ${row.use_number}、抬頭: ${row.invoice_name}`
      ).join('\n');
      // 更新 form.cus
      this.form.cus = combinedData;
  },
  filter() {
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
  async getdata(){
  
      const postData={
        customerId:this.customerId
      }
      await axios.post('http://122.116.23.30:3345/main/searchVehicle',postData)
      .then(response => {
          this.bills=response.data.data
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
  async inputdata(){
    this.acc_name=''
    if(this.customerId.length==8){
      await this.getdata();
      this.bills=this.bills.map((item) => {
              const accountInfo = this.accountdata.find(account => account.account_sortId === item.account_sortId);
              return {
                ...item,
                acc_name: accountInfo ? accountInfo.acc_name : '',
                use_number: accountInfo ? accountInfo.use_number : '',
                invoice_name: accountInfo ? accountInfo.invoice_name : ''
               };
          });
        this.filterbill = this.bills;
    }
  },
  handlePageChange(page) {
      this.currentPage = page;
    },
 }
};
</script>

<style scoped>
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
</style>