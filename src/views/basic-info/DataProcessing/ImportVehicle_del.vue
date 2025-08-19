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
    title="停用結果"
    v-model="dialogVehicle"
    width="90%"
    :close-on-click-modal="false"
  >
    <el-form label-width="155px" style="width: 100%; min-width: 1600px">
      <el-form-item label="新增成功" class="section-header">
        <div class="table-container">
          <div v-if="!Allexport || Allexport.length === 0" class="no-data">
            無成功紀錄
          </div>
          <el-table :data="Allexport" style="width: 100%">
            <el-table-column prop="customerId" label="客戶代號" width="200" />
            <el-table-column
              prop="license_plate"
              label="車牌號碼"
              width="300"
            />
            <el-table-column prop="card_number" label="卡號" width="250" />
            <el-table-column prop="product_name" label="油品代號" width="200" />
            <el-table-column prop="cpc_account" label="中油帳號" width="250" />
          </el-table>
        </div>
      </el-form-item>

      <el-form-item label="新增失敗" class="section-header">
        <div class="table-container">
          <div v-if="!Unexport || Unexport.length === 0" class="no-data">
            無失敗紀錄
          </div>
          <el-table :data="Unexport" style="width: 100%">
            <el-table-column prop="customerId" label="客戶代號" width="200" />
            <el-table-column
              prop="license_plate"
              label="車牌號碼"
              width="300"
            />
            <el-table-column prop="card_number" label="卡號" width="250" />
            <el-table-column prop="product_name" label="油品代號" width="200" />
            <el-table-column prop="cpc_account" label="中油帳號" width="250" />
            <el-table-column
              prop="UnplateSet_note"
              label="失敗原因"
              width="300"
            />
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
      excelData: [], // 儲存解析後的 Excel 資料
      Allexport: [],
      Unexport: [],
      T_zero: [],
      T_one: [],
      headers: ["客戶代號", "客戶名稱", "車號", "油品","卡號", "中油帳號"],
    };
  },
  computed: {},
  created() {},
  methods: {
    async export_OLD_Excel() {
      this.T_zero = [];
      this.T_one = [];
      this.T_zero = this.Allexport.filter(
        (item) => item.cpc_account === "TT6112060"
      );
      this.T_one = this.Allexport.filter(
        (item) => item.cpc_account === "TT6112061"
      );
      if (this.T_zero.length > 0) {
        try {
          const rowsPerFile = 20;
          // 將資料切割成每 20 筆為一組
          const chunkArray = (arr, size) => {
            const result = [];
            for (let i = 0; i < arr.length; i += size) {
              result.push(arr.slice(i, i + size));
            }
            return result;
          };
          const dataChunks = chunkArray(this.T_zero, rowsPerFile);

          for (let fileIndex = 0; fileIndex < dataChunks.length; fileIndex++) {
            const chunk = dataChunks[fileIndex];
            // 讀取 Excel 文件
            const workbook = new ExcelJS.Workbook();
            const fr = new FileReader();
            const response = await fetch(
              new URL("@/assets/new.xlsx", import.meta.url).href
            ); // 從 URL 載入模板檔案
            const data = await response.blob(); // 轉為 Blob
            fr.readAsArrayBuffer(data);

            // 當 FileReader 完成後，讀取 Excel 並進行修改
            fr.onload = async (ev) => {
              await workbook.xlsx.load(ev.target.result);
              const worksheet = workbook.worksheets[0]; // 取得第一個工作表

              // 處理資料，生成每一行的數據
              const rowsData = chunk.map((data, index) => {
                console.log(JSON.stringify(data));
                // 判斷是否是新增，若是則將 card_number 設為空字串
                const cardNumber =
                  data.upload_reason === "新增" ? "" : data.card_number;

                return [
                  index + 1, // 流水號
                  data.license_plate, // 假設 vehicleId 是車牌
                  data.product_name === "0006" ? "V" : "", // 超級柴油
                  ["0001", "0002", "0005"].includes(data.product_name)
                    ? "V"
                    : "",
                  "", // 酒精汽油
                  data.product_name === "0009" ? "V" : "", // 不限油品
                  data.product_name === "0017" ? "V" : "", // 尿素溶液
                  "", // 新增
                  "V", // 停用
                  "", // 遺失
                  "", // 故障
                  "", // 原卡復油
                  data.customerId, // 保管單位
                  data.cus_name.substring(0, 4),
                  cardNumber, // 備註
                ];
              });
              worksheet.addTable({
                name: "table名稱", // 表格的名稱
                ref: "C1",
                headerRow: false, // 不需要表頭
                columns: [{ name: "標題" }],
                rows: [["TT6112060_鉅泰創新股份有限公司"]], // 將生成的行數據放入表格
              });
              // 添加表格，將所有行數據一次性寫入
              worksheet.addTable({
                name: "table名稱", // 表格的名稱
                ref: "A4", // 表格從 A4 開始
                headerRow: false, // 不需要表頭
                columns: [
                  { name: "流水號" },
                  { name: "車牌" },
                  { name: "超級柴油" },
                  { name: "無鉛汽油" },
                  { name: "酒精汽油" },
                  { name: "不限油品" },
                  { name: "尿素溶液" },
                  { name: "新增" },
                  { name: "停用" },
                  { name: "遺失" },
                  { name: "故障" },
                  { name: "原卡復油" },
                  { name: "保管單位" },
                  { name: "公司名稱" },
                  { name: "備註" },
                ],
                rows: rowsData, // 將生成的行數據放入表格
              });

              // 保存到新的文件
              const newFileName = "TT6112060_中油製卡明細.xlsx";
              const buffer = await workbook.xlsx.writeBuffer();

              // 生成下載鏈接並觸發下載
              const blob = new Blob([buffer], {
                type: "application/octet-stream",
              });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = newFileName;
              link.click();
            };
          }
        } catch (error) {
          console.error("Error during export to Excel:", error);
        }
      }
      if (this.T_one.length > 0) {
        try {
          const rowsPerFile = 20;
          // 將資料切割成每 20 筆為一組
          const chunkArray = (arr, size) => {
            const result = [];
            for (let i = 0; i < arr.length; i += size) {
              result.push(arr.slice(i, i + size));
            }
            return result;
          };
          const dataChunks = chunkArray(this.T_one, rowsPerFile);

          for (let fileIndex = 0; fileIndex < dataChunks.length; fileIndex++) {
            const chunk = dataChunks[fileIndex];
            // 讀取 Excel 文件
            const workbook = new ExcelJS.Workbook();
            const fr = new FileReader();
            const response = await fetch(
              new URL("@/assets/new.xlsx", import.meta.url).href
            ); // 從 URL 載入模板檔案
            const data = await response.blob(); // 轉為 Blob
            fr.readAsArrayBuffer(data);

            // 當 FileReader 完成後，讀取 Excel 並進行修改
            fr.onload = async (ev) => {
              await workbook.xlsx.load(ev.target.result);
              const worksheet = workbook.worksheets[0]; // 取得第一個工作表

              // 處理資料，生成每一行的數據
              const rowsData = chunk.map((data, index) => {
                console.log(JSON.stringify(data));
                // 判斷是否是新增，若是則將 card_number 設為空字串
                const cardNumber =
                  data.upload_reason === "新增" ? "" : data.card_number;

                return [
                  index + 1, // 流水號
                  data.license_plate, // 假設 vehicleId 是車牌
                  data.product_name === "0006" ? "V" : "", // 超級柴油
                  ["0001", "0002", "0005"].includes(data.product_name)
                    ? "V"
                    : "",
                  "", // 酒精汽油
                  data.product_name === "0009" ? "V" : "", // 不限油品
                  data.product_name === "0017" ? "V" : "", // 尿素溶液
                  "", // 新增
                  "V", // 停用
                  "", // 遺失
                  "", // 故障
                  "", // 原卡復油
                  data.customerId, // 保管單位
                  data.cus_name.substring(0, 4),
                  cardNumber, // 備註
                ];
              });
              worksheet.addTable({
                name: "table名稱", // 表格的名稱
                ref: "C1",
                headerRow: false, // 不需要表頭
                columns: [{ name: "標題" }],
                rows: [["TT6112061_鉅泰創新股份有限公司"]], // 將生成的行數據放入表格
              });
              // 添加表格，將所有行數據一次性寫入
              worksheet.addTable({
                name: "table名稱", // 表格的名稱
                ref: "A4", // 表格從 A4 開始
                headerRow: false, // 不需要表頭
                columns: [
                  { name: "流水號" },
                  { name: "車牌" },
                  { name: "超級柴油" },
                  { name: "無鉛汽油" },
                  { name: "酒精汽油" },
                  { name: "不限油品" },
                  { name: "尿素溶液" },
                  { name: "新增" },
                  { name: "停用" },
                  { name: "遺失" },
                  { name: "故障" },
                  { name: "原卡復油" },
                  { name: "保管單位" },
                  { name: "公司名稱" },
                  { name: "備註" },
                ],
                rows: rowsData, // 將生成的行數據放入表格
              });

              // 保存到新的文件
              const newFileName = "TT6112061_中油製卡明細.xlsx";
              const buffer = await workbook.xlsx.writeBuffer();

              // 生成下載鏈接並觸發下載
              const blob = new Blob([buffer], {
                type: "application/octet-stream",
              });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = newFileName;
              link.click();
            };
          }
        } catch (error) {
          console.error("Error during export to Excel:", error);
        }
      }
    },
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
          const plate = data.license_plate;
          // 先檢查有沒有 "-"
          if (!plate.includes("-")) {
            const firstChar = plate.charAt(0).toUpperCase(); // 轉成大寫，避免大小寫差異
            let valueToWrite;

            if (firstChar == "E") {
              valueToWrite = "E";
            } else if (firstChar == "T") {
              valueToWrite = "T";
            } else {
              valueToWrite = "未知";
            }
            worksheet.getCell(`G${rowIndex}`).value = valueToWrite;
          } else {
            worksheet.getCell(`G${rowIndex}`).value = "B";
          }
          worksheet.getCell(`A${rowIndex}`).value = "U";
          worksheet.getCell(`B${rowIndex}`).value = data.cpc_account || "";
          worksheet.getCell(`C${rowIndex}`).value = data.cpc_account || "";
          worksheet.getCell(`D${rowIndex}`).value = data.customerId || "";
          worksheet.getCell(`E${rowIndex}`).value = data.product_name;
          worksheet.getCell(`F${rowIndex}`).value = "C";
          worksheet.getCell(`H${rowIndex}`).value = 7;
          worksheet.getCell(`I${rowIndex}`).value = data.card_number || "";;
          worksheet.getCell(`J${rowIndex}`).value ="C" ;
          worksheet.getCell(`K${rowIndex}`).value = data.license_plate;
          worksheet.getCell(`O${rowIndex}`).value = "A";
          worksheet.getCell(`P${rowIndex}`).value = 0;
          worksheet.getCell(`Q${rowIndex}`).value = 0;
          worksheet.getCell(`R${rowIndex}`).value = "Y";
          worksheet.getCell(`S${rowIndex}`).value = "N";
          worksheet.getCell(`T${rowIndex}`).value = "N";
          worksheet.getCell(`U${rowIndex}`).value = "N";
          worksheet.getCell(`V${rowIndex}`).value =
            data.product_name == "0006" ? "Y" : "N"; // 預設為空字串，如果沒有匹配
          worksheet.getCell(`W${rowIndex}`).value = "N";
        });
        // 生成下載鏈接並觸發下載
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `大批停卡檔.xlsx`; // 設定下載檔案名
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
          new URL("@/assets/大批停用車籍-範例.xlsx", import.meta.url).href
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
        link.download = `大批停用車籍-範例.xlsx`; // 設定下載檔案名
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
      this.isLoading = true;
      const selectedData = this.excelData.filter((row) => row.selected);
      // 建立一個 Set 來儲存已出現的車號
      // const plateSet = new Set();
      // let hasDuplicatePlate = false;

      // for (const row of selectedData) {
      //   const plate = row.車號; // 替換為實際的車號欄位名稱
      //   if (plateSet.has(plate)) {
      //     hasDuplicatePlate = true;
      //     break;
      //   } else {
      //     plateSet.add(plate);
      //   }
      // }

      // if (hasDuplicatePlate) {
      //   this.$message({
      //     message: "選取的資料中有重複車號，請檢查！",
      //     type: "warning",
      //   });
      //   return; // 停止後續流程
      // }
      const processedData = selectedData.map((row) => ({
        customerId: row["客戶代號"],
        cus_name: row["客戶名稱"],
        license_plate: row["車號"],
        product_name: row["油品"],
        card_number: row["卡號"],
        cpc_account: row["中油帳號"],
      }));
      // this.Allexport = processedData;
      // console.log(JSON.stringify(this.Allexport))
      // await this.exportExcel();
      try {
       // 發送 GET 請求到指定的 API
        const response = await axios.post(
          "/apiServer/main/insertVehicle_del",
          processedData
        );
        this.Allexport = response.data.data.plate;
        this.Unexport = response.data.data.Unplate;
        await this.export_OLD_Excel();
        await this.exportExcel();
        this.dialogVehicle = true;
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
