<template>
  <ListBar/>
  <div class="page-title"><h2>{{ pageTitle }}</h2></div>
  <div>
    <BreadCrumb :isSpecialPage="true"/>
  </div>
    <el-input v-model="filters.salesperson" placeholder="查詢業務姓名"  style="width: 225px;"></el-input>
    <el-form-item>
    <el-button type="success" @click="dialogVisible = true">新增</el-button>
    </el-form-item>
    <div class="table-container">
      <el-table :data="selses" style="width: 100%">
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
            <i class="fa-solid fa-trash-can"  @click="deleteItem(scope.row)"></i>
          </div>
        </template>
      </el-table-column>
      </el-table>
    </div>
    <div class="pagination-info">
        Showing 1 to 2 of 2
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
        salesperson: ''
      },
      selses: [
        {
          employee_id: 'GF-012',
          employee_name: '湯惠誠',
          job_title: '業務',
          department_code: 'C01',
          department: '業務部'
        },
        {
          employee_id: 'GF-010',
          employee_name: '展億活動整合有限公司',
          job_title: '業務',
          department_code: 'C02',
          department: '經銷商'
        },
      ],
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    
  },
  methods: {
    
    viewDetails(row) {
      console.log('View details for:', row);
      this.$router.push({ 
        path: 'SelectView',
        query: {
          rowType:'6',
          
        }
      });
    },
    editItem(row) {
      console.log('Edit item:', row);
      this.$router.push({ 
        path: 'UpdateView',
        query: {
          rowType:'6',
         
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
