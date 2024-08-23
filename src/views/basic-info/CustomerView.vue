<template>
  <div>
    <ListBar/>
    <div class="page-title"><h2>{{ pageTitle }}</h2></div>
    <div>
      <BreadCrumb :isSpecialPage="true"/>
    </div>
    
    <div>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="客戶名稱/客戶代號/統編">
          <el-input v-model="search.customerName" placeholder="輸入客戶名稱/客戶代號/統編/" style="width: 225px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="dialog = true">新增客戶</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="paginatedData" style="width: 100%">
        <el-table-column prop="cus_code" label="客戶代號" width="100"></el-table-column>
        <el-table-column prop="cus_name" label="客戶名稱" width="200"></el-table-column>
        <el-table-column prop="vat_number" label="統編" width="150"></el-table-column>
        <el-table-column prop="region" label="區域" width="150"></el-table-column>
        <el-table-column prop="industry" label="產業類別" width="150"></el-table-column>
        <el-table-column prop="est_fuel_volume" label="預估月加油量" width="150"></el-table-column>
        <el-table-column prop="phone" label="公司電話" width="150"></el-table-column>
        <!-- 操作列 -->
    <el-table-column label="操作">
      <template v-slot="scope">
        <div class="action-icons">
          <i class="fas fa-eye " @click="viewDetails(scope.row)"></i>
          <i class="fas fa-edit " @click="editItem(scope.row)"></i>
          <i class="fa-solid fa-trash-can"  @click="deleteItem(scope.row)"></i>
          <el-button type="primary" @click="onContact(scope.row)">聯絡人</el-button>
          <el-button type="success" @click="onBill(scope.row)">帳單</el-button>
          <el-button type="danger" @click="onDiscount(scope.row)">折讓</el-button>
        </div>
      </template>
    </el-table-column>

      </el-table>

      <!-- <div class="pagination-container">
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
    </div> -->
    
    <TablePaginated
      :data="customers"
      :filters="search"
      :currentPage="currentPage"
      :pageSize="pageSize"
      @page-change="handlePageChange"
    />

 <!-- 新增客戶 -->
 <el-dialog title="新增客戶" v-model="dialog" width="80%">
    <el-form :model="form" label-width="120px"> <!-- 统一标签宽度 -->
      <el-row>
        <el-col :span="8">
          <el-form-item label="客戶名稱">
            <el-input v-model="form.customerName" class="small-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="負責業務">
            <el-input v-model="form.responsibleBusiness" class="small-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="虛擬帳號">
            <el-input v-model="form.virtualAccount" class="small-input"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="區域">
            <el-select v-model="form.region" placeholder="選擇區域" class="small-input">
              <el-option label="北部" value="north"></el-option>
              <el-option label="中部" value="central"></el-option>
              <el-option label="南部" value="south"></el-option>
              <el-option label="東部" value="east"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="產業類別">
            <el-select v-model="form.industryType" placeholder="選擇產業類別" class="small-input">
              <el-option label="科技" value="tech"></el-option>
              <el-option label="金融" value="finance"></el-option>
              <el-option label="製造" value="manufacturing"></el-option>
              <el-option label="服務" value="service"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="預估加油量">
            <el-input v-model="form.estimatedFuelAmount" class="small-input"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="公司電話">
            <el-input v-model="form.companyPhone" class="small-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="傳真號碼">
            <el-input v-model="form.faxNumber" class="small-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="公司統編">
            <el-input v-model="form.taxId" class="small-input"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="公司抬頭">
            <el-input v-model="form.companyTitle" class="small-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="前台密碼">
            <el-input v-model="form.frontPassword" type="password" class="small-input"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="通知方式">
            <el-input v-model="form.notificationMethod" class="small-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="低水位值">
            <el-input v-model="form.lowWaterValue" class="small-input"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
      <el-col :span="8">
          <el-form-item label="合約日期(起)">
            <el-date-picker v-model="form.contractStartDate" type="date" class="small-input"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合約日期(迄)">
            <el-date-picker v-model="form.contractEndDate" type="date" class="small-input"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="營業登記地址">
            <el-input v-model="form.registrationAddress"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="聯絡地址">
            <el-input v-model="form.contactAddress"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="付款方式" >
            <el-select v-model="form.paymentMethod" placeholder="選擇付款方式" class="small-input">
              <el-option label="現金" value="cash"></el-option>
              <el-option label="信用卡" value="credit"></el-option>
              <el-option label="轉帳" value="transfer"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="押金">
            <el-input v-model="form.deposit" class="small-input"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="合約備註">
            <el-input v-model="form.contractRemarks"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template v-slot:footer>
<div  class="dialog-footer">
      <el-button @click="dialog = false">取消</el-button>
      <el-button type="primary" @click="savePass">送出</el-button>
    </div>
</template>
  </el-dialog>

    </div>
  </div>
</template>

<script>
import ListBar from '@/components/ListBar.vue'
import BreadCrumb from '@/components/BreadCrumb.vue';
import TablePaginated from '@/components/TablePaginated.vue';
// import SelectDialog from '@/components/SelectDialog.vue';
export default {
  components: {
    BreadCrumb,
    ListBar,
    TablePaginated,
    
  },
  data() {
    return {
      dialog: false,
      selectDialogVisible: true,
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
          cus_code: 'G2200696',
          cus_name: '整樹貨運股份有限公司',
          vat_number: 'A123456789',
          region: '北、北、基、宜',
          industry: '營建土木工程',
          est_fuel_volume: '1000L',
          phone: '123-456-7890'
        },
       
        // 添加更多客戶
      ],
      form: {
        customerName: '',
        responsibleBusiness: '',
        virtualAccount: '',
        region: '',
        industryType: '',
        estimatedFuelAmount: '',
        companyPhone: '',
        faxNumber: '',
        taxId: '',
        companyTitle: '',
        frontPassword: '',
        contractStartDate: '',
        contractEndDate: '',
        notificationMethod: '',
        lowWaterValue: '',
        registrationAddress: '',
        contactAddress: '',
        paymentMethod: '',
        deposit: '',
        contractRemarks: ''
      },
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    BreadCrumbItems() {
      // 获取当前路由匹配的所有路由项
      const matched = this.$route.matched;
      // 生成面包屑项
      return matched.map(route => ({
        label: route.meta.BreadCrumb || '',
        path: route.path
      }));
    },
    filteredData() {
      return this.customers.filter(customer => {
        return (
          (this.search.region === '' || customer.region === this.search.region) &&
          (this.search.sales === '' || customer.salesPerson === this.search.sales) &&
          (this.search.customerName === '' || customer.customerName.includes(this.search.customerName))
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
    handleReset() {
      this.search = {
        region: '',
        sales: '',
        customerName: ''
      };
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    savePass() {
      // 处理保存逻辑
      this.dialog = false;
    },
    viewDetails(row) {
      console.log('View details for:', row);
      this.$router.push({ 
        path: 'SelectView',
        query: {
          rowType:'1',
          customerName:row.customerName
        }
      });
    },
    editItem(row) {
      console.log('Edit item:', row);
      this.$router.push({ 
        path: 'UpdateView',
        query: {
          rowType:'1',
          customerName:row.customerName
        }
      });
    },
    deleteItem(row) {
      console.log('Delete item:', row);
    },
    onContact(row) {
      console.log('View details for:', row);
      this.$router.push({ 
        path: 'contact',
        query: {
          
        }
      });
    },
    onBill(row) {
      console.log('View details for:', row);
      this.$router.push({ 
        path: 'bill',
        query: {
          
        }
      });
    },
    
    onDiscount(row) {
      console.log('View details for:', row);
      this.$router.push({ 
        path: 'discount',
        query: {
  
        }
      });
    },
  }
};
</script>

<style scoped>
.demo-form-inline {
  margin-bottom: 20px;
}
.custom-select {
  width: 200px; /* 调整宽度 */
  height: 40px; /* 调整高度 */
}
.page-title {
  margin-top: 30px;
  margin-bottom: 30px;
}
.small-input {
  width: 200px; /* 调整宽度 */
}
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.pagination-info {
  margin-right: auto; /* 确保分页信息靠左 */
  padding-right: 1200px; /* 可选: 添加右边距以与分页控件分开 */
  white-space: nowrap;
}
.pagination {
  flex: 1;
  text-align: right;
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