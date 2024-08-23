<template>
  <div>
    <ListBar />
    <div class="page-title"><h2>{{ pageTitle }}</h2></div>
    <div>
      <BreadCrumb :isSpecialPage="true" />
    </div>
    <el-button type="danger" @click="dialogVisible = true">新增折讓</el-button>
    <div class="page-title"><h5>客戶代號:<h4>G2200696</h4>客戶名稱:<h4>客戶一</h4></h5></div>

    <el-table :data="paginatedDiscount" style="width: 100%">
      <el-table-column prop="ProductName" label="油品名稱" width="300" />
      <el-table-column prop="SupplierName" label="廠商名稱" width="500" />
      <el-table-column prop="Discount" label="折讓" width="250" />
      <el-table-column prop="ResponsiblePerson" label="負責業務" width="300" />
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
      :data="filteredDiscount"
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
        customerId: ''
      },
      DiscountData: [
        {
          customerId: 'G220001',
          customerName: '中森股份有限公司',
          ProductName: '尿素溶液',
          SupplierName: '台灣中油股份有限公司',
          Discount: '1.2',
          ResponsiblePerson: '魯孝亜'
        },
        {
          customerId: 'G220002',
          customerName: '中森股份有限公司',
          ProductName: '尿素溶液',
          SupplierName: '台灣中油股份有限公司',
          Discount: '1.2',
          ResponsiblePerson: '魯孝亜'
        }
      ],
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    filteredDiscount() {
      return this.DiscountData.filter(vehicle => {
        return (
          vehicle.customerId.includes(this.filters.customerId)
        );
      });
    },
    paginatedDiscount() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredDiscount.slice(start, end);
    }
  },
  methods: {
    handlePageChange(page) {
      this.currentPage = page;
    },
    
    editItem(row) {
      console.log('Edit item:', row);
      this.$router.push({ 
        path: 'UpdateView',
        query: {
          rowType:'4',
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
</style>
