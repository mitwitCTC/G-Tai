<template>
  <div>
    <ListBar />
    <div class="page-title"><h2>{{ pageTitle }}</h2></div>
    <div>
      <BreadCrumb :isSpecialPage="true" />
    </div>
    <div class="filters">
      <el-input v-model="filters.customerId" placeholder="客戶名稱" class="filter-input"></el-input>
    </div>
    <el-table :data="paginatedDiscount" style="width: 100%">
      <el-table-column prop="customerId" label="客戶代號" width="150" />
      <el-table-column prop="customerName" label="客戶名稱" width="450" />
      <el-table-column prop="ProductName" label="油品名稱" width="300" />
      <el-table-column prop="SupplierName" label="廠商名稱" width="300" />
      <el-table-column prop="Discount" label="折讓" width="150" />
      <el-table-column prop="ResponsiblePerson" label="負責業務" width="150" />
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
    }
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
  gap: 10px;
  margin-bottom: 20px;
}

.filter-input {
  width: 200px;
  height: 40px;
}
</style>
