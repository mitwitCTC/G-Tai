<template>
   <!-- <ListBar /> -->
  <div class="page-title">
    <h2>{{ pageTitle }}</h2>
  </div>
  <div>
    <BreadCrumb />
  </div>

  <el-button type="info" @click="lockList = true">鎖卡名單</el-button>

  <el-form-item label="匯出名單" class="section-header">
    <el-button type="danger" @click="exData">匯出</el-button>
    <div class="table-container">
      <el-table
        :data="Ex_observe"
        style="flex: 1; margin-right: 20px"
        v-loading="loading"
      >
        <el-table-column prop="cus_code" label="客戶代號"></el-table-column>
        <el-table-column prop="cus_name" label="客戶名稱"></el-table-column>
        <el-table-column
          prop="card_status"
          :formatter="Exformat"
          label="狀態"
        ></el-table-column>
      </el-table>
      <el-table :data="Ex_Locked" style="flex: 1" v-loading="loading">
        <el-table-column prop="cus_code" label="客戶代號"></el-table-column>
        <el-table-column prop="cus_name" label="客戶名稱"></el-table-column>
        <el-table-column
          prop="card_status"
          :formatter="Exformat"
          label="狀態"
        ></el-table-column>
      </el-table>
    </div>
  </el-form-item>

  <el-form-item label="修改客戶" class="section-header">
    <el-button type="success" @click="submitData(1)">修改</el-button>
    <div class="table-container">
      <el-table
        :data="observe"
        style="flex: 1; margin-right: 20px"
        v-loading="loading"
      >
        <el-table-column label="選擇" width="55">
          <template v-slot="scope">
            <el-checkbox v-model="scope.row.selected"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="cus_code" label="客戶代號"></el-table-column>
        <el-table-column prop="cus_name" label="客戶名稱"></el-table-column>
        <el-table-column
          prop="card_status"
          :formatter="format"
          label="狀態"
        ></el-table-column>
      </el-table>
      <el-table :data="Locked" style="flex: 1" v-loading="loading">
        <el-table-column label="選擇" width="55">
          <template v-slot="scope">
            <el-checkbox v-model="scope.row.selected"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="cus_code" label="客戶代號"></el-table-column>
        <el-table-column prop="cus_name" label="客戶名稱"></el-table-column>
        <el-table-column
          prop="card_status"
          :formatter="format"
          label="狀態"
        ></el-table-column>
      </el-table>
    </div>
  </el-form-item>

  <el-form-item label="轉觀察客戶(名單僅有正常狀態)">
    <el-select
      v-model="search.customerId"
      placeholder="輸入客戶名稱/客代"
      filterable
      :clearable="true"
      style="width: 300px; margin-right: 20px"
      @change="pushdata"
    >
      <!-- 使用 cusdata 直接顯示每個字符串 -->
      <el-option
        v-for="item in normal"
        :key="item"
        :label="item"
        :value="item.split(' ')[0]"
      ></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="轉修改客戶" class="section-header">
    <el-button type="success" @click="submitData(2)">修改</el-button>
    <div class="table-container">
      <el-table :data="pushNormal" style="flex: 1; margin-right: 20px">
        <el-table-column prop="cus_code" label="客戶代號"></el-table-column>
        <el-table-column prop="cus_name" label="客戶名稱"></el-table-column>
      </el-table>
    </div>
  </el-form-item>

  <el-dialog
    v-model="lockList"
    width="90%"
    :close-on-click-modal="false"
    @close="locklist.cus_code = ''"
  >
    <el-form-item label="查詢客戶">
      <!-- <el-input v-model="form.cus_code" @input="getdata" maxlength="8"></el-input> -->
      <el-select
        v-model="locklist.cus_code"
        placeholder="輸入客戶名稱/客代"
        filterable
        :clearable="true"
        style="width: 300px; margin-right: 20px"
      >
        <!-- 使用 cusdata 直接顯示每個字符串 -->
        <el-option
          v-for="item in cusdata"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="鎖卡名單" class="section-header">
      <div class="table-container">
        <el-table :data="filteredTableData" style="flex: 1; margin-right: 20px">
          <el-table-column prop="customerId" label="客戶代號"></el-table-column>
          <el-table-column prop="cus_name" label="客戶名稱"></el-table-column>
          <el-table-column
            prop="card_type"
            label="卡片類別"
            :formatter="cardformat"
          ></el-table-column>
          <el-table-column prop="card_number" label="卡號"></el-table-column>
          <el-table-column
            prop="upload_time"
            label="上傳中油時間"
          ></el-table-column>
          <el-table-column
            prop="upload_reason"
            label="上傳原因"
          ></el-table-column>
          <el-table-column
            prop="card_arrival_date"
            label="到卡時間"
          ></el-table-column>
        </el-table>
      </div>
    </el-form-item>
  </el-dialog>
  <el-dialog
    v-model="isLoading"
    width="15%"
    title="請稍後..."
    :close-on-click-modal="false"
    :show-close="false"
  ></el-dialog>
  <div style="margin-bottom: 50px"></div>
</template>

<script>
import ListBar from "@/components/ListBar.vue";
import BreadCrumb from "@/components/BreadCrumb.vue";
import ExcelJS from "exceljs";
import dayjs from "dayjs";
import { toRaw } from "vue"; // 引入 `toRaw` 函數
import axios from "axios";
export default {
  components: {
    BreadCrumb,
    ListBar,
  },
  data() {
    return {
      lockList: false,
      isLoading: false,
      cus_code: "",
      normal: [],
      pushNormal: [],
      observe: [],
      Locked: [],
      Ex_observe: [],
      Ex_Locked: [],
      Allexport: [],
      search: {
        customerId: "",
      },
      locklist: {
        cus_code: "",
        list: [],
      },
      Extype: {
        3: "待鎖卡",
        5: "待解卡",
      },
      type: {
        1: "正常",
        2: "觀察",
        4: "已鎖卡",
      },
      cardtype: {
        1: "尿素",
        2: "柴油",
        3: "汽油",
        4: "諾瓦尿素",
      },
      cusdata: [],
      Allnovax: [],
    };
  },
  created() {
    this.getcus();
    this.getlockcard();
  },
  computed: {
    filteredTableData() {
      // 如果沒選擇客代，顯示全部
      if (!this.locklist.cus_code) {
        return this.locklist.list;
      }

      // 過濾出符合的資料
      return this.locklist.list.filter(
        (item) => item.customerId === this.locklist.cus_code
      );
    },
  },
  methods: {
    async exportExcel2() {
      try {
        // 確保資料先完成取得
        const rowsPerFile = 20;
        // 將資料切割成每 20 筆為一組
        const chunkArray = (arr, size) => {
          const result = [];
          for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
          }
          return result;
        };
        const dataChunks = chunkArray(this.Allexport, rowsPerFile); // 將 result 資料按 20 筆一組進行拆分

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

            const rowstitle = [["TT6112060_鉅泰創新股份有限公司"]];
            // 處理資料，生成每一行的數據
            const rowsData = chunk.map((data, index) => {
              // 判斷是否是新增，若是則將 card_number 設為空字串

              return [
                index + 1, // 流水號
                data.license_plate, // 假設 vehicleId 是車牌
                data.card_type === "2" ? "V" : "", // 超級柴油
                data.card_type === "3" ? "V" : "", // 無鉛汽油
                data.card_type === "0005" ? "V" : "", // 酒精汽油
                data.card_type === "0009" ? "V" : "", // 不限油品
                data.card_type === "1" ? "V" : "", // 尿素溶液
                 "", // 新增
                data.isLock == "1" ? "V" : "", // 停用
                "",//遺失
                "", // 故障
                data.isLock == "0" ? "V" : "", // 原卡復油
                data.customerId, // 保管單位
                data.custodian.substring(0, 4), // 公司名稱 (取第9~12個字)
                data.card_number, // 備註
              ];
            });
            worksheet.addTable({
              name: "table名稱", // 表格的名稱
              ref: "C1",
              headerRow: false, // 不需要表頭
              columns: [{ name: "標題" }],
              rows: rowstitle, // 將生成的行數據放入表格
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
            const newFileName = "中油製卡明細.xlsx";
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
    },
    pushdata() {
      const row = {
        cus_code: this.search.customerId.split("：")[0],
        cus_name: this.search.customerId.split("：")[1],
        card_status: "1",
      };
      this.pushNormal.push(row);
      this.search.customerId = "";
    },
    async getlockcard() {
      this.isLoading = true;
      await axios
        .post("/apiServer/main/getlockcard")
        .then((response) => {
          this.locklist.list = response.data.data;
          this.isLoading = false;
        })
        .catch((error) => {
          // 處理錯誤
          console.error("API request failed:", error);
          this.isLoading = false;
        });
    },
    async submitData(type) {
      if (type == 1) {
        if (
          !this.Locked.some((row) => row.selected) &&
          !this.observe.some((row) => row.selected)
        ) {
          this.$message({
            message: "請勾選後再送出",
            type: "error",
          });
          return; // 停止後續執行
        }

        const selectedItemsLocked = this.Locked.filter((row) => row.selected);
        this.isLoading = true;
        for (const item of selectedItemsLocked) {
          await this.updateCardStatus(item.cus_code, item.card_status);
        }
        const selectedItemsobserve = this.observe.filter((row) => row.selected);
        for (const item of selectedItemsobserve) {
          await this.updateCardStatus(item.cus_code, item.card_status);
        }
      } else if (type == 2) {
        if (this.pushNormal.length == 0) {
          this.$message({
            message: "加入名單後再送出",
            type: "error",
          });
          return; // 停止後續執行
        }

        const selectedpushNormal = this.pushNormal;
        this.isLoading = true;
        for (const item of selectedpushNormal) {
          await this.updateCardStatus(item.cus_code, item.card_status);
        }
      }

      this.getcus();
      this.isLoading = false;
    },
    async updateCardStatus(cus_code, card_status) {
      const processedData = {
        cus_code: cus_code,
        card_status: card_status,
      };
      try {
        const response = await axios.post(
          "/apiServer/main/updateCuscardStatus",
          processedData
        );
        console.log("成功送出:", processedData, "回應:", response.data);
      } catch (error) {
        console.error("送出失敗:", processedData, "錯誤:", error);
        this.$message({
          message: `送出失敗: ${item.cus_code}`,
          type: "error",
        });
      }
    },
    async exportCardStatus(cus_code, card_status) {
      try {
        const processedData = {
          cus_code: cus_code,
          card_status: card_status,
        };
        const response = await axios.post(
          "/apiServer/main/exportCuscardStatus",
          processedData
        );
        console.log("成功送出:", processedData, "回應:", response.data);
      } catch (error) {
        console.error("送出失敗:", processedData, "錯誤:", error);
        this.$message({
          message: `送出失敗: ${item.cus_code}`,
          type: "error",
        });
      }
    },
    async doData(cus_code, isLock) {
      try {
        const processedData = {
          cus_code: cus_code,
        };
        const response = await axios.post(
          "/apiServer/main/getcpclock",
          processedData
        );
        if (Array.isArray(response.data.data)) {
          // 每筆資料都加上 isLock = '0'
          const dataWithLock = response.data.data.map((item) => ({
            ...item,
            isLock: isLock,
          }));

          this.Allexport.push(...dataWithLock);
        }
      } catch (error) {
        console.error("送出失敗:", processedData, "錯誤:", error);
        this.$message({
          message: `送出失敗: ${item.cus_code}`,
          type: "error",
        });
      }
    },
    async donovaxData(cus_code) {
      try {
        const processedData = {
          cus_code: cus_code,
        };
        const response = await axios.post(
          "/apiServer/main/getnovaxlock",
          processedData
        );
        // 假設 this.Allexport 已是陣列
        if (Array.isArray(response.data.data)) {
          this.Allnovax.push(...response.data.data); // 展開加入
        }
      } catch (error) {
        console.error("送出失敗:", processedData, "錯誤:", error);
        this.$message({
          message: `送出失敗: ${item.cus_code}`,
          type: "error",
        });
      }
    },
    async exData() {
      if (this.Ex_observe.length == 0 && this.Ex_Locked.length == 0) {
        this.$message({
          message: "無可匯出資料",
          type: "error",
        });
        return; // 停止後續執行
      }
      this.Allexport = [];
      this.Allnovax = [];
      this.isLoading = true;
      console.log("1查詢卡號資料");
      for (const item of this.Ex_observe) {
        await this.donovaxData(item.cus_code);
        await this.doData(item.cus_code, "1");
      }
      for (const item of this.Ex_Locked) {
        await this.donovaxData(item.cus_code);
        await this.doData(item.cus_code, "0");
      }
      console.log(JSON.stringify(this.Allexport));
      console.log("1結束");
      await this.exportExcel();
      await this.exportNovaxExcel();
      await this.exportExcel2();
      for (const item of this.Ex_observe) {
        await this.exportCardStatus(item.cus_code, item.card_status);
      }
      for (const item of this.Ex_Locked) {
        await this.exportCardStatus(item.cus_code, item.card_status);
      }
      this.getcus();
      this.getlockcard();
      this.isLoading = false;
    },
    async updateCardStatus(cus_code, card_status) {
      try {
        const processedData = {
          cus_code: cus_code,
          card_status: card_status,
        };
        const response = await axios.post(
          "/apiServer/main/updateCuscardStatus",
          processedData
        );
        console.log("成功送出:", processedData, "回應:", response.data);
      } catch (error) {
        console.error("送出失敗:", processedData, "錯誤:", error);
        this.$message({
          message: `送出失敗: ${item.cus_code}`,
          type: "error",
        });
      }
    },
    cardformat(card_type) {
      const type = toRaw(card_type);
      return this.cardtype[type.card_type] || "未知";
    },
    Exformat(card_status) {
      const type = toRaw(card_status);
      return this.Extype[type.card_status] || "未知";
    },
    format(card_status) {
      const type = toRaw(card_status);
      return this.type[type.card_status] || "未知";
    },
    async getcus() {
      this.isLoading = true;
      this.pushNormal = [];
      this.normal = [];
      this.observe = [];
      this.Locked = [];
      this.Ex_observe = [];
      this.Ex_Locked = [];
      await axios
        .get("/apiServer/main/selectCustomer")
        .then((response) => {
          this.cusdata = response.data.data;
          this.cusdata = this.cusdata.map(
            (item) => `${item.cus_code} ${item.cus_name}`
          );
          this.normal = response.data.data.filter(
            (data) => data.card_status === "1"
          );
          this.normal = this.normal.map(
            (item) => `${item.cus_code}：${item.cus_name}`
          );
          this.observe = response.data.data.filter(
            (data) => data.card_status === "2"
          );
          this.Locked = response.data.data.filter(
            (data) => data.card_status === "4"
          );
          this.Ex_observe = response.data.data.filter(
            (data) => data.card_status === "3"
          );
          this.Ex_Locked = response.data.data.filter(
            (data) => data.card_status === "5"
          );
          this.isLoading = false;
        })
        .catch((error) => {
          // 處理錯誤
          console.error("API request failed:", error);
          this.isLoading = false;
        });
    },
    async exportNovaxExcel() {
      try {
        // 確保資料先完成取得
        const workbook = new ExcelJS.Workbook();
        const fr = new FileReader();
        const response = await fetch(
          new URL("@/assets/諾瓦製卡明細.xlsx", import.meta.url).href
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
        //開始填充資料
        this.Allnovax.forEach((data, index) => {
          const rowIndex = index + 2; // 從 A2 開始
          worksheet.getCell(`A${rowIndex}`).value = index + 1;
          worksheet.getCell(`B${rowIndex}`).value = data.customerId || "";
          worksheet.getCell(`C${rowIndex}`).value = data.license_plate || "";
          worksheet.getCell(`D${rowIndex}`).value = data.card_number || "";
          worksheet.getCell(`E${rowIndex}`).value = this.getDateTime_YYYYMMDD();
          worksheet.getCell(`F${rowIndex}`).value =
            data.card_status == "5"
              ? "恢復"
              : data.card_status == "3"
              ? "取消"
              : "";
        });
        // worksheet.getColumn(5).width = 15;
        // worksheet.getColumn(13).width = 25;
        // worksheet.getColumn(4).width = 60;
        // 生成下載鏈接並觸發下載
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `諾瓦製卡明細.xlsx`; // 設定下載檔案名
        link.click();
      } catch (error) {
        console.error("Error during export to Excel:", error);
      }
    },
    async exportExcel() {
      console.log("4 匯出");
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
        //開始填充資料
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
          worksheet.getCell(`E${rowIndex}`).value =
            data.card_type == 1
              ? "0017"
              : data.card_type == 2
              ? "0006"
              : data.card_type == 3
              ? "0001"
              : ""; // 預設為空字串，如果沒有匹配
          worksheet.getCell(`F${rowIndex}`).value = "C";
          worksheet.getCell(`H${rowIndex}`).value = 7;
          worksheet.getCell(`I${rowIndex}`).value = data.card_number;
          worksheet.getCell(`J${rowIndex}`).value =
            data.card_status == "5" ? "" : data.card_status == "3" ? "C" : "";
          worksheet.getCell(`K${rowIndex}`).value = data.license_plate;
          worksheet.getCell(`O${rowIndex}`).value = "A";
          worksheet.getCell(`P${rowIndex}`).value = 0;
          worksheet.getCell(`Q${rowIndex}`).value = 0;
          worksheet.getCell(`R${rowIndex}`).value = "Y";
          worksheet.getCell(`S${rowIndex}`).value = "N";
          worksheet.getCell(`T${rowIndex}`).value = "N";
          worksheet.getCell(`U${rowIndex}`).value = "N";
          worksheet.getCell(`V${rowIndex}`).value =
            data.card_type == 2 ? "Y" : data.card_type == 3 ? "N" : ""; // 預設為空字串，如果沒有匹配
          worksheet.getCell(`W${rowIndex}`).value = "N";
        });
        // worksheet.getColumn(5).width = 15;
        // worksheet.getColumn(13).width = 25;
        // worksheet.getColumn(4).width = 60;
        // 生成下載鏈接並觸發下載
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `中油解鎖卡檔.xlsx`; // 設定下載檔案名
        link.click();
        console.log("4匯出結束");
      } catch (error) {
        console.error("Error during export to Excel:", error);
      }
    },
    getDateTime_YYYYMMDD(input = null, timeFormat = "YYYY-MM-DD", day = 0) {
      let date = input ? input : new Date();
      let dateTime = dayjs(date).add(day, "days").format(timeFormat);
      return dateTime;
    },
  },
};
</script>

<style scoped>
.page-title {
  margin-top: 30px;
  margin-bottom: 30px;
}
.section-header {
  margin-top: 50px;
  background-color: #f0ecec; /* 浅灰色背景 */
  border-radius: 10px; /* 圆角 */
  padding: 10px; /* 内边距 */
  margin-bottom: 10px; /* 项目之间的间距 */
}

.table-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
