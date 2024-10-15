<template>
    <ListBar/>
    <div class="page-title"><h2>{{ pageTitle }}</h2></div>
    <div>
      <BreadCrumb :isSpecialPage="true"/>
    </div>
    <el-button type="primary" @click="dialog = true">新增聯絡人</el-button>
    <div class="page-title"><h5>客戶代號:<h4>{{this.cus_code}}</h4>客戶名稱:<h4>{{this.cus_name}}</h4></h5></div>
    <div class="table-container">
      <el-table :data="paginatedData" style="width: 100%" v-loading="loading">
        <el-table-column prop="job_title" label="職稱"></el-table-column>
        <el-table-column prop="gender" label="性別"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="手機/電話"></el-table-column>
        <el-table-column prop="mail" label="E-MAIL"></el-table-column>
        <el-table-column prop="notes" label="備註"></el-table-column>
        <el-table-column label="操作">
        <template v-slot="scope">
        <div class="action-icons">
          <!-- <i class="fas fa-eye " @click="viewDetails(scope.row)"></i> -->
          <i class="fas fa-edit " @click="editItem(scope.row)"></i>
          <!-- <i class="fa-solid fa-trash-can"  @click="deleteItem(scope.row)"></i> -->
        </div>
      </template>
      </el-table-column>
    </el-table>
      <div class="pagination-container">
      <div class="pagination-info">
        Showing {{ startItem }} to {{ endItem }} of {{ contact.length }}
      </div>
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="contact.length"
        layout="prev, pager, next, jumper"
        class="pagination"
      />
    </div>
      <!-- 新增聯絡人 -->
      <el-dialog title="新增聯絡人" v-model="dialog" width="50%" :close-on-click-modal="false">
        <el-form :model="form" label-width="120px"> <!-- 统一標籤寬度 -->
          <el-row style="margin-bottom: 20px">
          <el-form-item label="職稱">
             <el-input v-model="form.job_title" ></el-input>
          </el-form-item>
          <el-form-item label="性別">
            <el-select v-model="form.gender" placeholder="選擇性別">
            <el-option label="男" :value="'男'"></el-option>
            <el-option label="女" :value="'女'"></el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="form.name" ></el-input>
          </el-form-item>
          <el-form-item label="電話/手機">
            <el-input v-model="form.mobile" ></el-input>
          </el-form-item>
          <el-form-item label="E-MAIL">
            <el-input v-model="form.mail" ></el-input>
          </el-form-item>
          <el-form-item label="備註">
            <el-input v-model="form.notes" ></el-input>
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
import TablePaginated from '@/components/TablePaginated.vue';
import axios from 'axios';

export default {
  components: {
    BreadCrumb,
    ListBar,
    TablePaginated,
  },

  data() {
    return {
      loading:false,
      cus_code:'',
      cus_name:'',
      dialog: false,
      contact: [],
      form: {
        customerId:'',
        job_title:'',
        gender:'',
        name:'',
        mobile:'',
        mail:'',
        notes:''
      },
      currentPage: 1,
      pageSize: 10
    };
  },
  created() {
    this.cus_code = (this.$route.query.cus_code);
    this.cus_name = (this.$route.query.cus_name);
    this.form.customerId = this.cus_code;
    this.getselectData();
},
  computed: {

    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.contact.slice(start, end);
    },
    startItem() {
      return (this.currentPage - 1) * this.pageSize + 1;
    },
    endItem() {
      return Math.min(this.currentPage * this.pageSize, this.contact.length);
    }
  },
  methods: {
    async getselectData() {
      this.loading = true;  // 開始加載
      const postData = {
      customerId:this.cus_code,
      };
      await axios.post('http://122.116.23.30:3345/main/searchContact',postData)
        .then(response => {
          this.contact = response.data.data;
          this.loading = false;  // 請求完成後關閉加載狀態
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
    },
    savePass() {
      const req = this.form;
      
      // 發送 POST 請求
      axios.post('http://122.116.23.30:3345/main/createContact', req)
        .then(response => {
          console.log(JSON.stringify(req)); // 在請求成功後輸出請求數據
          if (response.status === 200 && response.data.returnCode === 0) {
            // 成功提示
            this.$message({
              message: '新增成功',
              type: 'success'
            });
          
            // 清空表單
            this.form.job_title = '';
            this.form.gender = '';
            this.form.name = '';
            this.form.mobile = '';
            this.form.mail = '';
            this.form.notes = '';

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
    handlePageChange(page) {
      this.currentPage = page;
    },
  
    editItem(row) {
      console.log('Edit item:', row);
      this.$router.push({ 
        path: 'UpdateView',
        query: {
          rowType:'2',
          cus_code:this.cus_code,
          cus_name:this.cus_name,
          rowData: JSON.stringify(row)
        }
      });
    },
    
  }
};
</script>

<style scoped>
.el-select{
  width: 175px;
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
.page-title {
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
