<template>
  <div>
    <ListBar />
    <div class="page-title"><h2>{{ pageTitle }}</h2></div>
    <div>
      <BreadCrumb :isSpecialPage="true" />
    </div>
    <el-button type="success" @click="dialogBill = true">新增帳單資料</el-button>
    <div class="page-title"><h5>客戶代號:<h4>{{this.cus_code}}</h4>客戶名稱:<h4>{{this.cus_name}}</h4></h5></div>
    <div class="table-container">
      <el-table :data="currentPageData" style="width: 100%" v-loading="loading">
        <el-table-column prop="account_sortId" label="帳單編號" width="150" />
        <el-table-column prop="acc_name" label="帳單名稱" width="200" />
        <el-table-column prop="use_number" label="開立統編" width="150" />
        <el-table-column prop="recipient_name" label="收件人姓名" width="300" />
        <el-table-column prop="billing_method" label="寄送方式" :formatter="formatbilling_method"  width="150" />
        <el-table-column prop="address_email" label="收件地址/Mail"width="300" />
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
    </div>
    <div class="pagination-container">
      <div class="pagination-info">
        Showing {{ startItem }} to {{ endItem }} of {{ bills.length }}
      </div>
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="bills.length"
        layout="prev, pager, next, jumper"
        class="pagination"
      />
    </div>
      <div class="page-title"><h2>車籍資料維護</h2></div>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="搜尋車牌號碼">
          <el-input v-model="search.license_plate" placeholder="輸入車牌號碼" style="width: 225px;"></el-input>
        </el-form-item>
        <el-button type="warning" @click="dialog = true">新增車籍</el-button>
      </el-form>
      <el-table :data="currentPageData2" style="width: 100%" v-loading="loading">
        <el-table-column prop="account_sortId" label="帳單名稱" width="300"><template v-slot="scope">{{ formatName(scope.row.account_sortId)}} </template></el-table-column>
        <el-table-column prop="license_plate" label="車牌號碼" width="300" />
        <el-table-column prop="vehicle_type" label="車輛型態" :formatter="formatType" width="300" />
        <el-table-column prop="product_name" label="油品名稱"  width="350" ><template v-slot="scope">{{ formatProduct(scope.row.product_name)}} </template></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <div class="action-icons">
              <i class="fas fa-edit " @click="editItemVehicle(scope.row)"></i>
              <i class="fa-solid fa-trash-can"  @click="deleteItemVehicle(scope.row)"></i>
              <el-button type="warning" @click="onVehicle(scope.row)">車籍卡片</el-button>
            </div>
          </template>
       </el-table-column>
    </el-table>
    <div class="pagination-container">
      <div class="pagination-info">
        Showing {{ startItem2 }} to {{ endItem2 }} of {{ filteredData.length }}
      </div>
      <el-pagination
        @current-change="handlePageChange2"
        :current-page="currentPage2"
        :page-size="pageSize"
        :total="filteredData.length"
        layout="prev, pager, next, jumper"
        class="pagination"
      />
    </div>
    <div style="margin-bottom: 50px;"></div>
    

    <!-- 新增帳單資訊 -->
    <el-dialog title="新增帳單資訊" v-model="dialogBill" width="50%" :close-on-click-modal="false">
      <el-form :model="billform" label-width="120px"> <!-- 统一標籤寬度 -->
        <el-row style="margin-bottom: 20px">
          <el-form-item label="帳單名稱">
            <el-input v-model="billform.acc_name" ></el-input>
          </el-form-item>
          <el-form-item label="開立統編">
            <el-input v-model="billform.use_number" ></el-input>
          </el-form-item>
          <el-form-item label="發票開立人名稱">
            <el-input v-model="billform.invoice_name" ></el-input>
          </el-form-item>
          <el-form-item label="帳單寄送方式">
          <el-select v-model="billform.billing_method" placeholder="選擇方式">
            <el-option label="MAIL" :value="1"></el-option>
            <el-option label="平信" :value="2"></el-option>
            <el-option label="官方LINE" :value="3"></el-option>
            <el-option label="掛號" :value="4"></el-option>
            <el-option label="合併寄" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址/E-Mail" style="width: 1000px">
          <el-input v-model="billform.address_email" ></el-input>
        </el-form-item>
        <el-form-item label="對帳單列印">
          <el-select v-model="billform.statement_print" placeholder="選擇方式">
            <el-option label="YES" :value="'YES'"></el-option>
            <el-option label="NO" :value="'NO'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收件人姓名">
          <el-input v-model="billform.recipient_name" ></el-input>
        </el-form-item>
        <el-form-item label="帳單聯絡人">
         <el-input v-model="billform.acc_contact" ></el-input>
        </el-form-item>
        <el-form-item label="對帳單備註資訊" style="width: 1000px">
          <el-input v-model="billform.statement_notes" type="textarea" ></el-input>
        </el-form-item>
        <el-form-item label="對帳單注意事項" style="width: 1000px">
          <el-input v-model="billform.statement_remarks" type="textarea" ></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <template v-slot:footer>
      <div  class="dialog-footer">
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" @click="savePassbill">送出</el-button>
      </div>
    </template>
  </el-dialog>

       <!-- 新增車籍資訊 -->
       <el-dialog title="新增車籍資訊" v-model="dialog" width="50%" :close-on-click-modal="false">
        <el-form :model="form" label-width="120px"> <!-- 统一標籤寬度 -->
          <el-row style="margin-bottom: 20px">
            <el-form-item label="帳單名稱">
          <el-select v-model="form.account_sortId" placeholder="選擇帳單">
            <el-option
              v-for="id in bills"
              :key="id.account_sortId"
              :label="id.acc_name"
              :value="id.account_sortId"
          ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="車牌號碼">
          <el-input v-model="form.license_plate" maxlength="8" ></el-input>
        </el-form-item>
        <el-form-item label="車輛型態">
          <el-select v-model="form.vehicle_type" placeholder="選擇車輛型態">
            <el-option label="大巴" :value="1"></el-option>
            <el-option label="中巴" :value="2"></el-option>
            <el-option label="自小客" :value="3"></el-option>
            <el-option label="油罐卡" :value="4"></el-option>
            <el-option label="臨時卡" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="油品名稱">
          <el-select v-model="form.product_name" placeholder="選擇油品">
            <el-option
              v-for="id in productMap"
              :key="id.id"
              :label="id.className"
              :value="id.classId"
          ></el-option>
          </el-select>
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
import ListBar from '@/components/ListBar.vue';
import BreadCrumb from '@/components/BreadCrumb.vue';
import axios from 'axios';
import { toRaw } from 'vue'; 

export default {
  components: {
    BreadCrumb,
    ListBar,
 
  },
  data() {
    return {
      loading:false,
      cus_code:'',
      cus_name:'',
      dialogBill: false,
      dialog: false,
      search: {
        license_plate: ''
      },
      bills: [],
      vehicles: [],
      productMap:[],
      productType:{
        "1": "大巴",
        "2": "中巴",
        "3": "自小客",
        "4": "油罐卡",
        "5": "臨時卡"
      },
      billing_methodMap:{
        "0": "不需要",
        "1": "MAIL",
        "2": "平信",
        "3": "官方LINE",
        "4": "掛號",
        "5": "合併寄",
      },
      billform:{
        customerId:'',
        acc_name:'',
        use_number:'',
        invoice_name:'',
        billing_method:'',
        address_email:'',
        statement_print:'',
        recipient_name:'',
        acc_contact:'',
        statement_notes:'',
        statement_remarks:'',
        createTime:''
      },
      form:{
        customerId:'',
        createTime:''
      },
      currentPage: 1,
      currentPage2:1,
      pageSize: 10
    };
  },
  created() {
    // this.rowData = JSON.parse(this.$route.query.rowData);
    this.cus_code = (this.$route.query.cus_code);
    this.cus_name = (this.$route.query.cus_name);
    this.billform.customerId = this.cus_code;
    this.form.customerId = this.cus_code;
    this.getbillselectData();
    this.getselectData();
    this.getproduct_name();
    this.getVehicle();
  },
  computed: {
    //1為帳單資料 2為車籍資料
   // 計算當前頁面顯示的數據
   currentPageData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.bills.slice(start, end);
    },
    // 計算當前頁面顯示的起始和結束項目
    startItem() {
      const start = (this.currentPage - 1) * this.pageSize + 1;
      return Math.min(start, this.bills.length);
    },
    endItem() {
      const end = this.currentPage * this.pageSize;
      return Math.min(end, this.bills.length);
    },
    // 計算當前頁面顯示的數據
   currentPageData2() {
      const start = (this.currentPage2 - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredData.slice(start, end);
    },
    // 計算當前頁面顯示的起始和結束項目
    startItem2() {
      const start = (this.currentPage2 - 1) * this.pageSize + 1;
      return Math.min(start, this.vehicles.length);
    },
    endItem2() {
      const end = this.currentPage2 * this.pageSize;
      return Math.min(end, this.vehicles.length);
    },
    filteredData() {
      const searchTerm = this.search.license_plate.trim().toLowerCase();
      return this.vehicles.filter(item => {
      const license_plate = item.license_plate ? item.license_plate.toLowerCase() : '';
      return (
          license_plate.includes(searchTerm)
        );
      });
    },
  },
  methods: {
    async getbillselectData() {
      this.loading = true;
      const postData = {
      customerId:this.cus_code,
      };
      await axios.post('http://122.116.23.30:3345/main/searchAccount_sort',postData)
        .then(response => {
          this.bills = response.data.data;
          this.loading = false;  // 請求完成後關閉加載狀態
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
    },
    async getproduct_name() {
      await axios.get('http://122.116.23.30:3345/main/selectProduct')
        .then(response => {
          this.productMap = response.data.data;
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
    },
    async getselectData() {
      this.loading = true;
      const postData = {
      customerId:this.cus_code,
      };
      await axios.post('http://122.116.23.30:3345/main/searchVehicle',postData)
        .then(response => {
          this.vehicles = response.data.data;
          this.loading = false;  // 請求完成後關閉加載狀態
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
    },

    savePassbill() {
      const req = this.billform;
      //發送 POST 請求
      axios.post('http://122.116.23.30:3345/main/createAccount_sort', req)
        .then(response => {
          console.log(JSON.stringify(req)); // 在請求成功後輸出請求數據
          if (response.status === 200 && response.data.returnCode === 0) {
            // 成功提示
            this.$message({
              message: '新增成功',
              type: 'success'
            });
            this.form.acc_name = '';
            this.form.use_number = '';
            this.form.invoice_name = '';
            this.form.billing_method = '';
            this.form.address_email = '';
            this.form.statement_print = '';
            this.form.recipient_name = '';
            this.form.acc_contact = '';
            this.form.statement_notes = '';
            this.form.statement_remarks = '';
            // 關閉對話框
            this.dialogBill = false;

            // 刷新數據
            this.getbillselectData();
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
    savePass() {
      if (this.licens.includes(this.form.license_plate)) {
        this.$message({
              message: '此車牌已登入',
              type: 'error'
            });
            this.form.license_plate=''
            return
      } 
      this.form.license_plate = this.form.license_plate.trim();
      const req = this.form;
      //發送 POST 請求
      axios.post('http://122.116.23.30:3345/main/createVehicle', req)
        .then(response => {
          console.log(JSON.stringify(req)); // 在請求成功後輸出請求數據
          if (response.status === 200 && response.data.returnCode === 0) {
            // 成功提示
            this.$message({
              message: '新增成功',
              type: 'success'
            });
            this.license_plate = '';
            this.vehicle_type = '';
            this.product_name = '';
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
    formatName(account_sortId) {
      // 使用 find 方法找到對應的 employee_name
      const account = this.bills.find(item => item.account_sortId == account_sortId);
      return account == null ? '' : (account ? account.acc_name : '未知名稱');
    },
    formatType(vehicle_type) {
      const rawproduct = toRaw(vehicle_type);
      return this.productType[rawproduct.vehicle_type] || '未知';
    },
    formatbilling_method(billing_method) {
      const rawproduct = toRaw(billing_method);
      return this.billing_methodMap[rawproduct.billing_method] || '未知';
    },
    formatProduct(product_name) {
      const product = this.productMap.find(item => item.classId == product_name);
      return product == null ? '' : (product ? product.className : '未知名稱');
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    handlePageChange2(page) {
      this.currentPage2 = page;
    },
    
    viewDetails(row) {
      console.log('View details for:', row);
      this.$router.push({ 
        path: 'SelectView',
        query: {
          rowType:'3',
          cus_name:this.cus_name,
          cus_code:this.cus_code,
          account_sortId :row.account_sortId 
        }
      });
    },
    editItem(row) {
      console.log('Edit item:', row);
      this.$router.push({ 
        path: 'UpdateView',
        query: {
          rowType:'3',
          cus_name:this.cus_name,
          cus_code:this.cus_code,
          account_sortId :row.account_sortId 
        }
      });
    },
    async deleteItem(row) {
      const result = confirm("您確定要刪除此項目嗎？此操作無法恢復。");
      if (result) {
      console.log('Delete item:', row);
      const req = {
        account_sortId:row.account_sortId,
        deleteTime:''
      };
      console.log('Delete item:', req);
      await axios.post('http://122.116.23.30:3345/main/deleteAccount_sort', req)
        .then(response => {
          if (response.status === 200 && response.data.returnCode === 0) {
            // 成功提示
            this.$message({
              message: '刪除成功',
              type: 'success'
            });
            this.getbillselectData();
          } else {
            // 處理非 0 成功代碼
            this.$message({
              message: '刪除失敗',
              type: 'error'
            });
          }
        })
        .catch(error => {
          // 發生錯誤時，顯示錯誤提示
          this.$message({
            message: '刪除失敗，伺服器錯誤',
            type: 'error'
          });
          console.error('Error:', error);
        });
      }
    },
    viewDetailVehicles(row) {
      console.log('View details for:', row);
      this.$router.push({ 
        path: 'SelectView',
        query: {
          rowType:'5',
          cus_name:this.cus_name,
          cus_code:this.cus_code
        }
      });
    },
    editItemVehicle(row) {
      console.log('Edit item:', row);
      this.$router.push({ 
        path: 'UpdateView',
        query: {
          rowType:'5',
          cus_name:this.cus_name,
          cus_code:this.cus_code,
          rowData: JSON.stringify({
          ...row, // 複製原始數據
          updateTime: '' // 將 updateTime 設為空字串
          })
        }
      });
    },
    async deleteItemVehicle(row) {
      const result = confirm("您確定要刪除此項目嗎？此操作無法恢復。");
      if (result) {
      console.log('Delete item:', row);
      const req = {
        vehicleId:row.vehicleId,
        deleteTime:''
      };
      console.log('Delete item:', req);
      await axios.post('http://122.116.23.30:3345/main/deleteVehicle', req)
        .then(response => {
          if (response.status === 200 && response.data.returnCode === 0) {
            // 成功提示
            this.$message({
              message: '刪除成功',
              type: 'success'
            });
            this.getselectData();
          } else {
            // 處理非 0 成功代碼
            this.$message({
              message: '刪除失敗',
              type: 'error'
            });
          }
        })
        .catch(error => {
          // 發生錯誤時，顯示錯誤提示
          this.$message({
            message: '刪除失敗，伺服器錯誤',
            type: 'error'
          });
          console.error('Error:', error);
        });
      }
    },
    onVehicle(row) {
      console.log('View details for:', row);
      this.$router.push({ 
        path: 'vehicle',
        query: {
          cus_name:this.cus_name,
          cus_code:this.cus_code,
          license_plate:row.license_plate,
          vehicleId:row.vehicleId
        }
      });
    },
    async getVehicle(){
      await axios.get('http://122.116.23.30:3345/main/selectVehicle')
        .then(response => {
          this.licens = response.data.data.map(item => item.license_plate)
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
    }
  }
};
</script>

<style scoped>

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
.el-select {
  width: 175px
}
.page-title  {
  margin-top: 30px;
  margin-bottom: 30px;
}
.page-title h4 {
    color: #f5bd04;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-input {
  width: 200px;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

.el-table {
  min-width: 900px;
}

.el-table th, .el-table td {
  white-space: nowrap;
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
