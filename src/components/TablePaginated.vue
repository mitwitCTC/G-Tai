<template>
    <div class="pagination-container">
      <div class="pagination-info">
        Showing {{ startItem }} to {{ endItem }} of {{ filteredData.length }}
      </div>
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="filteredData.length"
        layout="prev, pager, next, jumper"
        class="pagination"
      />
    </div>
  </template>
  
  <script>
  export default {
    name: 'TablePaginated',
    props: {
      data: {
        type: Array,
        required: true
      },
      filters: {
        type: Object,
        required: true
      },
      currentPage: {
        type: Number,
        required: true
      },
      pageSize: {
        type: Number,
        required: true
      }
    },
    computed: {
      filteredData() {
        return this.data.filter(item => {
          return (
            (this.filters.region === '' || item.region === this.filters.region) &&
            (this.filters.sales === '' || item.salesPerson === this.filters.sales) &&
            (this.filters.customerName === '' || item.customerName.includes(this.filters.customerName))
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
      handlePageChange(page) {
        this.$emit('page-change', page);
      }
    }
  };
  </script>
  
  <style scoped>
  .pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .pagination-info {
    margin-right: 20px;
  }
  
  .pagination {
    display: flex;
  }

  </style>
  