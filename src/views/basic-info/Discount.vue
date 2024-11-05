<template>
  <div>
    <ListBar />
    <div class="page-title"><h2>{{ pageTitle }}</h2></div>
    <div>
      <BreadCrumb :isSpecialPage="true" />
    </div>
    <el-button type="danger" @click="dialog = true">新增折讓</el-button>
    <div class="page-title"><h5>客戶代號:<h4>{{this.cus_code}}</h4>客戶名稱:<h4>{{this.cus_name}}</h4></h5></div>
    <el-table :data="paginatedDiscount" style="width: 100%" v-loading="loading">
      <el-table-column prop="product_name" label="產品名稱" :formatter="formatProduct" width="300" />
      <!-- <el-table-column prop="supplier_name" label="廠商名稱" width="500" /> -->
      <el-table-column prop="discount_float" label="折讓"  />
      <!-- <el-table-column prop="responsible_person" label="負責業務" :formatter="getEmployeeName" width="300" /> -->
      <!-- <el-table-column label="操作">
        <template v-slot="scope">
          <div class="action-icons">
            <i class="fas fa-eye " @click="viewDetails(scope.row)"></i>
            <i class="fas fa-edit " @click="editItem(scope.row)"></i>
            <i class="fa-solid fa-trash-can"  @click="deleteItem(scope.row)"></i>
          </div>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 新增折讓 -->
 <el-dialog title="新增折讓" v-model="dialog" width="50%" :close-on-click-modal="false">
  <el-row style="margin-bottom: 20px">
    <el-form :model="form" label-width="120px" > <!-- 统一標籤寬度 -->
      <el-form-item label="產品名稱">
          <el-select v-model="form.product_name" placeholder="選擇油品">
            <template v-if="product && product.length > 0">
            <el-option
              v-for="id in product"
              :key="id.id"
              :label="id.className"
              :value="id.classId"
            ></el-option>
          </template>
          <template v-else>
            <el-option :label="'全部油品折讓均已登入'" :disabled="true"></el-option>
          </template>
          </el-select>
      </el-form-item>
        <!-- <el-form-item label="廠商名稱">
        <el-select v-model="form.supplier_name" placeholder="選擇廠商">
          <el-option label="台灣中油股份有限公司" :value="'台灣中油股份有限公司'" ></el-option>
        </el-select>
      </el-form-item> -->
        <el-form-item label="折讓">
          <el-input v-model="form.discount_float" @input="validateFloat"  ></el-input>
        </el-form-item>
        <!-- <el-form-item label="負責業務">
        <el-select v-model="form.responsible_person" placeholder="選擇業務">
          <el-option
          v-for="salesman in salesmenData"
          :key="salesman.salesmanId"
          :label="salesman.employee_name"
          :value="salesman.employee_id"
          ></el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
  </el-row>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" @click="savePass">送出</el-button>
    </div>
    </template>
  </el-dialog>
  <el-dialog v-model="isLoading" width="15%" title="請稍後..." :close-on-click-modal="false"></el-dialog>


    <div class="pagination-container">
      <div class="pagination-info">
        Showing {{ startItem }} to {{ endItem }} of {{ DiscountData.length }}
      </div>
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="DiscountData.length"
        layout="prev, pager, next, jumper"
        class="pagination"
      />
    </div>
  </div>
</template>

<script>
import ListBar from '@/components/ListBar.vue';
import BreadCrumb from '@/components/BreadCrumb.vue';
import TablePaginated from '@/components/TablePaginated.vue';
import axios from 'axios';
import { toRaw } from 'vue'; 

export default {
  components: {
    BreadCrumb,
    ListBar,
    TablePaginated
  },
  data() {
    return {
      isLoading:false,
      loading:false,
      dialog:false,
      cus_code:'',
      cus_name:'',
      rowData:[],
      DiscountData: [],
      salesmenData:[],
      product:[],//篩選沒有重複出現的
      productMap:[],
      form:{
        customerId:'',
        discount_float:0
      },
      currentPage: 1,
      pageSize: 10
    };
  },
  async created() {
    this.cus_code = (this.$route.query.cus_code);
    this.cus_name = (this.$route.query.cus_name);
    this.form.customerId = this.cus_code;
    await this.getselectData();
    this.getproduct_name();
  },
  mounted() {
    // 發送 API 請求以獲取業務資料
    axios.get('http://122.116.23.30:3345/main/selectSalesman')
      .then(response => {
        this.salesmenData = response.data.data; // 獲取到數據後將其存儲到 salesmenData
      })
      .catch(error => {
        // 處理錯誤
        console.error('API request failed:', error);
      });
  },
  computed: {
   
    paginatedDiscount() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.DiscountData.slice(start, end);
    },
    startItem() {
      const start = (this.currentPage - 1) * this.pageSize + 1;
      return Math.min(start, this.DiscountData.length);
    },
    endItem() {
      const end = this.currentPage * this.pageSize;
      return Math.min(end, this.DiscountData.length);
    },
  },
  methods: {
    getitem(){
      let discountProductNames = new Set(this.DiscountData.map(item => item.product_name));
      this.product = this.product.filter(
      item => !discountProductNames.has(item.classId)
      );
    },
    async getproduct_name() {
      await axios.get('http://122.116.23.30:3345/main/selectProduct')
        .then(response => {
          this.productMap = response.data.data;
          this.product=this.productMap
          this.getitem();
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
    },
    async getselectData(type) {
      this.loading = true;
      const postData = {
      customerId:this.cus_code,
      };
      await axios.post('http://122.116.23.30:3345/main/searchDiscount',postData)
        .then(response => {
          this.DiscountData = response.data.data;
          this.loading = false;  // 請求完成後關閉加載狀態
          if(type==1){
            this.getitem();
          }
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
  },
  async savePass() {
    if((!this.form.discount_float)||(!this.form.product_name)){
      this.$message({
              message: '欄位不得為空',
              type: 'error'
            });
            return
    }
    this.isLoading = true;
      const req = this.form;
      // 發送 POST 請求
      axios.post('http://122.116.23.30:3345/main/createDiscount', req)
        .then(response => {
          if (response.status === 200 && response.data.returnCode === 0) {
            // 成功提示
            this.$message({
              message: '新增成功',
              type: 'success'
            });

            // 清空表單
            this.form.product_name = '';
            this.form.supplier_name = '';
            this.form.discount_float = '';
            this.form.responsible_person = '';

            // 關閉對話框
            this.dialog = false;

            // 刷新數據
            this.getselectData(1);
            this.isLoading = false;
          } else {
            // 處理非 0 成功代碼
            this.$message({
              message: '新增失敗',
              type: 'error'
            });
            this.isLoading = false;
          }
        })
        .catch(error => {
          // 發生錯誤時，顯示錯誤提示
          this.$message({
            message: '新增失敗，伺服器錯誤',
            type: 'error'
          });
          this.isLoading = false;
          console.error('Error:', error);
        });
    }, 
    validateFloat() {
      const regex = /^\d*\.?\d{0,3}$/; // 限制最多兩位小數
      if (!regex.test(this.form.discount_float)) {
        this.form.discount_float = this.form.discount_float.slice(0, -1);
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    formatProduct(product_name) {
      if (!this.productMap || this.productMap.length === 0) {
        return '正在加載...';
      }
      // 使用 find 方法找到對應的 employee_name
      const responsible = toRaw(product_name);
      const employee = this.productMap.find(item => item.classId == responsible.product_name);
      return employee == null ? '' : (employee ? employee.className : '未知');
    },
    getEmployeeName(responsible_person) {
      // 如果 salesmenData 仍為空，則返回空或其他提示
      if (!this.salesmenData || this.salesmenData.length === 0) {
        return '正在加載...';
      }
      // 使用 find 方法找到對應的 employee_name
      const responsible = toRaw(responsible_person);
      const employee = this.salesmenData.find(item => item.employee_id == responsible.responsible_person);
      return employee == null ? '' : (employee ? employee.employee_name : '未知員工');
    },
    editItem(row) {
      this.$router.push({ 
        path: 'UpdateView',
        query: {
          rowType:'4',
          cus_code:this.cus_code,
          cus_name:this.cus_name,
          rowData: JSON.stringify({
          ...row, // 複製原始數據
          updateTime: '' // 將 updateTime 設為空字串
          })
        }
      });
    },
    async deleteItem(row) {
      const result = confirm("您確定要刪除此項目嗎？此操作無法恢復。");
      if (result) {
      const req = {
        discountId:row.discountId,
        updated:'',
        deleteTime:''
      };
      await axios.post('http://122.116.23.30:3345/main/deleteDiscount', req)
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
  padding-right: 1100px; /* 可选: 添加右边距以与分页控件分开 */
  white-space: nowrap;
}
.pagination {
  flex: 1;
  text-align: right;
}
.page-title {
  margin-top: 30px;
  margin-bottom: 30px;
}
.page-title h4 {
    color: #f5bd04;
}
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-input {
  width: 200px;
  height: 40px;
}
.action-icons {
  display: flex;
  gap: 20px; /* 调整图标之间的间距 */
}
.action-icons i {
  cursor: pointer;
  font-size: 20px; /* 调整图标的大小 */
}
.el-input {
  width: 300px
}
.el-select {
  width: 300px
}

</style>
