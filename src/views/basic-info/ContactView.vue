<template>
  <div>
    <ListBar/>
    <div class="page-title"><h2>{{ pageTitle }}</h2></div>
    <div>
      <BreadCrumb :isSpecialPage="true"/>
    </div>
    <el-button type="primary" @click="dialogVisible = true">新增聯絡人</el-button>
    <div class="page-title"><h5>客戶代號:<h4>{{rowData.cus_code}}</h4>客戶名稱:<h4>{{rowData.cus_name}}</h4></h5></div>
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

      <TablePaginated
        :data="customers"
        :filters="search"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @page-change="handlePageChange"
      />

      <!-- 新增客戶 -->
      <el-dialog title="新增客戶" v-model="dialog" width="80%">
        <el-form :model="form">
          <el-row>
            <el-col :span="8">
              <el-form-item label="客戶名稱">
                <el-input v-model="form.customerName" class="small-input"></el-input>
              </el-form-item>
            </el-col>
            <!-- 省略其他表单字段 -->
          </el-row>
          <!-- 省略其他表单行 -->
          <template v-slot:footer>
      <div  class="dialog-footer">
            <el-button @click="dialog = false">取消</el-button>
            <el-button type="primary" @click="savePass">送出</el-button>
          </div>
</template>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ListBar from '@/components/ListBar.vue';
import BreadCrumb from '@/components/BreadCrumb.vue';
import TablePaginated from '@/components/TablePaginated.vue';


export default {
  components: {
    BreadCrumb,
    ListBar,
    TablePaginated,
  },
  data() {
    return {
      dialog: false,
      search: {
        region: '',
        sales: '',
        customerName: ''
      },
      rowData:[],
      customers: [
        {
          job_title1: '承辦',
          gender1: '男',
          name1: 'John',
          mobile1: '1234567890',
          mail1: 'north@111111.com',
          notes1: 'IT'
        },
        {
          job_title1: '承辦',
          gender1: '男',
          name1: 'John',
          mobile1: '1234567890',
          mail1: 'north@111111.com',
          notes1: 'IT'
        },
      ],
      form: {
        customerName: '',
        responsibleBusiness: '',
        virtualAccount: '',
        region: '',
        industryType: '',
        estimatedFuelAmount: '',
        companyPhone: '',
        faxNumber: '',
        taxId: '',
        companyTitle: '',
        frontPassword: '',
        contractStartDate: '',
        contractEndDate: '',
        notificationMethod: '',
        lowWaterValue: '',
        registrationAddress: '',
        contactAddress: '',
        paymentMethod: '',
        deposit: '',
        contractRemarks: ''
      },
      currentPage: 1,
      pageSize: 10
    };
  },
  created() {
  this.rowData = JSON.parse(this.$route.query.rowData);
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
    filteredData() {
      return this.customers.filter(customer => {
        return (
          (this.search.region === '' || customer.region === this.search.region) &&
          (this.search.sales === '' || customer.salesPerson === this.search.sales) &&
          (this.search.customerName === '' || customer.customerName.includes(this.search.customerName))
        );
      });
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredData.slice(start, end);
    },
    startItem() {
      return (this.currentPage - 1) * this.pageSize + 1;
    },
    endItem() {
      return Math.min(this.currentPage * this.pageSize, this.filteredData.length);
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
          cus_code:this.rowData.cus_code,
          cus_name:this.rowData.cus_name,
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
