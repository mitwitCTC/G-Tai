<template>
  <div>
    <bar/>
    <div class="page-title"><h2>{{ pageTitle }}</h2></div>
    <div>
      <Breadcrumb :isSpecialPage="true"/>
  </div>
    <div class="filters">
      <el-input v-model="filters.billGroup" placeholder="帳單組別" class="filter-input"></el-input>
      <el-input v-model="filters.customerName" placeholder="客戶名稱" class="filter-input"></el-input>
    </div>
      <el-button type="success" @click="dialogVisible = true">新增車籍</el-button>
    <el-table :data="filteredVehicles" style="width: 100%">
      <el-table-column prop="vehicleId" label="車籍編號" width="150" />
      <el-table-column prop="licensePlate" label="車牌號碼" width="150" />
      <el-table-column prop="customerName" label="客戶名稱" width="150" />
      <el-table-column prop="billId" label="帳單編號" width="150" />
      <el-table-column prop="cardNumber" label="卡號" width="150" />
      <el-table-column prop="cardType" label="卡片類別" width="150" />
      <el-table-column prop="fuelType" label="使用油品" width="150" />
      <el-table-column prop="cardStartDate" label="到卡日期" width="150" />
      <el-table-column prop="cardEndDate" label="停卡日期" width="150" />
      <el-table-column prop="vehicleType" label="車輛型態" />
    </el-table>
  </div>
</template>

<script>
import bar from '@/components/bar.vue'
import Breadcrumb from '@/components/Breadcrumb.vue';
export default {
  components: {
    Breadcrumb,
    bar
  },
data() {
    return {
      filters: {
        billGroup: '',
        customerName: ''
      },
      vehicles: [
        {
          vehicleId: 'V001',
          licensePlate: 'ABC-123',
          customerName: '客戶A',
          billId: 'B001',
          cardNumber: '12345678',
          cardType: '信用卡',
          fuelType: '汽油',
          cardStartDate: '2023-01-01',
          cardEndDate: '2024-01-01',
          vehicleType: '轎車'
        },
        {
          vehicleId: 'V002',
          licensePlate: 'XYZ-789',
          customerName: '客戶B',
          billId: 'B002',
          cardNumber: '87654321',
          cardType: '加油卡',
          fuelType: '柴油',
          cardStartDate: '2023-02-01',
          cardEndDate: '2024-02-01',
          vehicleType: '貨車'
        }
      ]
    };
  },
  computed: {
    filteredVehicles() {
      return this.vehicles.filter(vehicle => {
        return (
          vehicle.customerName.includes(this.filters.customerName) &&
          (this.filters.billGroup ? vehicle.billId.includes(this.filters.billGroup) : true)
        );
      });
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
.filter-input{
  width: 200px; /* 調整寬度 */
  height: 40px; /* 調整高度 */

}
</style>