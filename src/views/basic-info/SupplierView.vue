<template>
  <div>
    <ListBar/>
    <div class="page-title"><h2>{{ pageTitle }}</h2></div>
    <div>
      <BreadCrumb :isSpecialPage="true"/>
  </div>
  <div class="card-container">
    <el-card v-for="supplier in suppliers" :key="supplier.supplierName" class="supplier-card" shadow="hover">
      <template v-slot:header>
<div  class="card-header">
        <span>{{ supplier.supplierName }}</span>
      </div>
</template>
      <div class="card-body">
        <p><strong>統編:</strong> {{ supplier.taxId }}</p>
        <p><strong>地址:</strong> {{ supplier.address }}</p>
        <p><strong>電話:</strong> {{ supplier.phone }}</p>
      </div>
      <div class="card-footer">
        <el-button @click="editSupplier(supplier)" type="primary" size="small">编辑</el-button>
      </div>
    </el-card>
  </div>
  </div>
</template>

<script>
import ListBar from '@/components/ListBar.vue'
import BreadCrumb from '@/components/BreadCrumb.vue';
export default {
  components: {
    BreadCrumb,
    ListBar
  },
data() {
    return {
      suppliers: [
        {
          supplierName: '中油',
          taxId: '12345678',
          address: '台北市中正區',
          phone: '12345678'
        },
        {
          supplierName: '台塑',
          taxId: '87654321',
          address: '台中市西屯區',
          phone: '87654321'
        }
      ]
    };
  },
  methods: {
    editSupplier(supplier) {
      // 在这里添加编辑供應商的逻辑
    }
  }
};
</script>

<style scoped>
.page-title {
  margin-top: 30px; 
  margin-bottom: 30px; 
  }
  .card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.supplier-card {
  width: 300px;
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.card-body {
  padding: 16px;
}

.card-footer {
  padding: 16px;
  text-align: right;
}
</style>