<template>
  <ListBar/>
  <div class="page-title"><h2>{{ pageTitle }}</h2></div>
  <div>
      <BreadCrumb/>
  </div>
  <el-button type="primary" @click="dialog = true">新增資料</el-button>
  <div class="table-container">
      <el-table :data="paginatedData" style="width: 100%">
        <el-table-column prop="customerId" label="客戶代號"></el-table-column>
        <el-table-column prop="credit_card_data" label="刷卡日期"></el-table-column>
        <el-table-column prop="issuing_bank" label="發卡銀行"></el-table-column>
        <el-table-column prop="credit_amount" label="刷卡金額"></el-table-column>
        <el-table-column prop="bank_amount" label="永豐入帳金額"></el-table-column>
        <el-table-column prop="amount" label="肯美系統入帳金額"></el-table-column>
        <el-table-column label="操作">
      <template v-slot="scope">
      <div class="action-icons">
        <i class="fas fa-eye " @click="viewDetails(scope.row)"></i>
        <i class="fas fa-edit " @click="editItem(scope.row)"></i>
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
    <el-dialog title="新增資料" v-model="dialog" width="80%">
        <el-form :model="form" label-width="155px"> <!-- 统一標籤寬度 -->
          <el-row style="margin-bottom: 20px">
            <el-form-item label="收款單號">
            <el-input v-model="form.invoice" ></el-input>
          </el-form-item>
          <el-form-item label="客戶代號">
             <el-input v-model="form.customerId" ></el-input>
          </el-form-item>
          <el-form-item label="客戶名稱">
            <el-input v-model="form.cus_name"  ></el-input>
          </el-form-item>
          <el-form-item label="永豐刷卡日期">
            <el-date-picker 
                v-model="form.credit_card_data" 
                type="date" 
                format="YYYY-MM-DD" 
                value-format="YYYY-MM-DD" 
                placeholder="選擇日期"
                style="width: 175px;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="永豐刷卡金額">
            <el-input v-model="form.credit_amount" ></el-input>
          </el-form-item>
          <el-form-item label="永豐入帳金額">
            <el-input v-model="form.bank_amount" ></el-input>
          </el-form-item>

          <el-form-item label="發卡銀行">
            <el-input v-model="form.issuing_bank" ></el-input>
          </el-form-item>
          <el-form-item label="永豐手續費%">
            <el-input v-model="form.credit_percent"  ></el-input>
          </el-form-item>
          <el-form-item label="永豐手續費">
            <el-input v-model="form.handling_fee"  ></el-input>
          </el-form-item>
          <el-form-item label="永豐刷卡卡號">
            <el-input v-model="form.account"  ></el-input>
          </el-form-item>
          <el-form-item label="永豐入帳日期">
            <el-date-picker 
                v-model="form.account_date" 
                type="date" 
                format="YYYY-MM-DD" 
                value-format="YYYY-MM-DD" 
                placeholder="選擇日期"
                style="width: 175px;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="肯美系統入帳金額">
            <el-input v-model="form.amount"  ></el-input>
          </el-form-item>
          <el-form-item label="授權碼">
            <el-input v-model="form.remark" ></el-input>
          </el-form-item>
          <!-- <el-form-item label="肯美系統手續費%">
            <el-input v-model="form.card_handling" readonly ></el-input>
          </el-form-item> -->
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
        trading_model:'2',
        bank:'永豐'
       },
      BankData:[],
      currentPage:1,
      pageSize:10
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
    savePass() {
      this.form.credit_card_data=this.formatDate(this.form.credit_card_data);
      this.form.account_date=this.formatDate(this.form.account_date);
      if (this.form.bank_amount) {
      this.form.bank_amount = this.form.bank_amount.replace(/,/g, '');
    }
    if (this.form.credit_amount) {
      this.form.credit_amount = this.form.credit_amount.replace(/,/g, '');
    }
    if (this.form.handling_fee) {
      this.form.handling_fee = this.form.handling_fee.replace(/,/g, '');
    }
    if (this.form.amount) {
      this.form.amount = this.form.amount.replace(/,/g, '');
    }
      const req = this.form;
      console.log(JSON.stringify(req)); // 在請求成功後輸出請求數據
      //發送 POST 請求
      axios.post('http://122.116.23.30:3345/finance/createSINOPAC', req)
        .then(response => {
          console.log(JSON.stringify(req)); // 在請求成功後輸出請求數據
          if (response.status === 200 && response.data.returnCode === 0) {
            // 成功提示
            this.$message({
              message: '新增成功',
              type: 'success'
            });
            // 清空表單
            this.form.invoice = '';
            this.form.customerId = '';
            this.form.cus_name = '';
            this.form.credit_amount = '';
            this.form.credit_card_data = '';
            this.form.bank_amount = '';
            this.form.issuing_bank = '';
            this.credit_percent='';
            this.form.handling_fee = '';
            this.form.account = '';
            this.form.account_date = '';
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
     
      await axios.get('http://122.116.23.30:3345/finance/selectSINOPAC')
        .then(response => {
          this.BankData = response.data.data;
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
  },
     handlePageChange(page) {
      this.currentPage = page;
    },
    viewDetails(row) {
      console.log('View details for:', row);
      this.$router.push({ 
        path: 'SelectView',
        query: {
          rowType:'9',
          cus_code:row.customerId
        }
      });
    },
    editItem(row) {
      console.log('Edit item:', row);
      this.$router.push({ 
        path: 'UpdateView',
        query: {
          rowType:'9',
          cus_code:row.customerId
        }
      });
    },
    deleteItem(row) {
      console.log('Delete item:', row);
    },
    formatDate(date) {
    if (!date) return ''; // 確保日期存在

    const [year, month, day] = date.split('-').map(Number);

    // 計算減去 1911 年的年份
    const year1911 = year - 1911;

    // 格式化日期字符串
    const formattedDate = `${year1911}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;

    return formattedDate;
  }
  }
 };
  </script>
  
  <style scoped>
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