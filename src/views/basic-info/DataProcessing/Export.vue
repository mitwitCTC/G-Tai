<template>
  <ListBar/>
  <div class="page-title"><h2>{{ pageTitle }}</h2></div>
  <div>
      <BreadCrumb/>
  </div>
  <el-button type="primary" @click="dialog=true">新增</el-button>
  <el-table :data="paginatedDiscount" style="width: 100%">
      <el-table-column prop="product_name" label="客戶編號"  width="100" />
      <el-table-column prop="supplier_name" label="客戶名稱" width="300" />
      <el-table-column prop="discount_float" label="帳單組別" width="300" />
      <el-table-column prop="discount_float" label="車號" width="150" />
      <el-table-column prop="discount_float" label="卡號" width="250" />
      <el-table-column prop="discount_float" label="狀態" width="150" />
      <el-table-column prop="responsible_person" label="異動時間"  />
    </el-table>
    <!-- 新增 -->
 <el-dialog title="新增資料" v-model="dialog" width="70%">

    <el-form :model="form" label-width="120px" > <!-- 统一標籤寬度 -->
      <el-row style="margin-bottom: 20px">
        <el-form-item label="客戶編號">
          <el-input v-model="form.cus_code" ></el-input>
        </el-form-item>
        <el-form-item label="客戶名稱">
            <el-input v-model="form.cus_name" readonly ></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 20px">
        <el-form-item label="帳單組別">
          <el-input v-model="form.acc_name" ></el-input>
        </el-form-item>
        <el-form-item label="車號">
            <el-input v-model="form.license_plate" ></el-input>
        </el-form-item>
        <el-form-item label="卡號">
            <el-input v-model="form.card_number" ></el-input>
        </el-form-item>
      </el-row>
      <el-form-item label="狀態">
            <el-input v-model="form.state" readonly></el-input>
        </el-form-item>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" @click="savePass">送出</el-button>
    </div>
    </template>
  </el-dialog>


    <div class="pagination-container">
      <div class="pagination-info">
        Showing {{ startItem }} to {{ endItem }} of {{ DiscountData.length }}
      </div>
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="DiscountData.length"
        layout="prev, pager, next, jumper"
        class="pagination"
      />
    </div>
</template>

<script>
import ListBar from '@/components/ListBar.vue';
import BreadCrumb from '@/components/BreadCrumb.vue';
import TablePaginated from '@/components/TablePaginated.vue';
import axios from 'axios';

export default {
  components: {
    BreadCrumb,
    ListBar,
    TablePaginated
  },
  data() {
    return {
      dialog:false,
      cus_code:'',
      cus_name:'',
      rowData:[],
      DiscountData: [],
      salesmenData:[],
      form:{},
      productMap:{
        "0001": "0001 95無鉛汽油",
        "0002": "0002 92無鉛汽油",
        "0005": "0005 98無鉛汽油",
        "0006": "0006 超級柴油",
        "0017": "0017 尿素溶液"
      },
      form:{
        customerId:'',
        discount_float:0
      },
      currentPage: 1,
      pageSize: 10
    };
  },
  created() {

  },
  mounted() {
    
  },
  computed: {
   
    paginatedDiscount() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.DiscountData.slice(start, end);
    },
    startItem() {
      const start = (this.currentPage - 1) * this.pageSize + 1;
      return Math.min(start, this.DiscountData.length);
    },
    endItem() {
      const end = this.currentPage * this.pageSize;
      return Math.min(end, this.DiscountData.length);
    },
  },
  methods: {

  },
  savePass() {
     
    }, 
    
    handlePageChange(page) {
      this.currentPage = page;
    },

};
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.pagination-info {
  margin-right: auto; /* 确保分页信息靠左 */
  padding-right: 1100px; /* 可选: 添加右边距以与分页控件分开 */
  white-space: nowrap;
}
.pagination {
  flex: 1;
  text-align: right;
}
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
.el-input {
  width: 300px
}
.el-select {
  width: 300px
}

</style>
