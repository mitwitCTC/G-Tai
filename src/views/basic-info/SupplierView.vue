<template>
  <div>
    <bar/>
    <div class="page-title"><h2>{{ pageTitle }}</h2></div>
    <div>
      <Breadcrumb :isSpecialPage="true"/>
  </div>
    <el-table :data="suppliers" style="width: 100%">
      <el-table-column prop="supplierName" label="供應商名稱" width="150" />
      <el-table-column prop="taxId" label="統編" width="150" />
      <el-table-column prop="address" label="地址" width="150" />
      <el-table-column prop="phone" label="電話" width="150" />
      <el-table-column label="操作" >
        <template v-slot="scope">
          <el-button @click="editSupplier(scope.row)" type="primary" size="small">编辑</el-button>
        </template>
      </el-table-column>
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
      console.log('编辑供應商:', supplier);
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
</style>