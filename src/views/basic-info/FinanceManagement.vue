<template>
  <ListBar/>
  <div class="page-title"><h2>{{ pageTitle }}</h2></div>
  <div>
      <BreadCrumb/>
  </div>
  <div class="table-container">
        <el-table :data="cus_message" style="width: 100%">
          <el-table-column prop="account_sortId" label="帳單編號" width="150" />
          <el-table-column prop="customerId" label="客戶代號" width="150" />
          <el-table-column prop="cus_name" label="客戶名稱" width="300" />
          <el-table-column
            prop="transaction_mode"
            label="交易模式"
            width="100"
          />
          <el-table-column prop="invoice_name" label="發票抬頭" width="300" />
          <el-table-column prop="acc_name" label="帳單組別" width="250" />
          <el-table-column label="操作">
          <template v-slot="scope">
            <div class="action-icons">
              <i class="fas fa-eye " @click="editItemVehicle(scope.row)"></i>
              <i class="fa-regular fa-copy"  @click="deleteItemVehicle(scope.row)"></i>
            </div>
          </template>
       </el-table-column>
        </el-table>
      </div>
</template>

<script>
import ListBar from '@/components/ListBar.vue'
import BreadCrumb from '@/components/BreadCrumb.vue';
import axios from 'axios';
export default {
  components: {
    BreadCrumb,
    ListBar
  },
data() {
  return {
    cus_message:[
      {
        account_sortId:'12',
        customerId:'G1308719',
        cus_name:'測試',
        transaction_mode:'12'
      }
    ]
  };
},
method:{
  viewDetailVehicles(row) {
      this.$router.push({ 
        path: 'SelectView',
        query: {
          rowType:'5',
          cus_name:this.cus_name,
          cus_code:this.cus_code
        }
      });
    },
    editItemVehicle(row) {
      this.$router.push({ 
        path: 'UpdateView',
        query: {
          rowType:'5',
          cus_name:this.cus_name,
          cus_code:this.cus_code,
          rowData: JSON.stringify({
          ...row, // 複製原始數據
          updateTime: '' // 將 updateTime 設為空字串
          })
        }
      });
    },
}
};
</script>

<style scoped>
.page-title {
  margin-top: 30px; 
  margin-bottom: 30px; 
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