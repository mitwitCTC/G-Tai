<template>
  <ListBar/>
  <div class="page-title"><h2>{{ pageTitle }}</h2></div>
  <div>
      <BreadCrumb/>
  </div>
  <el-button type="primary" @click="dialogopen()">新增資料</el-button>
  <div class="table-container">
      <el-table :data="paginatedData" style="width: 100%" v-loading="loading">
        <el-table-column prop="invoice" label="收款單號"></el-table-column> 
        <el-table-column prop="customerId" label="客戶代號"></el-table-column>
        <el-table-column prop="account_date" label="刷卡日期"></el-table-column>
        <el-table-column prop="issuing_bank" label="發卡銀行"></el-table-column>
        <el-table-column prop="credit_amount" label="刷卡金額" align="right"  ><template v-slot="scope">{{ formatCurrency(scope.row.credit_amount)}} </template></el-table-column>
        <el-table-column prop="bank_amount" label="永豐入帳金額" align="right"><template v-slot="scope">{{ formatCurrency(scope.row.bank_amount)}} </template></el-table-column>
        <el-table-column prop="amount" label="系統入帳金額" align="right" ><template v-slot="scope">{{ formatCurrency(scope.row.amount)}} </template></el-table-column>
        <el-table-column label="操作">
      <template v-slot="scope">
      <div class="action-icons">
        <i class="fas fa-eye " @click="viewDetails(scope.row)"></i>
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
            <el-form-item label="收款單號">
            <el-input v-model="form.invoice" readonly ></el-input>
          </el-form-item>
        </el-row>
          <!-- <el-form-item label="*客戶代號">
             <el-input v-model="form.customerId" ></el-input>
          </el-form-item>
          <el-button type="primary" @click="SelectCus">帶入客戶資料</el-button>
        </el-row>
          <el-row style="margin-bottom: 20px">
          <el-form-item label="*客戶名稱" style="width: 660px;">
            <el-input v-model="form.cus_name" readonly  ></el-input>
          </el-form-item> -->
          <el-row style="margin-bottom: 20px">
            <el-form-item label="*客戶編號">
            <el-select 
              v-model="form.customerId" 
              placeholder="輸入客戶名稱/客代"
              filterable
              :clearable="true"
              style="width: 300px; " 
              @change="getdata" 
            >
              <!-- 使用 cusdata 直接顯示每個字符串 -->
              <el-option
                v-for="item in cusdata"
                :key="item"
                :label="item"
                :value="item.split(' ')[0]"  
              ></el-option>
              </el-select>
            </el-form-item> 
            <el-form-item label="*客戶名稱">
              <el-input v-model="form.cus_name" readonly ></el-input>
            </el-form-item>
          </el-row>
         
          <el-row style="margin-bottom: 20px">
            <el-form-item label="*刷卡卡號">
            <el-input v-model="form.account"  @input="formatCardNumber" ></el-input>
          </el-form-item>
          <el-form-item label="*刷卡金額">
            <el-input v-model="form.credit_amount" @input="formatamount"></el-input>
          </el-form-item>
          <el-form-item label="發卡銀行">
            <el-input v-model="form.issuing_bank" ></el-input>
          </el-form-item>
          <el-form-item label="刷卡日期">
            <el-date-picker 
                v-model="form.account_date" 
                type="date" 
                format="YYYY-MM-DD" 
                value-format="YYYY-MM-DD" 
                placeholder="選擇日期"
                style="width: 300px;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="永豐手續費%" >
            <el-input v-model="form.credit_percent" readonly  ></el-input>
          </el-form-item>
          <el-form-item label="永豐手續費" >
            <el-input v-model="form.handling_fee" readonly ></el-input>
          </el-form-item>
          <el-form-item label="永豐入帳日期">
            <el-date-picker 
                v-model="form.credit_card_data" 
                type="date" 
                format="YYYY-MM-DD" 
                value-format="YYYY-MM-DD" 
                placeholder="選擇日期"
                style="width: 300px;">
              </el-date-picker>
            </el-form-item>
          <el-form-item label="永豐入帳金額" >
            <el-input v-model="form.bank_amount" readonly ></el-input>
          </el-form-item>
          <el-form-item label="授權碼">
            <el-input v-model="form.remark" ></el-input>
          </el-form-item>
          <!-- <el-form-item label="肯美系統手續費%">
            <el-input v-model="form.card_handling" readonly ></el-input>
          </el-form-item> -->
          </el-row>
          <el-row style="margin-bottom: 20px">
          <el-form-item label="系統入帳金額">
            <el-input v-model="form.amount"  readonly ></el-input>
          </el-form-item>
        </el-row>
        <h6 v-if="this.form.card_other_fee == '0'">此客戶符合外卡不扣刷卡手續費</h6>
        <h6 v-if="isDiscountCard">永豐信用卡-手續費優惠卡號</h6>
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
      loading:false,
      dialog: false,
      biginvoice:'',
      bigdate:'',
      bigNo:'',
      form:{
        trading_model:'2',
        bank:'永豐',
        credit_percent:0.017,
        handling_fee:0,
        bank_amount:0,
        amount:0
       },
      BankData:[],
      currentPage:1,
      pageSize:10,
      lastInvoiceNumber: 1,
      serialNumber: '', // 当前流水号 // 用于模拟流水号
      currentDate: this.getCurrentDate(new Date()), // 当天日期
      isDiscountCard: false // 是否顯示"手續費優惠卡號"提示
    };
  },
  created() {
    this.getcusdata()
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
   
    formatamount(){
      if(!this.form.account){
        this.form.credit_amount=''
        this.$message({
              message: '請先輸入卡號',
              type: 'error'
            });
      }
      this.form.credit_amount=this.form.credit_amount.replace(/\D/g, '');
      this.form.handling_fee=Math.round(this.form.credit_amount* this.form.credit_percent)
      this.form.bank_amount=this.form.credit_amount-this.form.handling_fee
      if(this.isDiscountCard || this.form.card_other_fee==0 ){
        this.form.amount=this.form.credit_amount
      }else{
        this.form.amount=Math.round(this.form.credit_amount* 0.98)//0.98是算 刷卡金額扣掉0.02手續費
      }
    },
    formatCardNumber() {
      this.form.credit_amount=''
      this.form.handling_fee=0
      this.form.bank_amount=0
      this.form.amount=0
      // 移除所有非數字的字符
      let input = this.form.account.replace(/\D/g, '');
      // 限制輸入的數字最多16個字符
      if (input.length > 16) {
        input = input.slice(0, 16);
      }
      // 每4位數字後加一個'-'，並且在輸入第4位時加上'-'
      input = input.replace(/(.{4})/g, '$1-');
      // 移除最後一個多餘的'-'（如果存在）
      if (input.endsWith('-')) {
        input = input.slice(0, -1);
      }
      // 更新格式化後的卡號
      this.form.account = input;
       // 檢查前8碼是否為特定的卡號
      const firstEightDigits = input.replace(/-/g, '').slice(0, 8);
      const discountCardNumbers = ['51992306', '51992302', '46965600'];
      // 根據卡號判斷是否顯示"手續費優惠卡號"
      this.isDiscountCard = discountCardNumbers.includes(firstEightDigits);
      if(this.isDiscountCard){
        this.form.credit_percent=0.004
      }else{
        this.form.credit_percent=0.017
      }
    },
    getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2); // 取年末两位
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // 补零
    const day = ('0' + today.getDate()).slice(-2); // 补零
    return `${year}${month}${day}`;
    },
    generateInvoice() {
      if (this.bigdate !== this.currentDate) {
        this.bigdate = this.currentDate; // 更新bigdate為當前日期
        this.bigNo = '001'; // 重置流水號為001
        this.form.invoice = `G${this.bigdate}${this.bigNo}`;
      }
      
    },
    dialogopen(){
     
      this.currentDate = this.getCurrentDate(); // 生成当前日期格式
      const nextNo = ('00' + (parseInt(this.bigNo) + 1)).slice(-3);
      // 顯示新的流水號
      this.form.invoice = `G${this.bigdate}${nextNo}`;
      console.log("顯示的新的流水號: " + this.form.invoice);
      this.generateInvoice();
      this.dialog=true;
    },
    updateInvoiceNumber() {
    // 增加流水号
    this.bigNo = ('00' + (parseInt(this.bigNo) + 1)).slice(-3); // 增加流水號
  },
    savePass() {
      if (this.form.credit_card_data) {
      this.form.credit_card_data = this.formatDateROC(this.form.credit_card_data);
      console.log('Credit Card Data:', this.form.credit_card_data);
    }
    if (this.form.account_date) {
      
      this.form.account_date = this.formatDateROC(this.form.account_date);
      console.log('Account Date:', this.form.account_date);
      this.form.account_time = this.form.account_date;
      console.log('Account TIME:', this.form.account_time);
    }
     
    if(!this.form.customerId||!this.form.cus_name||!this.form.account||!this.form.credit_amount ){
      this.$message({
              message: '必填欄位不可為空',
              type: 'error'
            });
            return
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
            this.updateInvoiceNumber();
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
      this.loading = true;  // 開始加載
      await axios.get('http://122.116.23.30:3345/finance/selectSINOPAC')
        .then(response => {
          this.BankData = response.data.data;
          this.BankData.sort((a, b) => b.invoice.localeCompare(a.invoice));
           // 找出最大 invoice 的數據
          const maxInvoiceData = this.BankData.reduce((max, item) => {
            return (item.invoice > max.invoice) ? item : max;
          } , this.BankData[0]);
    // 將最大的 invoice 值賦給變量
      this.biginvoice = maxInvoiceData.invoice;
      this.bigdate=this.biginvoice.substring(1, 7);
      this.bigNo=this.biginvoice.substring(7);
      console.log("日期"+this.bigdate +"流水號"+ this.bigNo)
      this.loading = false;  // 請求完成後關閉加載狀態
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
          cus_code:row.customerId,
          invoice:row.invoice
        }
      });
    },
    async deleteItem(row) {
      const result = confirm("您確定要刪除此項目嗎？此操作無法恢復。");
      if (result) {
      console.log('Delete item:', row);
      const postData ={
        id:row.id,
        delete_time:''
      };
      await axios.post('http://122.116.23.30:3345/finance/deleteSINOPAC',postData)
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
    formatDateROC(date) {
      if (!date) return ''; // 確保日期存在

const [year, month, day] = date.split('-').map(Number);

// 計算民國年（2024 年 -> 113 年）
const year1911 = year - 1911;

// 格式化日期字符串
const formattedDate = `${year1911.toString().padStart(3, '0')}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;

return formattedDate;
  },
  // SelectCus(){
  //   if(!this.form.customerId){
  //     this.$message({
  //     message: '客戶代號不可為空',
  //     type: 'error'
  //     });
  //     return
  //   }
      // this.form.credit_amount=''
      // this.form.handling_fee=0
      // this.form.bank_amount=0
      // this.form.amount=0
  //   this.getdata(this.form.customerId = this.form.customerId.trim());
  // },
  // getdata(customerId){
  //   const postData = {
  //       cus_code:customerId,
  //     };
  //     console.log(JSON.stringify(postData))
  //     axios.post('http://122.116.23.30:3345/main/searchCustomer',postData)
  //       .then(response => {
  //           this.form.cus_name = response.data.data[0].cus_name;
  //           this.form.card_other_fee=response.data.data[0].card_other_fee;
  //       })
  //       .catch(error => {
  //         // 處理錯誤
  //           this.$message({
  //             message: '請確認客戶代號是否有誤',
  //             type: 'error'
  //           });
  //         console.error('API request failed:', error);
  //       });
  //   },
    formatCurrency(value) {
      if (!value) return '0';
      return Number(value).toLocaleString(); // 使用 toLocaleString 進行千分位格式化
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
    getdata(){
      this.form.credit_amount=''
      this.form.handling_fee=0
      this.form.bank_amount=0
      this.form.amount=0
      this.form.cus_name=''
      const postData = {
        cus_code:this.form.customerId,
        customerId:this.form.customerId,
      };
     if(this.form.customerId.length==8){
      this.form.cus_name='查詢中..'
      console.log(JSON.stringify(postData))
      axios.post('http://122.116.23.30:3345/main/searchCustomer',postData)
        .then(response => {
            this.form.cus_name = response.data.data[0].cus_name;
            this.form.card_other_fee=response.data.data[0].card_other_fee;
        })
        .catch(error => {
          // 處理錯誤
            this.form.cus_name=''
            this.$message({
              message: '請確認客戶代號是否有誤',
              type: 'error'
            });
          console.error('API request failed:', error);
        });
     } 
     if(this.form.cus_name){
      axios.post('http://122.116.23.30:3345/main/searchAccount_sort',postData)
        .then(response => {
            this.bills = response.data.data;
            if(!this.bills.length){
              this.$message({
              message: '查無帳單資訊',
              type: 'error'
            });
            return;
            }
        })
        .catch(error => {
          // 處理錯誤
            this.form.cus_name=''
            this.$message({
              message: '系統錯誤',
              type: 'error'
            });
          console.error('API request failed:', error);
        });
     }
    
  },
  }
 };
  </script>
  
  <style scoped>
  .el-input{
    width: 300px;
  }
  h6 {
  color: rgb(255, 0, 0);
  margin-left: 20px;
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