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
    <el-table :data="excelData" style="width: 100%" v-if="excelData.length > 0">
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

          // 將表格數據儲存，排除表頭
          this.excelData = jsonData.slice(1).map((row) => {
            const rowData = {};
            this.headers.forEach((header, index) => {
              rowData[header] = row[index] || '';
            });
            rowData.selected = true;
            return rowData;
          });
        };
        reader.readAsArrayBuffer(file); // 讀取檔案為 ArrayBuffer 格式
      }
    },
    submitData() {
      const selectedData = this.excelData.filter(row => row.selected);
      const processedData = selectedData.map(row => ({
      license_plate: row['車號'],
      card_number: row['卡號'],
      product_name: row['油品別'] ? row['油品別'].substring(0, 4) : ''
    }));
      const jsonData = JSON.stringify(processedData);
      console.log('送出的資料:', jsonData);
    },
    clearExcelData() {
      this.headers =[];
      this.excelData = [];
    }
  },
};
</script>

<style scoped>
.page-title {
  margin-top: 30px; 
  margin-bottom: 30px; 
  }
</style>