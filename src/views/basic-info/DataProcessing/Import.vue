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

    <div style="margin-bottom: 50px;"></div>
</template>

<script>
import * as XLSX from 'xlsx';
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
    excelData: [], // 儲存解析後的 Excel 資料
      headers: []    // 儲存 Excel 的表頭
  };
},
methods: {
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
      product_name: row['油品別'] ? row['油品別'].substring(0, 4) : ''
    }));
      const jsonData = {
        data: processedData
      };
      console.log('送出的資料:', JSON.stringify(jsonData));
      //  await axios.post('http://122.116.23.30:3345/main/importCPCfile',jsonData)
      //   try {
      //      this.$message({
      //          message: '新增成功',
      //         type: 'success'
      //       });
      //   }
      //   catch{
      //     this.$message({
      //         message: '系統有誤',
      //         type: 'error'
      //       });
      //     console.error('API request failed:', error);
      //   }
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
</style>