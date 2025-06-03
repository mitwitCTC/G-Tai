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
      loading: false,
      cusdata: [],
      vehicle: [],
      excelData: [], // 儲存解析後的 Excel 資料
      headers: ['客戶代號','統編','車號','油品','中油帳號',],
    };
  },
  computed: {},
  created() {
    this.getdata();
    this.getPlate();
  },
  methods: {
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
    async getPlate() {
      const response = await axios.get(
        "http://122.116.23.30:3347/main/selectVehicle "
      );
      try {
        this.vehicle = response.data.data;
      } catch (error) {
        console.error("取得車牌ID失敗:", error);
      }
    },
    async getdata() {
      await axios
        .get("http://122.116.23.30:3347/main/selectCPCdata")
        .then((response) => {
          this.cusdata = response.data.data;
        })
        .catch((error) => {
          // 處理錯誤
          this.$message({
            message: "系統有誤",
            type: "error",
          });
          console.error("API request failed:", error);
        });
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
            const licensePlate = rowData["車號"]; // 假設你的車號欄位名為 "車號"
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
            const licensePlate = row["車號"];
            row.isDuplicate = licensePlateCount[licensePlate] > 1;
          });
        };
        reader.readAsArrayBuffer(file); // 讀取檔案為 ArrayBuffer 格式
      }
    },
    async submitData() {
      const selectedData = this.excelData.filter((row) => row.selected);
      // 建立一個 Set 來儲存已出現的車號
      const plateSet = new Set();
      let hasDuplicatePlate = false;

      for (const row of selectedData) {
        const plate = row.車牌; // 替換為實際的車號欄位名稱
        if (plateSet.has(plate)) {
          hasDuplicatePlate = true;
          break;
        } else {
          plateSet.add(plate);
        }
      }

      if (hasDuplicatePlate) {
        this.$message({
          message: "選取的資料中有重複車號，請檢查！",
          type: "warning",
        });
        return; // 停止後續流程
      }
      console.log(JSON.stringify(this.excelData));
      //   const selectedData = this.excelData.filter((row) => row.selected);
      //   const processedData = selectedData.map((row) => ({
      //     license_plate: row["車號"],
      //     card_number: row["卡號"],
      //     custodian: row["管理單位"],
      //     product_name: row["油品別"] ? row["油品別"].substring(0, 4) : "",
      //     upload_time: row["製卡日期"]
      //       ? `${String(row["製卡日期"]).slice(0, 4)}-${String(
      //           row["製卡日期"]
      //         ).slice(4, 6)}-${String(row["製卡日期"]).slice(6, 8)}`
      //       : "",
      //     card_type:
      //       row["油品別"] && row["油品別"].substring(0, 4) === "0017"
      //         ? "1"
      //         : row["油品別"] && row["油品別"].substring(0, 4) === "0006"
      //         ? "2"
      //         : row["油品別"] && row["油品別"].substring(0, 4) === "0001"
      //         ? "3"
      //         : "",
      //     card_arrival_date: "",
      //   }));
      //   const jsonData = {
      //     data: processedData,
      //   };
      //   console.log(JSON.stringify(jsonData))
      //   await axios
      //     .post("http://122.116.23.30:3347/main/importCPCfile", jsonData)
      //     .then((response) => {
      //       if (response.data.returnCode === 0) {
      //         // 成功提示
      //         this.$message({
      //           message: "新增成功",
      //           type: "success",
      //         });
      //       } else {
      //         // 處理非 0 成功代碼
      //         this.$message({
      //           message: "新增失敗",
      //           type: "error",
      //         });
      //       }
      //     })
      //     .catch((error) => {
      //       // 處理錯誤
      //       console.error("API request failed:", error);
      //     });
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
</style>
