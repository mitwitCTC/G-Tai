<template>
    <bar/>
    <div class="page-title"><h2>{{ pageTitle }}</h2></div>
    <div>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="區域">
          <el-select v-model="search.region" placeholder="選擇區域" class="custom-select">
            <el-option v-for="item in regions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="負責業務">
          <el-select v-model="search.sales" placeholder="選擇業務" class="custom-select">
            <el-option v-for="item in salesPeople" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客戶名稱">
          <el-input v-model="search.customerName" placeholder="輸入客戶名稱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item>
        <el-button type="success" @click="dialog = true">新增客戶</el-button>
      </el-form-item>
      </el-form>
  
      <el-table :data="filteredData" style="width: 100%">
        <el-table-column prop="customerCode" label="客戶代號"></el-table-column>
        <el-table-column prop="customerName" label="客戶名稱"></el-table-column>
        <el-table-column prop="salesPerson" label="負責業務"></el-table-column>
        <el-table-column prop="virtualAccount" label="虛擬帳號"></el-table-column>
        <el-table-column prop="region" label="區域"></el-table-column>
        <el-table-column prop="industry" label="產業類別"></el-table-column>
        <el-table-column prop="estimatedFuel" label="預估加油量"></el-table-column>
        <el-table-column prop="phone" label="公司電話"></el-table-column>
        <el-table-column prop="fax" label="傳真號碼"></el-table-column>
      </el-table>
    <!-- 新增商家 -->
     <el-dialog title="新增商家" :visible.sync="dialog">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" @click="savePass">送出</el-button>
      </div>
    </el-dialog>
    </div>
  </template>
  <script>
  import bar from '@/components/bar.vue'
  export default {
    components: {
    bar
  },
    data() {
      return {
        dialog: false,
        search: {
          region: '',
          sales: '',
          customerName: ''
        },
        regions: [
          { value: 'north', label: '北部' },
          { value: 'south', label: '南部' },
          // 添加更多區域
        ],
        salesPeople: [
          { value: 'john', label: 'John' },
          { value: 'jane', label: 'Jane' },
          // 添加更多業務員
        ],
        customers: [
          {
            customerCode: 'C001',
            customerName: '客戶一',
            salesPerson: 'John',
            virtualAccount: '1234567890',
            region: 'north',
            industry: 'IT',
            estimatedFuel: '1000L',
            phone: '123-456-7890',
            fax: '123-456-7891'
          },
          {
            customerCode: 'C002',
            customerName: '客戶二',
            salesPerson: 'Jane',
            virtualAccount: '2345678901',
            region: 'south',
            industry: 'Finance',
            estimatedFuel: '2000L',
            phone: '123-456-7892',
            fax: '123-456-7893'
          }
          // 添加更多客戶
        ]
      };
    },
    computed: {
      filteredData() {
        return this.customers.filter(customer => {
          return (
            (this.search.region === '' || customer.region === this.search.region) &&
            (this.search.sales === '' || customer.salesPerson === this.search.sales) &&
            (this.search.customerName === '' || customer.customerName.includes(this.search.customerName))
          );
        });
      }
    },
    methods: {
      handleReset() {
        this.search = {
          region: '',
          sales: '',
          customerName: ''
        };
      },
    }
  };
  </script>
  
  <style scoped>
  .demo-form-inline {
    margin-bottom: 20px;
  }
  .custom-select {
  width: 200px; /* 調整寬度 */
  height: 40px; /* 調整高度 */
    }
.page-title {
    margin-top: 30px; 
    margin-bottom: 30px; 
    }
  </style>
  