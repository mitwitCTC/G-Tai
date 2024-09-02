<template>
  <div>
    <ListBar />
    <div class="page-title"><h2>{{ pageTitle }}</h2></div>
    <div>
      <BreadCrumb :isSpecialPage="true" />
    </div>
    <el-button type="success" @click="dialogVisible = true">新增帳單資料</el-button>
    <div class="page-title"><h5>客戶代號:<h4>{{rowData.cus_code}}</h4>客戶名稱:<h4>{{rowData.cus_name}}</h4></h5></div>
    <div class="table-container">
      <el-table :data="bills" style="width: 100%">
        <el-table-column prop="billId" label="帳單編號" width="150" />
        <el-table-column prop="acc_name" label="帳單名稱" width="150" />
        <el-table-column prop="taxId" label="開立統編" width="150" />
        <el-table-column prop="recipientName" label="收件人姓名" width="150" />
        <el-table-column prop="recipientTitle" label="收件人抬頭" width="150" />
        <el-table-column prop="deliveryMethod" label="寄送方式" width="150" />
        <el-table-column prop="deliveryAddress" label="收件地址" />
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
        Showing 1 to 0 of 0
      </div>
      <div class="page-title"><h2>車籍資料維護</h2></div>
      <el-button type="warning" @click="dialogVisible = true">新增車籍</el-button>
      <el-table :data="vehicles" style="width: 100%">
        <el-table-column prop="billId" label="帳單編號" width="300" />
        <el-table-column prop="license_plate" label="車牌號碼" width="300" />
        <el-table-column prop="vehicleType" label="車輛型態" width="300" />
        <el-table-column prop="product_name" label="油品名稱" width="350" />
        <el-table-column label="操作">
          <template v-slot="scope">
            <div class="action-icons">
              <i class="fas fa-edit " @click="editItemVehicle(scope.row)"></i>
              <i class="fa-solid fa-trash-can"  @click="deleteItemVehicle(scope.row)"></i>
              <el-button type="warning" @click="onVehicle(scope.row)">車籍卡片</el-button>
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
      rowData:[],
      bills: [
        {
          billId: 'B001',
          customerId: 'C001',
          acc_name: 'AAA',
          transactionMode: '現金',
          taxId: '12345678',
          recipientName: '張三',
          recipientTitle: '經理',
          deliveryMethod: '快遞',
          deliveryAddress: '台北市中正區'
        },
        {
          billId: 'B002',
          customerId: 'C002',
          acc_name: 'BBB',
          transactionMode: '刷卡',
          taxId: '87654321',
          recipientName: '李四',
          recipientTitle: '主任',
          deliveryMethod: '郵寄',
          deliveryAddress: '台中市西屯區'
        }
      ],
      vehicles: [
        {
          billId: 'B001',
          license_plate: 'ABC-123',
          vehicleType: '自小客',
          product_name: ' 0017 國光尿素溶液'
        },
        {
          billId: 'B001',
          license_plate: 'ABC-1236',
          vehicleType: '自小客',
          product_name: ' 0017 國光尿素溶液'
        },
      ],
      currentPage: 1,
      pageSize: 10
    };
  },
  created() {
    this.rowData = JSON.parse(this.$route.query.rowData);
  },
  computed: {
   
  },
  methods: {
   
    viewDetails(row) {
      console.log('View details for:', row);
      this.$router.push({ 
        path: 'SelectView',
        query: {
          rowType:'3',
          cus_name:this.rowData.cus_name,
          cus_code:this.rowData.cus_code,
          rowData: JSON.stringify(row)
        }
      });
    },
    editItem(row) {
      console.log('Edit item:', row);
      this.$router.push({ 
        path: 'UpdateView',
        query: {
          rowType:'3',
          cus_name:this.rowData.cus_name,
          cus_code:this.rowData.cus_code,
          rowData: JSON.stringify(row)
        }
      });
    },
    deleteItem(row) {
      console.log('Delete item:', row);
    },
    viewDetailVehicles(row) {
      console.log('View details for:', row);
      this.$router.push({ 
        path: 'SelectView',
        query: {
          rowType:'5',
          cus_name:this.rowData.cus_name,
          cus_code:this.rowData.cus_code,
          rowData: JSON.stringify(row)
        }
      });
    },
    editItemVehicle(row) {
      console.log('Edit item:', row);
      this.$router.push({ 
        path: 'UpdateView',
        query: {
          rowType:'5',
          cus_name:this.rowData.cus_name,
          cus_code:this.rowData.cus_code,
          rowData: JSON.stringify(row)
        }
      });
    },
    deleteItemVehicle(row) {
      console.log('Delete item:', row);
    },
    onVehicle(row) {
      console.log('View details for:', row);
      this.$router.push({ 
        path: 'vehicle',
        query: {
          cus_name:this.rowData.cus_name,
          cus_code:this.rowData.cus_code,
          rowData: JSON.stringify(row)
        }
      });
    },
  }
};
</script>

<style scoped>

.page-title  {
  margin-top: 30px;
  margin-bottom: 30px;
}
.page-title h4 {
    color: #f5bd04;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-input {
  width: 200px;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

.el-table {
  min-width: 900px;
}

.el-table th, .el-table td {
  white-space: nowrap;
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
