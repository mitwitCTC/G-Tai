<template>
  <div>
    <ListBar/>
    <div class="page-title"><h2>{{ pageTitle }}</h2></div>
    <div>
      <BreadCrumb :isSpecialPage="true"/>
    </div>
    <div class="page-title"><h5>客戶代號:G2200696 客戶名稱:客戶一</h5></div>
    <div>
      
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
import { Search } from '@element-plus/icons-vue'

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
          customerName:row.customerName
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
.demo-form-inline .el-form-item {
  margin-right: 10px;
}

.custom-select .el-input {
  min-width: 150px;
}

.small-input .el-input__inner {
  width: 100%;
}
.custom-select {
  width: 200px; /* 调整宽度 */
  height: 40px; /* 调整高度 */
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
