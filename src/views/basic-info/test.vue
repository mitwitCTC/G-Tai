<template>
  <ListBar />
  <div class="page-title">
    <h2>{{ pageTitle }}</h2>
  </div>
  <div>
    <BreadCrumb />
  </div>
  <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" />
  <el-button type="success" @click="getexcel">下載範例</el-button>
  <el-button type="primary" @click="submitData">送出</el-button>
  <el-button type="danger" @click="clearExcelData">清除</el-button>
  <br />
  <br />
  <el-form-item
    label="匯入資料(紅字為重複資料)"
    class="section-header"
    v-if="excelData.length > 0"
  >
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

  <div style="margin-bottom: 50px"></div>
  <el-dialog
    title="新增結果"
    v-model="dialogVehicle"
    width="90%"
    :close-on-click-modal="false"
  >
    <el-form label-width="155px" style="width: 100%; min-width: 1600px">
      <el-form-item label="單筆" class="section-header">
        <div class="table-container">
          <el-table :data="one" style="width: 100%">
            <el-table-column prop="customerId" label="客戶代號" width="200" />
            <el-table-column
              prop="license_plate"
              label="車牌號碼"
              width="300"
            />
            <el-table-column prop="card_number" label="卡號" width="250" />
            <el-table-column prop="license_plate" label="車牌" width="200" />
            <el-table-column prop="buildType" label="卡片狀態" width="250" />
          </el-table>
        </div>
      </el-form-item>

      <el-form-item label="多筆" class="section-header">
        <div class="table-container">
         
          <el-table :data="other" style="width: 100%">
            <el-table-column prop="customerId" label="客戶代號" width="200" />
            <el-table-column
              prop="license_plate"
              label="車牌號碼"
              width="300"
            />
            <el-table-column prop="card_number" label="卡號" width="250" />
            <el-table-column prop="license_plate" label="車牌" width="200" />
            <el-table-column prop="buildType" label="卡片狀態" width="250" />
          </el-table>
          </div>
      </el-form-item>
      <el-form-item label="找不到" class="section-header">
        <div class="table-container">
         
          <el-table :data="zero" style="width: 100%">
            <el-table-column prop="customerId" label="客戶代號" width="200" />
            <el-table-column
              prop="license_plate"
              label="車牌號碼"
              width="300"
            />
            <el-table-column prop="card_number" label="卡號" width="250" />
            <el-table-column prop="license_plate" label="車牌" width="200" />
          </el-table>
          </div>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog
    v-model="isLoading"
    width="15%"
    title="請稍後..."
    :close-on-click-modal="false"
    :show-close="false"
  />
</template>

<script>
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import ListBar from "@/components/ListBar.vue";
import BreadCrumb from "@/components/BreadCrumb.vue";
import axios from "axios";
import { toRaw } from "vue";
export default {
  components: {
    BreadCrumb,
    ListBar,
  },
  data() {
    return {
      isLoading: false,
      dialogVehicle: false,
      one: [],
      zero: [],
      other: [],
      excelData:[],
      headers: ["客戶代號", "客戶名稱", "車牌號碼", "卡號","卡片狀態", "到卡日期", "中油停卡日期"],
    };
  },
  computed: {},
  created() {},
  methods: {
    async exportExcel() {
      try {
        // 確保資料先完成取得
        const workbook = new ExcelJS.Workbook();
        const fr = new FileReader();
        const response = await fetch(
          new URL("@/assets/大批製卡檔新增.xlsx", import.meta.url).href
        );
        const data = await response.blob(); // 轉為 Blob
        // 等待 FileReader onload 完成
        const arrayBuffer = await new Promise((resolve, reject) => {
          const fr = new FileReader();
          fr.onload = (ev) => resolve(ev.target.result); // 當完成時，resolve 結果
          fr.onerror = (err) => reject(err); // 發生錯誤時，reject 錯誤
          fr.readAsArrayBuffer(data);
        });
        // 使用 arrayBuffer 讀取 Excel
        await workbook.xlsx.load(arrayBuffer);
        const worksheet = workbook.worksheets[0]; // 取得第一個工作表
        // 開始填充資料
        this.Allexport.forEach((data, index) => {
          const rowIndex = index + 2; // 從 A2 開始
          worksheet.getCell(`A${rowIndex}`).value = "N";
          worksheet.getCell(`B${rowIndex}`).value = data.cpc_account || "";
          worksheet.getCell(`C${rowIndex}`).value = data.cpc_account || "";
          worksheet.getCell(`D${rowIndex}`).value = data.customerId || "";
          worksheet.getCell(`E${rowIndex}`).value = data.product_name || "";
          worksheet.getCell(`F${rowIndex}`).value = "C";
          worksheet.getCell(`G${rowIndex}`).value = "B";
          worksheet.getCell(`H${rowIndex}`).value = 7;
          worksheet.getCell(`K${rowIndex}`).value = data.license_plate || "";
          worksheet.getCell(`O${rowIndex}`).value = "A";
          worksheet.getCell(`P${rowIndex}`).value = 0;
          worksheet.getCell(`Q${rowIndex}`).value = 0;
          worksheet.getCell(`R${rowIndex}`).value = "Y";
          worksheet.getCell(`S${rowIndex}`).value = "N";
          worksheet.getCell(`T${rowIndex}`).value = "N";
          worksheet.getCell(`U${rowIndex}`).value = "N";
          if (data.product_name == "0006") {
            worksheet.getCell(`V${rowIndex}`).value = "Y";
          } else {
            worksheet.getCell(`V${rowIndex}`).value = "N";
          }
          worksheet.getCell(`W${rowIndex}`).value = "N";
        });
        // 生成下載鏈接並觸發下載
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `大批製卡檔新增.xlsx`; // 設定下載檔案名
        link.click();
      } catch (error) {
        console.error("Error during export to Excel:", error);
      }
    },
    async getexcel() {
      try {
        // 確保資料先完成取得
        const workbook = new ExcelJS.Workbook();
        const fr = new FileReader();
        const response = await fetch(
          new URL("@/assets/大批匯入車籍-範例.xlsx", import.meta.url).href
        );
        const data = await response.blob(); // 轉為 Blob

        // 等待 FileReader onload 完成
        const arrayBuffer = await new Promise((resolve, reject) => {
          const fr = new FileReader();
          fr.onload = (ev) => resolve(ev.target.result); // 當完成時，resolve 結果
          fr.onerror = (err) => reject(err); // 發生錯誤時，reject 錯誤
          fr.readAsArrayBuffer(data);
        });

        // 使用 arrayBuffer 讀取 Excel
        await workbook.xlsx.load(arrayBuffer);
        const worksheet = workbook.worksheets[0]; // 取得第一個工作表

        // 生成下載鏈接並觸發下載
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `大批匯入車籍-範例.xlsx`; // 設定下載檔案名
        link.click();
      } catch (error) {
        console.error("Error during export to Excel:", error);
      }
    },

    handleFileUpload(event) {
      const file = event.target.files[0]; // 取得選中的檔案
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result); // 讀取檔案
          const workbook = XLSX.read(data, { type: "array" }); // 使用 xlsx 解析檔案

          // 解析第一個工作表
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          // 將工作表轉換為 JSON 格式
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // 將 Excel 表頭（第一列）存入 headers
          // this.headers = jsonData[0];

          const licensePlateCount = {};
          const duplicates = new Set(); // 用於儲存重複的車號
          // 將表格數據儲存，排除表頭
          this.excelData = jsonData.slice(1).map((row) => {
            const rowData = {};
            this.headers.forEach((header, index) => {
              rowData[header] = row[index] || "";
            });
            // 記錄車號
            // const licensePlate = rowData["車號"]; // 假設你的車號欄位名為 "車號"
            // if (licensePlate) {
            //   if (!licensePlateCount[licensePlate]) {
            //     licensePlateCount[licensePlate] = 1;
            //   } else {
            //     licensePlateCount[licensePlate]++;
            //     duplicates.add(licensePlate); // 加入重複的車號到集合中
            //   }
            // }
            rowData.selected = true;
            return rowData;
          });
          // // 標記重複的車號
          // this.excelData.forEach((row) => {
          //   const licensePlate = row["車號"];
          //   row.isDuplicate = licensePlateCount[licensePlate] > 1;
          // });
        };
        reader.readAsArrayBuffer(file); // 讀取檔案為 ArrayBuffer 格式
      }
    },
    async submitData() {
      this.isLoading = true;
      const processedData = this.excelData.map((row) => ({
        customerId: row["客戶代號"],
        license_plate: row["車牌號碼"],
        card_number: row["卡號"]
      }));
      
      try {
        // 發送 GET 請求到指定的 API
        const response = await axios.post(
          "http://127.0.0.1:3347/main/test",
          processedData
        );
        this.one = response.data.data.one;
        this.zero = response.data.data.zero;
        this.other = response.data.data.other;
    
        this.dialogVehicle=true
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    clearExcelData() {
      this.headers = [];
      this.excelData = [];
    },
    rowClassName({ row }) {
      // 如果 row.isDuplicate 為 true，設置行的背景色為紅色
      return row.isDuplicate ? "duplicate-row" : "";
    },
  },
};
</script>

<style>
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
}
.pagination-container {
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
.no-data {
  text-align: center;
  color: #f10b0b;
  font-size: 20px;
}

</style>
