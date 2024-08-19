<template>
  <div>
    <ListBar />
    <div class="page-title"><h2>{{ pageTitle }}</h2></div>
    <div>
      <BreadCrumb :isSpecialPage="true" />
    </div>
    <div class="filters">
      <el-select v-model="filters.area" placeholder="區域" class="filter-input">
        <el-option label="北部" value="north"></el-option>
        <el-option label="中部" value="central"></el-option>
        <el-option label="南部" value="south"></el-option>
        <el-option label="東部" value="east"></el-option>
      </el-select>
      <el-select v-model="filters.salesperson" placeholder="負責業務" class="filter-input">
        <el-option label="業務1" value="sales1"></el-option>
        <el-option label="業務2" value="sales2"></el-option>
        <el-option label="業務3" value="sales3"></el-option>
      </el-select>
      <el-input v-model="filters.customerName" placeholder="客戶名稱" class="filter-input"></el-input>
    </div>
    <el-form-item>
      <el-button type="success" @click="dialogVisible = true">新增帳單</el-button>
    </el-form-item>
    <div class="table-container">
      <el-table :data="paginatedBills" style="width: 100%">
        <el-table-column prop="billId" label="帳單編號" width="150" />
        <el-table-column prop="customerId" label="客戶編號" width="150" />
        <el-table-column prop="customerName" label="客戶名稱" width="150" />
        <el-table-column prop="transactionMode" label="交易模式" width="150" />
        <el-table-column prop="taxId" label="開立統編" width="150" />
        <el-table-column prop="recipientName" label="收件人姓名" width="150" />
        <el-table-column prop="recipientTitle" label="收件人抬頭" width="150" />
        <el-table-column prop="deliveryMethod" label="寄送方式" width="150" />
        <el-table-column prop="deliveryAddress" label="收件地址" />
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
    <TablePaginated
      :data="filteredBills"
      :filters="filters"
      :currentPage="currentPage"
      :pageSize="pageSize"
      @page-change="handlePageChange"
    />
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
    TablePaginated
  },
  data() {
    return {
      filters: {
        area: '',
        salesperson: '',
        customerName: ''
      },
      bills: [
        {
          billId: 'B001',
          customerId: 'C001',
          customerName: '客戶A',
          transactionMode: '現金',
          taxId: '12345678',
          recipientName: '張三',
          recipientTitle: '經理',
          deliveryMethod: '快遞',
          deliveryAddress: '台北市中正區'
        },
        {
          billId: 'B002',
          customerId: 'C002',
          customerName: '客戶B',
          transactionMode: '刷卡',
          taxId: '87654321',
          recipientName: '李四',
          recipientTitle: '主任',
          deliveryMethod: '郵寄',
          deliveryAddress: '台中市西屯區'
        }
      ],
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    filteredBills() {
      return this.bills.filter(bill => {
        return (
          bill.customerName.includes(this.filters.customerName) &&
          (this.filters.area ? bill.deliveryAddress.includes(this.filters.area) : true) &&
          (this.filters.salesperson ? bill.recipientTitle.includes(this.filters.salesperson) : true)
        );
      });
    },
    paginatedBills() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredBills.slice(start, end);
    }
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
          customerName:row.customerName
        }
      });
    },
    editItem(row) {
      console.log('Edit item:', row);
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

@media (max-width: 768px) {
  .filter-input {
    width: 100%;
    margin-bottom: 10px;
  }

  .filters {
    flex-direction: column;
    align-items: stretch;
  }
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
