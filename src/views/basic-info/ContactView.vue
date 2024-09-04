<template>
  <div>
    <ListBar/>
    <div class="page-title"><h2>{{ pageTitle }}</h2></div>
    <div>
      <BreadCrumb :isSpecialPage="true"/>
    </div>
    <el-button type="primary" @click="dialog = true">新增聯絡人</el-button>
    <div class="page-title"><h5>客戶代號:<h4>{{this.cus_code}}</h4>客戶名稱:<h4>{{this.cus_name}}</h4></h5></div>
    <div class="table-container">
      <el-table :data="paginatedData" style="width: 100%">
        <el-table-column prop="job_title1" label="職稱"></el-table-column>
        <el-table-column prop="gender1" label="性別"></el-table-column>
        <el-table-column prop="name1" label="姓名"></el-table-column>
        <el-table-column prop="mobile1" label="手機/電話"></el-table-column>
        <el-table-column prop="mail1" label="E-MAIL"></el-table-column>
        <el-table-column prop="notes1" label="備註"></el-table-column>
        <el-table-column label="操作">
        <template v-slot="scope">
        <div class="action-icons">
          <!-- <i class="fas fa-eye " @click="viewDetails(scope.row)"></i> -->
          <i class="fas fa-edit " @click="editItem(scope.row)"></i>
          <i class="fa-solid fa-trash-can"  @click="deleteItem(scope.row)"></i>
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
      <el-dialog title="新增聯絡人" v-model="dialog" width="50%">
        <el-form :model="form" label-width="120px"> <!-- 统一標籤寬度 -->
          <el-row style="margin-bottom: 20px">
          <el-form-item label="職稱">
             <el-input v-model="form.job_title1" ></el-input>
          </el-form-item>
          <el-form-item label="性別">
            <el-input v-model="form.gender1" ></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="form.name1" ></el-input>
          </el-form-item>
          <el-form-item label="電話/手機">
            <el-input v-model="form.mobile1" ></el-input>
          </el-form-item>
          <el-form-item label="E-MAIL">
            <el-input v-model="form.email1" ></el-input>
          </el-form-item>
          <el-form-item label="備註">
            <el-input v-model="form.notes1" ></el-input>
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
      cus_code:'',
      cus_name:'',
      dialog: false,
      search: {
        region: '',
        sales: '',
        customerName: ''
      },
      contact: [],
      form: {
        job_title1:'',
        gender1:'',
        name1:'',
        mobile1:'',
        email1:'',
        notes1:''
      },
      currentPage: 1,
      pageSize: 10
    };
  },
  created() {
    this.cus_code = (this.$route.query.cus_code);
    this.cus_name = (this.$route.query.cus_name);
    const postData = {
      customerId:this.cus_code,
    };
    axios.post('http://122.116.23.30:3345/main/searchContact',postData)
        .then(response => {
          this.contact = response.data.data;
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
},
  computed: {
    BreadCrumbItems() {
      // 获取当前路由匹配的所有路由项
      const matched = this.$route.matched;
      // 生成面包屑项
      return matched.map(route => ({
        label: route.meta.BreadCrumb || '',
        path: route.path
      }));
    },
   
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
    handleReset() {
      this.search = {
        region: '',
        sales: '',
        customerName: ''
      };
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    savePass() {
      // 添加保存逻辑
      this.dialog = false;
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
    deleteItem(row) {
      console.log('Delete item:', row);
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
