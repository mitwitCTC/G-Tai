<template>
  <ListBar/>
  <div class="page-title"><h2>{{ pageTitle }}</h2></div>
  <div>
    <BreadCrumb :isSpecialPage="true"/>
  </div>
    <el-button type="success" style="margin: 10px;" @click="dialog = true">新增員工</el-button>
    <div class="table-container">
      <el-table :data="currentPageData" style="width: 100%" v-loading="loading">
        <el-table-column prop="employee_id" label="員工編號"  />
        <el-table-column prop="employee_name" label="員工姓名"  />
        <el-table-column prop="job_title" label="職稱" />
        <el-table-column prop="department_code" label="部門代號" />
        <el-table-column prop="department" label="部門名稱" />
        <el-table-column label="操作">
        <template v-slot="scope">
          <div class="action-icons">
            <i class="fas fa-eye " @click="viewDetails(scope.row)"></i>
            <i class="fas fa-edit " @click="editItem(scope.row)"></i>
            <!-- <i class="fa-solid fa-trash-can"  @click="deleteItem(scope.row)"></i> -->
          </div>
        </template>
      </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <div class="pagination-info">
        Showing {{ startItem }} to {{ endItem }} of {{ selses.length }}
      </div>
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="selses.length"
        layout="prev, pager, next, jumper"
        class="pagination"
      />
    </div>

    <!-- 新增員工 -->
 <el-dialog title="新增員工" v-model="dialog" width="50%" :close-on-click-modal="false">
    <el-form :model="form" label-width="120px"> <!-- 统一標籤寬度 -->
      <el-row>
          <el-col :span="8">
        <el-form-item label="員工編號">
          <el-input v-model="form.employee_id" class="small-input"></el-input>
        </el-form-item>
      </el-col>
        <el-col :span="8">
        <el-form-item label="員工姓名">
          <el-input v-model="form.employee_name" class="small-input"></el-input>
        </el-form-item>
      </el-col>
        <el-col :span="8">
        <el-form-item label="職稱">
          <el-input v-model="form.job_title" class="small-input"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
        <el-col :span="8">
      <el-form-item label="部門代號">
        <el-input v-model="form.department_code" class="small-input"></el-input>
      </el-form-item>
    </el-col>
      <el-col :span="8">
      <el-form-item label="部門名稱">
        <el-input v-model="form.department" class="small-input"></el-input>
      </el-form-item>
    </el-col>
  </el-row>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" @click="savePass">送出</el-button>
    </div>
    </template>
  </el-dialog>
</template>


<script>
import ListBar from '@/components/ListBar.vue';
import BreadCrumb from '@/components/BreadCrumb.vue';
import TablePaginated from '@/components/TablePaginated.vue';
import axios from 'axios';

export default {
  components: {
    BreadCrumb,
    ListBar,
    TablePaginated
  },
  data() {
    return {
      loading:false,
      dialog: false,
      filters: {
        salesperson: ''
      },
      form: {
        employee_id:'',
        employee_name:'',
        job_title:'',
        department_code:'',
        department:'',
      },
      selses: [],
      currentPage: 1,
      pageSize: 10
    };
  },
  created() {
    this.getselectData();
  },
  computed: {
    
    // 計算當前頁面顯示的數據
    currentPageData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.selses.slice(start, end);
    },
    // 計算當前頁面顯示的起始和結束項目
    startItem() {
      const start = (this.currentPage - 1) * this.pageSize + 1;
      return Math.min(start, this.selses.length);
    },
    endItem() {
      const end = this.currentPage * this.pageSize;
      return Math.min(end, this.selses.length);
    }
  },
  methods: {
    savePass() {
      const req = this.form;
      axios.post('http://122.116.23.30:3345/main/createSalesman', req)
        .then(response => {
          if (response.status === 200 && response.data.returnCode === 0) {
            // 成功提示
            this.$message({
              message: '新增成功',
              type: 'success'
            });
            this.form = {};
            this.dialog = false
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
    try {
        // 發送 GET 請求到指定的 API
        const response = await axios.get('http://122.116.23.30:3345/main/selectSalesman');
        const salesmanData = response.data.data; // 取得資料中的第一個元素
        // 將資料放入 customers 陣列中
        this.selses=salesmanData;
    } catch (error) {
        console.error('Error fetching customer data:', error);
    }finally {
        this.loading = false;  // 請求完成後關閉加載狀態
      }
  },
  handlePageChange(page) {
      this.currentPage = page;
    },
    viewDetails(row) {
      this.$router.push({ 
        path: 'SelectView',
        query: {
          rowType:'6',
          rowData: JSON.stringify(row)
        }
      });
    },
    editItem(row) {
      this.$router.push({ 
        path: 'UpdateView',
        query: {
          rowType:'6',
          rowData: JSON.stringify({
          ...row, // 複製原始數據
          updateTime: '' // 將 updateTime 設為空字串
          })
        }
      });
    },
    deleteItem(row) {
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

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}


.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
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
