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
      <el-table :data="bills" style="width: 100%">
        <el-table-column prop="account_sortId" label="帳單編號" width="150" />
        <el-table-column prop="acc_name" label="帳單名稱" width="200" />
        <el-table-column prop="use_number" label="開立統編" width="150" />
        <el-table-column prop="recipient_name" label="收件人姓名" width="300" />
        <el-table-column prop="billing_method" label="寄送方式" width="150" />
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
    <div class="pagination-info">
        Showing 1 to 0 of 0
    </div>
      <div class="page-title"><h2>車籍資料維護</h2></div>
      <el-button type="warning" @click="dialog = true">新增車籍</el-button>
      <el-table :data="currentPageData" style="width: 100%">
        <el-table-column prop="account_sortId" label="帳單編號" width="300" />
        <el-table-column prop="license_plate" label="車牌號碼" width="300" />
        <el-table-column prop="vehicle_type" label="車輛型態" width="300" />
        <el-table-column prop="product_name" label="油品名稱" width="350" />
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
        Showing {{ startItem }} to {{ endItem }} of {{ vehicles.length }}
      </div>
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="vehicles.length"
        layout="prev, pager, next, jumper"
        class="pagination"
      />
    </div>
    <div style="margin-bottom: 50px;"></div>
    

    <!-- 新增帳單資訊 -->
    <el-dialog title="新增帳單資訊" v-model="dialogBill" width="50%">
      <el-form :model="form" label-width="120px"> <!-- 统一標籤寬度 -->
        <el-row style="margin-bottom: 20px">
          <el-form-item label="帳單名稱">
            <el-input v-model="form.acc_name" ></el-input>
          </el-form-item>
          <el-form-item label="開立統編">
            <el-input v-model="form.use_number" ></el-input>
          </el-form-item>
          <el-form-item label="發票開立人名稱">
            <el-input v-model="form.invoice_name" ></el-input>
          </el-form-item>
          <el-form-item label="帳單寄送方式">
          <el-select v-model="form.billing_method" placeholder="選擇方式">
            <el-option label="MAIL" :value="1"></el-option>
            <el-option label="平信" :value="2"></el-option>
            <el-option label="官方LINE" :value="3"></el-option>
            <el-option label="掛號" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址/E-Mail">
          <el-input v-model="form.address_email" ></el-input>
        </el-form-item>
        <el-form-item label="對帳單列印">
          <el-input v-model="form.statement_print" ></el-input>
        </el-form-item>
        <el-form-item label="收件人姓名">
          <el-input v-model="form.recipient_name" ></el-input>
        </el-form-item>
        <el-form-item label="帳單聯絡人">
         <el-input v-model="form.acc_contact" ></el-input>
        </el-form-item>
        <el-form-item label="對帳單備註資訊" style="width: 1000px">
          <el-input v-model="form.statement_notes" type="textarea" ></el-input>
        </el-form-item>
        <el-form-item label="對帳單注意事項" style="width: 1000px">
          <el-input v-model="form.statement_remarks" type="textarea" ></el-input>
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

       <!-- 新增車籍資訊 -->
       <el-dialog title="新增車籍資訊" v-model="dialog" width="50%">
        <el-form :model="form" label-width="120px"> <!-- 统一標籤寬度 -->
          <el-row style="margin-bottom: 20px">
            <el-form-item label="帳單編號">
          <el-select v-model="form.account_sortId" placeholder="選擇帳單編號">
            <el-option label="B001" :value="1"></el-option>
            <el-option label="B002" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="車牌號碼">
          <el-input v-model="form.license_plate" ></el-input>
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
            <el-option label="95無鉛汽油" :value="1"></el-option>
            <el-option label="92無鉛汽油" :value="2"></el-option>
            <el-option label="98無鉛汽油" :value="5"></el-option>
            <el-option label="超級柴油" :value="6"></el-option>
            <el-option label="尿素溶液" :value="17"></el-option>
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

export default {
  components: {
    BreadCrumb,
    ListBar,
 
  },
  data() {
    return {
      cus_code:'',
      cus_name:'',
      dialogBill: false,
      dialog: false,
      rowData:[],
      bills: [],
      vehicles: [],
      form:{
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
        account_sortId:'',
        license_plate:'',
        vehicle_type:'',
        product_name:''
      },
      currentPage: 1,
      pageSize: 10
    };
  },
  created() {
    // this.rowData = JSON.parse(this.$route.query.rowData);
    this.cus_code = (this.$route.query.cus_code);
    this.cus_name = (this.$route.query.cus_name);
    const postData = {
      customerId:this.cus_code,
    };
      axios.post('http://122.116.23.30:3345/main/searchAccount_sort',postData)
        .then(response => {
          this.bills = response.data.data;
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
        axios.post('http://122.116.23.30:3345/main/searchVehicle',postData)
        .then(response => {
          this.vehicles = response.data.data;
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
  },
  computed: {
   // 計算當前頁面顯示的數據
   currentPageData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.vehicles.slice(start, end);
    },
    // 計算當前頁面顯示的起始和結束項目
    startItem() {
      const start = (this.currentPage - 1) * this.pageSize + 1;
      return Math.min(start, this.vehicles.length);
    },
    endItem() {
      const end = this.currentPage * this.pageSize;
      return Math.min(end, this.vehicles.length);
    },
  },
  methods: {
    handlePageChange(page) {
      this.currentPage = page;
    },
    viewDetails(row) {
      console.log('View details for:', row);
      this.$router.push({ 
        path: 'SelectView',
        query: {
          rowType:'3',
          cus_name:this.cus_name,
          cus_code:this.cus_code
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
          cus_code:this.cus_code
        }
      });
    },
    deleteItem(row) {
      console.log('Delete item:', row);
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
          rowData: JSON.stringify(row)
        }
      });
    },
    deleteItemVehicle(row) {
      console.log('Delete item:', row);
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
