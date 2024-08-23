<template>
  <div>
    <ListBar />
    <div class="page-title"><h2>{{ pageTitle }}</h2></div>
    <div>
      <BreadCrumb :isSpecialPage="true" />
    </div>
    <el-button type="warning" @click="dialogVisible = true">新增車籍</el-button>
    <div class="page-title"><h5>客戶代號:<h4>G2200696</h4>客戶名稱:<h4>客戶一</h4>車牌號碼:<h4>ACC-1234</h4></h5></div>
    <el-table :data="vehicles" style="width: 100%">
      <el-table-column prop="card_number" label="卡號" width="200" />
      <el-table-column prop="card_type" label="卡片類別" width="150" />
      <el-table-column prop="upload_time" label="上傳中油時間" width="150" />
      <el-table-column prop="upload_reason" label="上傳中油原因" width="150" />
      <el-table-column prop="card_arrival_date" label="到卡日期" width="150" />
      <el-table-column prop="card_stop_date" label="停卡日期" width="150" />
      <el-table-column prop="notes" label="備註" />
      <el-table-column prop="vehicle_change_reason" label="車輛異動-因素" />
      <el-table-column label="操作">
        <template v-slot="scope">
          <div class="action-icons">
            <i class="fas fa-edit " @click="editItem(scope.row)"></i>
            <i class="fa-solid fa-trash-can"  @click="deleteItem(scope.row)"></i>
          </div>
        </template>
    </el-table-column>
    </el-table>
    <div class="pagination-info">
        Showing 1 to 0 of 0
      </div>
    
  </div>
</template>

<script>
import ListBar from '@/components/ListBar.vue';
import BreadCrumb from '@/components/BreadCrumb.vue';


export default {
  components: {
    BreadCrumb,
    ListBar,
  },
  data() {
    return {
      filters: {
        billGroup: '',
        customerName: ''
      },
      vehicles: [
        {
          card_number: '#121611200607123495',
          card_type: '汽油',
          upload_time: '2024-05-05',
          upload_reason: '2024-05-05',
          card_arrival_date: '2023-01-01',
          card_stop_date: '2023-01-01',
          notes: '無',
          vehicle_change_reason: '無'
        },
        {
          card_number: '#121611200607123495',
          card_type: '汽油',
          upload_time: '12345678',
          upload_reason: '2024-05-05',
          card_arrival_date: '2023-01-01',
          card_stop_date: '2023-01-01',
          notes: '無',
          vehicle_change_reason: '無'
        },
      ],
      
    };
  },
  computed: {
   
  },
  methods: {
   
    editItem(row) {
      console.log('Edit item:', row);
      this.$router.push({ 
        path: 'UpdateView',
        query: {
          rowType:'7',
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
