<template>
  <ListBar/>
  <div class="page-title"><h2>{{ pageTitle }}</h2></div>
  <div>
      <BreadCrumb/>
  </div>
  <el-button type="primary" @click="dialogopen()">新增資料</el-button>
  <div class="table-container">
      <el-table :data="paginatedData" style="width: 100%">
        <el-table-column prop="id" label="序號"></el-table-column> 
        <el-table-column prop="customerId" label="客戶代號"></el-table-column>
        <el-table-column prop="bank" label="銀行"></el-table-column>
        <el-table-column prop="account_date" label="入帳日"></el-table-column>
        <el-table-column prop="account_time" label="交易時間"></el-table-column>
        <el-table-column prop="amount" label="入帳金額"><template v-slot="scope">{{ formatCurrency(scope.row.amount)}} </template></el-table-column>
        <el-table-column prop="taxId" label="統一編號"></el-table-column>
        <el-table-column prop="remark" label="備註"></el-table-column>
        <el-table-column label="操作">
      <template v-slot="scope">
      <div class="action-icons">
        <!-- <i class="fas fa-eye " @click="viewDetails(scope.row)"></i> -->
        <!-- <i class="fas fa-edit " @click="editItem(scope.row)"></i> -->
        <i class="fa-solid fa-trash-can"  @click="deleteItem(scope.row)"></i>
      </div>
      </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <div class="pagination-info">
      Showing {{ startItem }} to {{ endItem }} of {{ BankData.length }}
    </div>
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="BankData.length"
        layout="prev, pager, next, jumper"
        class="pagination"
      />
    </div>
    
    <!-- 新增資料 -->
    <el-dialog title="新增資料" v-model="dialog" width="80%" :close-on-click-modal="false">
        <el-form :model="form" label-width="155px"> <!-- 统一標籤寬度 -->
          <h6>*為必填欄位</h6>
          <el-row style="margin-bottom: 20px">
          <el-form-item label="*客戶代號">
             <el-input v-model="form.customerId" ></el-input>
          </el-form-item>
          <el-button type="primary" @click="SelectCus">帶入客戶資料</el-button>
        </el-row>
          <el-row style="margin-bottom: 20px">
          <el-form-item label="*客戶名稱" style="width: 660px;">
            <el-input v-model="form.cus_name" readonly  ></el-input>
          </el-form-item>
        </el-row>
        <el-form-item label="*入帳模式">
          <el-select v-model="form.trading_model" placeholder="選擇入帳模式" style=" width: 250px;" @change="inputdata" >
            <el-option label="永豐匯款" :value="'2'"></el-option>
            <el-option label="台企匯款" :value="'0'"></el-option>
            <el-option label="支票" :value="'3'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="*銀行來源" v-if="this.form.trading_model==='2'||this.form.trading_model==='0'">
          <el-select v-model="form.bank" placeholder="選擇銀行來源" style=" width: 250px;" disabled="true">
            <el-option label="永豐" :value="'永豐匯款'"></el-option>
            <el-option label="台企" :value="'台企'"></el-option>
          </el-select>
        </el-form-item>
            <el-form-item label="*台企虛擬帳號" v-if="this.form.trading_model==='0'" >
              <el-input v-model="form.account" maxlength="14"></el-input>
          </el-form-item>
          <el-form-item label="永豐帳號" v-if="this.form.trading_model==='2'" >
              <el-input v-model="form.account" ></el-input>
          </el-form-item>
          <el-form-item label="*支票號碼" v-if="this.form.trading_model==='3'" >
              <el-input v-model="form.account" ></el-input>
          </el-form-item>
          <el-form-item label="統一編號" >
              <el-input v-model="form.taxId" maxlength="9"></el-input>
          </el-form-item>
          <el-form-item :label="form.trading_model === '3' ? '到期日' : '入帳日'">
            <el-input v-model="form.account_date" maxlength="7"></el-input>
            <h6>格式為民國年月日，例:1130101</h6>
          </el-form-item>
          <el-form-item label="交易時間">
            <el-input v-model="form.account_time" maxlength="13"></el-input>
            <h6>格式為民國年月日時分秒，例:1130101235959</h6>
          </el-form-item>
          <el-form-item label="備註">
            <el-input v-model="form.remark" ></el-input>
          </el-form-item>
          <el-row style="margin-bottom: 20px">
          <el-form-item label="系統入帳金額">
            <el-input v-model="form.amount" ></el-input>
          </el-form-item>
        </el-row>
        </el-form>
        <template v-slot:footer>
          <div  class="dialog-footer">
            <el-button @click="dialog = false">取消</el-button>
            <el-button type="primary" @click="savePass">送出</el-button>
          </div>
        </template>
      </el-dialog>
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
      dialog: false,
      form:{
        amount:''
       },
      BankData:[],
      currentPage:1,
      pageSize:10,
    };
  },
  created() {
   
    this.getselectData();
  },
  computed: {
    
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.BankData.slice(start, end);
    },
    startItem() {
      return (this.currentPage - 1) * this.pageSize + 1;
    },
    endItem() {
      return Math.min(this.currentPage * this.pageSize, this.BankData.length);
    }
  },
  methods: {
    inputdata() {
    if (this.form.trading_model == '2') {
      this.form.bank='永豐匯款'
    } else if(this.form.trading_model == '0'){
      this.form.bank='台企'
    }else if(this.form.trading_model == '3'){
      this.form.bank=''
    }
  },
   
    dialogopen(){
      this.dialog=true;
    },
    
    savePass() {
    if (!this.form.customerId || !this.form.cus_name || 
    (!this.form.account && this.form.trading_model !== '2')) { 
      this.$message({
        message: '必填欄位不可為空',
        type: 'error'
      });
      return;
    }
    if(this.form.account_date?.length !== 7 || this.form.account_time?.length !== 13){
      this.$message({
              message: '日期或時間格式有錯',
              type: 'error'
            });
            return
    }
      const req = this.form;
      console.log(JSON.stringify(req)); // 在請求成功後輸出請求數據
      // //發送 POST 請求
      axios.post('http://122.116.23.30:3345/finance/createTBB', req)
        .then(response => {
          console.log(JSON.stringify(req)); // 在請求成功後輸出請求數據
          if (response.status === 200 && response.data.returnCode === 0) {
            // 成功提示
            this.$message({
              message: '新增成功',
              type: 'success'
            });
            // 清空表單
            this.form.customerId = '';
            this.form.cus_name = '';
            this.form.trading_model = '';
            this.form.bank='';
            this.form.taxId='';
            this.form.account = '';
            this.form.account_date = '';
            this.form.account_time='',
            this.form.amount = '';
            this.form.remark = '';
            // 關閉對話框
            this.dialog = false;
            // 刷新數據
            this.getselectData();
          } else {
            // 處理非 0 成功代碼
            this.$message({
              message: '新增失敗',
              type: 'error'
            });
          }
        })
        .catch(error => {
          // 發生錯誤時，顯示錯誤提示
          this.$message({
            message: '新增失敗，伺服器錯誤',
            type: 'error'
          });
          console.error('Error:', error);
        });
    }, 
    async getselectData() {
     
      await axios.get('http://122.116.23.30:3345/finance/selectTBB')
        .then(response => {
          this.BankData = response.data.data;
          this.BankData.sort((a, b) => b.invoice.localeCompare(a.invoice));
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
  },
     handlePageChange(page) {
      this.currentPage = page;
    },
    
    async deleteItem(row) {
      const result = confirm("您確定要刪除此項目嗎？此操作無法恢復。");
      if (result) {
      console.log('Delete item:', row);
      const postData ={
        id:row.id,
        delete_time:''
      };
      await axios.post('http://122.116.23.30:3345/finance/deleteTBB',postData)
        .then(response => {
          if(response.data.returnCode==0){
            this.$message({
              message: '刪除成功',
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

  SelectCus(){
    if(!this.form.customerId){
      this.$message({
      message: '客戶代號不可為空',
      type: 'error'
      });
      return
    }
     
      this.form.amount=''
    this.getdata(this.form.customerId = this.form.customerId.trim());
  },
  getdata(customerId){
    const postData = {
        cus_code:customerId,
      };
      console.log(JSON.stringify(postData))
      axios.post('http://122.116.23.30:3345/main/searchCustomer',postData)
        .then(response => {
            this.form.cus_name = response.data.data[0].cus_name;
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
    formatCurrency(value) {
      if (!value) return '0';
      return Number(value).toLocaleString(); // 使用 toLocaleString 進行千分位格式化
    }
  }
 };
  </script>
  
  <style scoped>
  h6 {
  color: rgb(255, 0, 0);
  margin-left: 20px;
  }
  .el-input{
    width: 250px;
  }
  .el-button{
    margin-left: 20px;
  }
  .page-title {
    margin-top: 30px; 
    margin-bottom: 30px; 
    }
    .table-container {
    overflow-x: auto;
    margin-bottom: 20px;
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
.action-icons {
  display: flex;
  gap: 20px; /* 调整图标之间的间距 */
}
.action-icons i {
  cursor: pointer;
  font-size: 20px; /* 调整图标的大小 */
}
  </style>