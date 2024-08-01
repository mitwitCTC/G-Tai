<template>
  <div>
    <ListBar/>
    <div class="page-title"><h2>{{ pageTitle }}</h2></div>
    <div>
      <BreadCrumb :isSpecialPage="true"/>
    </div>
    
    <div>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="區域">
          <el-select v-model="search.region" placeholder="選擇區域" class="custom-select">
            <el-option v-for="item in regions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="負責業務">
          <el-select v-model="search.sales" placeholder="選擇業務" class="custom-select">
            <el-option v-for="item in salesPeople" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客戶名稱">
          <el-input v-model="search.customerName" placeholder="輸入客戶名稱"  icon="search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="dialog = true">新增客戶</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="paginatedData" style="width: 100%">
        <el-table-column prop="customerCode" label="客戶代號"></el-table-column>
        <el-table-column prop="customerName" label="客戶名稱"></el-table-column>
        <el-table-column prop="salesPerson" label="負責業務"></el-table-column>
        <el-table-column prop="virtualAccount" label="虛擬帳號"></el-table-column>
        <el-table-column prop="region" label="區域"></el-table-column>
        <el-table-column prop="industry" label="產業類別"></el-table-column>
        <el-table-column prop="estimatedFuel" label="預估加油量"></el-table-column>
        <el-table-column prop="phone" label="公司電話"></el-table-column>
        <el-table-column prop="fax" label="傳真號碼"></el-table-column>
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
      regions: [
        { value: 'north', label: '北部' },
        { value: 'south', label: '南部' },
        // 添加更多區域
      ],
      salesPeople: [
        { value: 'john', label: 'John' },
        { value: 'jane', label: 'Jane' },
        // 添加更多業務員
      ],
      customers: [
        {
          customerCode: 'C001',
          customerName: '客戶一',
          salesPerson: 'John',
          virtualAccount: '1234567890',
          region: 'north',
          industry: 'IT',
          estimatedFuel: '1000L',
          phone: '123-456-7890',
          fax: '123-456-7891'
        },
        {
          customerCode: 'C002',
          customerName: '客戶二',
          salesPerson: 'Jane',
          virtualAccount: '2345678901',
          region: 'south',
          industry: 'Finance',
          estimatedFuel: '2000L',
          phone: '123-456-7892',
          fax: '123-456-7893'
        },
        // 添加更多客戶
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
    }
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
</style>
