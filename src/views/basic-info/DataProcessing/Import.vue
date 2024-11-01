<template>
  <ListBar/>
  <div class="page-title"><h2>{{ pageTitle }}</h2></div>
  <div>
      <BreadCrumb/>
  </div>
    <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" />
    <el-button type="primary" @click="submitData">送出</el-button>
    <el-button type="danger" @click="clearExcelData">清除</el-button>
    <br />
    <br />
    <el-form-item label="中油未回傳車輛" class="section-header" >
    <el-table :data="paginatedDiscount"    style="width: 100%" v-loading="loading">
      <el-table-column prop="cpc_account" label="中油帳號"  width="150" />
      <el-table-column prop="vehicleId" label="車號" width="300"><template v-slot="scope">{{ formatName(scope.row.vehicleId)}} </template></el-table-column>
      <el-table-column prop="card_type" label="卡片類別" :formatter="product_method" width="150" />
      <el-table-column prop="cupload_reason" label="上傳中油原因"  width="200" />
      <el-table-column prop="vehicle_change_reason" label="車輛異動因素"  width="300" />
      <el-table-column prop="card_create_date" label="建檔時間"  width="300" />
    </el-table>
  </el-form-item>
  <div class="pagination-container">
      <div class="pagination-info">
        Showing {{ startItem }} to {{ endItem }} of {{ this.cusdata.length }}
      </div>
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="this.cusdata.length"
        layout="prev, pager, next, jumper"
        class="pagination"
      />
    </div>
  <el-form-item label="匯入資料" class="section-header" v-if="excelData.length > 0">  
  <el-table
  :data="excelData"
  style="width: 100%"
  v-if="excelData.length > 0"
  :row-class-name="rowClassName"
>
  <el-table-column label="選擇" width="55">
    <template v-slot="scope">
      <el-checkbox v-model="scope.row.selected"></el-checkbox>
    </template>
  </el-table-column>

  <el-table-column
    v-for="(header, index) in headers"
    :key="index"
    :prop="header"
    :label="header"
  >
  </el-table-column>
</el-table>
</el-form-item>

    <div style="margin-bottom: 50px;"></div>
</template>

<script>
import * as XLSX from 'xlsx';
import ListBar from '@/components/ListBar.vue'
import BreadCrumb from '@/components/BreadCrumb.vue';
import axios from 'axios';
import { toRaw } from 'vue';
export default {
  components: {
    BreadCrumb,
    ListBar
  },
data() {
  return {
    loading:false,
    cusdata:[],
    vehicle:[],
    excelData: [], // 儲存解析後的 Excel 資料
      headers: [],
      methodMap:{
        "1": "尿素",
        "2": "柴油",
        "3": "汽油",
      },
      currentPage: 1,
      pageSize: 10    // 儲存 Excel 的表頭
  };
},
computed: {  
   paginatedDiscount() {
     const start = (this.currentPage - 1) * this.pageSize;
     const end = start + this.pageSize;
     return this.cusdata.slice(start, end);
   },
   startItem() {
     const start = (this.currentPage - 1) * this.pageSize + 1;
     return Math.min(start, this.cusdata.length);
   },
   endItem() {
     const end = this.currentPage * this.pageSize;
     return Math.min(end, this.cusdata.length);
   },
 },
  created(){
  this.getdata();
  this.getPlate()
  },
 methods: {
  product_method(card_type) {
      const rawproduct = toRaw(card_type);
      return this.methodMap[rawproduct.card_type] || '未知';
    },
  formatName(vehicleId) {
      // 使用 find 方法找到對應的 employee_name
      const Lic = this.vehicle.find(item => item.vehicleId == vehicleId);
      return Lic == null ? '' : (Lic ? Lic.license_plate : '未知名稱');
    },
  async getPlate(){
    
      const response= await axios.get('http://122.116.23.30:3345/main/selectVehicle ')
          try{
          this.vehicle=response.data.data
        }
        catch (error) {
          console.error('取得車牌ID失敗:', error);
        }
   },
  handlePageChange(page) {
      this.currentPage = page;
    },
    async getdata(){
      await axios.get('http://122.116.23.30:3345/main/selectCPCdata')
      .then(response => {
          this.cusdata=response.data.data
        })
        .catch(error => {
          // 處理錯誤
            this.$message({
              message: '系統有誤',
              type: 'error'
            });
          console.error('API request failed:', error);
        });

    },
    handleFileUpload(event) {
      const file = event.target.files[0]; // 取得選中的檔案
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result); // 讀取檔案
          const workbook = XLSX.read(data, { type: 'array' }); // 使用 xlsx 解析檔案

          // 解析第一個工作表
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          // 將工作表轉換為 JSON 格式
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // 將 Excel 表頭（第一列）存入 headers
          this.headers = jsonData[0];

          const licensePlateCount = {};
          const duplicates = new Set(); // 用於儲存重複的車號
          // 將表格數據儲存，排除表頭
          this.excelData = jsonData.slice(1).map((row) => {
            const rowData = {};
            this.headers.forEach((header, index) => {
              rowData[header] = row[index] || '';
            });
             // 記錄車號
            const licensePlate = rowData['車號']; // 假設你的車號欄位名為 "車號"
            if (licensePlate) {
              if (!licensePlateCount[licensePlate]) {
                licensePlateCount[licensePlate] = 1;
              } else {
                licensePlateCount[licensePlate]++;
                duplicates.add(licensePlate); // 加入重複的車號到集合中
              }
            }
            rowData.selected = true;
            return rowData;
          });
           // 標記重複的車號
            this.excelData.forEach((row) => {
            const licensePlate = row['車號'];
            row.isDuplicate = licensePlateCount[licensePlate] > 1;
          });
           // console.log 出有重複的車號
  if (duplicates.size > 0) {
    console.log('重複的車號有:', Array.from(duplicates));
  } else {
    console.log('沒有重複的車號');
  }
        };
        reader.readAsArrayBuffer(file); // 讀取檔案為 ArrayBuffer 格式
      }
    },
    async submitData() {
      const selectedData = this.excelData.filter(row => row.selected);
      const processedData = selectedData.map(row => ({
        license_plate: row['車號'],
        card_number: row['卡號'],
        custodian: row['管理單位'],
        product_name: row['油品別'] ? row['油品別'].substring(0, 4) : '',
        upload_time: row['製卡日期']
        ? `${String(row['製卡日期']).slice(0, 4)}-${String(row['製卡日期']).slice(4, 6)}-${String(row['製卡日期']).slice(6, 8)}`
        : '',
        card_type: row['油品別'] && row['油品別'].substring(0, 4) === "0017" ? "1" :
                   row['油品別'] && row['油品別'].substring(0, 4) === "0006" ? "2" :
                   row['油品別'] && row['油品別'].substring(0, 4) === "0001" ? "3" : "",
        card_arrival_date:'',

      }));
      const jsonData = {
        data: processedData
      };
      console.log('送出的資料:', JSON.stringify(jsonData));
       await axios.post('http://122.116.23.30:3345/main/importCPCfile',jsonData)
       .then(response => {
        if ( response.data.returnCode === 0) {
            // 成功提示
            this.$message({
              message: '新增成功',
              type: 'success'
            });
          } else {
            // 處理非 0 成功代碼
            this.$message({
              message: '新增失敗',
              type: 'error'
            });
          }
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
        
    },
    clearExcelData() {
      this.headers =[];
      this.excelData = [];
    },
    rowClassName({ row }) {
    // 如果 row.isDuplicate 為 true，設置行的背景色為紅色
    return row.isDuplicate ? 'duplicate-row' : '';
  }
  },
};
</script>

<style >
.page-title {
  margin-top: 30px; 
  margin-bottom: 30px; 
  }
  .duplicate-row {
  color: red; /* 文字顏色變白 */
}
.section-header {
  margin-top: 50px;
  font-weight: bold;
  background-color: #f0ecec; /* 浅灰色背景 */
  border-radius: 10px; /* 圆角 */
  padding: 10px; /* 内边距 */
  margin-bottom: 10px; /* 项目之间的间距 */

}.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.pagination-info {
  margin-right: auto; /* 确保分页信息靠左 */
  padding-right: 900px; /* 可选: 添加右边距以与分页控件分开 */
  white-space: nowrap;
}
</style>