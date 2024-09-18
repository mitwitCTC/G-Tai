<template>
  <ListBar/>
  <div class="page-title"><h2>{{ pageTitle }}</h2></div>
  <div>
      <BreadCrumb/>
  </div>
  <el-button type="primary" @click="dialog=true">新增</el-button>
  <el-button @click="exportToExcel">匯出</el-button>
  <input type="file" @change="handleFileChange" />
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
          <el-input v-model="form.cus_code" @input="getdata" maxlength="8"></el-input>
        </el-form-item>
        <el-form-item label="客戶名稱">
            <el-input v-model="form.cus_name" readonly ></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 20px">
        <el-form-item label="帳單組別">
        <el-select v-model="form.acc_name" placeholder="選擇帳單">
          <el-option
          v-for="bill in bills"
          :key="bill.account_sortId "
          :label="bill.acc_name"
          :value="bill.account_sortId "
          ></el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="車號">
            <el-input v-model="form.license_plate" @input="getVehicle"  maxlength="8"></el-input>
        </el-form-item>
        <el-form-item label="卡號">
            <el-input v-model="form.card_number" ></el-input>
        </el-form-item>
        <el-form-item label="油品">
          <el-select v-model="form.product_name" placeholder="選擇油品">
            <el-option label="0001 95無鉛汽油" :value="'0001'"></el-option>
            <el-option label="0002 92無鉛汽油" :value="'0002'"></el-option>
            <el-option label="0005 98無鉛汽油" :value="'0005'"></el-option>
            <el-option label="0006 超級柴油" :value="'0006'"></el-option>
            <el-option label="0017 尿素溶液" :value="'0017'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="車輛異動-因素">
            <el-input v-model="form.vehicle_change_reason" ></el-input>
        </el-form-item>
        <el-form-item label="上傳中油原因">
          <el-select v-model="form.upload_reason" placeholder="選擇原因">
            <el-option label="新增" :value="'1'"></el-option>
            <el-option label="停用" :value="'2'"></el-option>
            <el-option label="遺失" :value="'3'"></el-option>
            <el-option label="故障" :value="'4'"></el-option>
            <el-option label="其它" :value="'5'"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-form-item label="狀態">
          <el-select v-model="form.state" placeholder="狀態" disabled=true>
            <el-option label="判斷結果：1.新增" :value="'1'"></el-option>
            <el-option label="判斷結果：2.更改卡號" :value="'2'"></el-option>
            <el-option label="判斷結果：3.改客戶" :value="'3'"></el-option>
          </el-select>
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
import ExcelJS from 'exceljs';

export default {
  components: {
    BreadCrumb,
    ListBar,
    TablePaginated
  },
  data() {
    return {
      excelFilePath: 'F:User/Jason/Desktop/test.xlsx', // 預設的檔案路徑
      dialog:false,
      cus_code:'',
      cus_name:'',
      rowData:[],
      DiscountData: [],
      salesmenData:[],
      Vehicle:[],
      bills:[],
      form:{
        name:'123',
        age:'456',
        address:'789',
        state:''
      },
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
    getVehicle(){
      this.form.license_plate = this.form.license_plate.trim();
      const postData = {
        customerId:this.form.cus_code,
      };
     if(this.form.license_plate.length==6||this.form.license_plate.length==7||this.form.license_plate.length==8){
      axios.post('http://122.116.23.30:3345/main/searchVehicle',postData)
        .then(response => {
            this.Vehicle = response.data.data;
            console.log(JSON.stringify(this.Vehicle))
            this.Vehicle.forEach(vehicle => {
        if (vehicle.license_plate !== this.form.license_plate) {
            this.form.state = '1';  // 此客戶無此車號資料，狀態新增 state 為 1
        }else if(vehicle.license_plate === this.form.license_plate){
            console.log("找到有相同license_plate的vehicleId:"+vehicle.vehicleId)
            const vehicleId = {
              vehicleId:vehicle.vehicleId,
            };
            axios.post('http://122.116.23.30:3345/main/searchCard',vehicleId)
        .then(response => {
          if(!response.data.data[0]){
            //沒卡號 新增
            console.log("此車號無卡號資料，狀態新增 state 為 1")
          this.form.state = '1';// 此車號無卡號資料，狀態新增 state 為 1
          }else{
            //有卡號 做修改
          }
           
        })
        .catch(error => {
          this.$message({
              message: '系統有誤',
              type: 'error'
            });
          console.error('API request failed:', error);
        });
        }
    });
        })
        .catch(error => {
          // 處理錯誤
            this.$message({
              message: '系統有誤',
              type: 'error'
            });
          console.error('API request failed:', error);
        });
     } 
  },
    getdata(){
      const postData = {
        cus_code:this.form.cus_code,
        customerId:this.form.cus_code,
      };
      this.form.cus_name=''
     if(this.form.cus_code.length==8){
      this.form.cus_name='查詢中..'
      console.log(JSON.stringify(postData))
      axios.post('http://122.116.23.30:3345/main/searchCustomer',postData)
        .then(response => {
            this.form.cus_name = response.data.data[0].cus_name;
        })
        .catch(error => {
          // 處理錯誤
            this.form.cus_name=''
            this.$message({
              message: '請確認客戶代號是否有誤',
              type: 'error'
            });
          console.error('API request failed:', error);
        });
     } 
     if(this.form.cus_name){
      axios.post('http://122.116.23.30:3345/main/searchAccount_sort',postData)
        .then(response => {
            this.bills = response.data.data;
            console.log("個別帳單"+JSON.stringify(this.bills))
        })
        .catch(error => {
          // 處理錯誤
            this.form.cus_name=''
            this.$message({
              message: '系統錯誤',
              type: 'error'
            });
          console.error('API request failed:', error);
        });
     }
    
  },
    handleFileChange(event) {
      // 獲取選擇的文件
      const file = event.target.files[0];
      if (file) {
        this.excelFile = file; // 保存文件對象
      }
    },
     // 匯出 Excel
     async exportToExcel() {
      try {
        const file = this.excelFile; // 取得選中的檔案

        if (!(file instanceof File)) {
          console.error('Selected item is not a file');
          return;
        }

        // 讀取 Excel 文件
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(await file.arrayBuffer());

        // 取得第一個工作表
        const worksheet = workbook.worksheets[0];
       
    //     // 將數據寫入特定單元格
        worksheet.addTable({
        name: 'table名稱',  // 表格內看不到的，算是key值，讓你之後想要針對這個table去做額外設定的時候，可以指定到這個table
        ref: 'A4', // 從A4開始
        headerRow:false,
        columns: [
          { name: '流水號' },
          { name: '車牌' },
          { name: '超級柴油' },
          { name: '無鉛汽油' },
          { name: '酒精汽油' },
          { name: '不限油品' },
          { name: '尿素溶液' },
          { name: '新增' },
          { name: '停用' },
          { name: '遺失' },
          { name: '故障' },
          { name: '其它' },
          { name: '保管單位' },
          { name: '備註' }
        ],
        rows: [['1','AAA-1234','','','','','V','V','','','','','G22000777','#123456789123']]
    });

        // 保存到新的文件
        const newFileName = 'modified_file.xlsx';
        const buffer = await workbook.xlsx.writeBuffer();

        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = newFileName;
        link.click();
      } catch (error) {
        console.error('Error in exportToExcel function:', error);
      }
  },

    savePass() {
     
    }, 
    
    handlePageChange(page) {
      this.currentPage = page;
    },

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
