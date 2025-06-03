<template>
  <ListBar />
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
    <el-button type="success" @click="submitData">修改</el-button>
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
          :value="item.split(' ')[0]"
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
      observe: [],
      Locked: [],
      Ex_observe: [],
      Ex_Locked: [],
      Allexport: [],
      locklist: {
        cus_code: "",
        list: [],
      },
      Extype: {
        3: "待鎖卡",
        5: "待解卡",
      },
      type: {
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
    async getlockcard() {
      this.isLoading = true;
      await axios
        .post("http://122.116.23.30:3347/main/getlockcard")
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
    async submitData() {
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
          "http://122.116.23.30:3347/main/updateCuscardStatus",
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
          "http://122.116.23.30:3347/main/exportCuscardStatus",
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
    async doData(cus_code) {
      try {
        const processedData = {
          cus_code: cus_code,
        };
        const response = await axios.post(
          "http://122.116.23.30:3347/main/getcpclock",
          processedData
        );
        // 假設 this.Allexport 已是陣列
        if (Array.isArray(response.data.data)) {
          this.Allexport.push(...response.data.data); // 展開加入
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
      this.isLoading = true;
      console.log("1查詢卡號資料");
      for (const item of this.Ex_observe) {
        await this.doData(item.cus_code);
      }
      for (const item of this.Ex_Locked) {
        await this.doData(item.cus_code);
      }
      console.log("1結束");

      await this.exportExcel();
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
          "http://122.116.23.30:3347/main/updateCuscardStatus",
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
      this.observe = [];
      this.Locked = [];
      this.Ex_observe = [];
      this.Ex_Locked = [];
      await axios
        .get("http://122.116.23.30:3347/main/selectCustomer")
        .then((response) => {
          this.cusdata = response.data.data;
          this.cusdata = this.cusdata.map(
            (item) => `${item.cus_code} ${item.cus_name}`
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

    async exportExcel() {
      console.log("4 匯出");
      try {
        // 確保資料先完成取得
        const workbook = new ExcelJS.Workbook();
        const fr = new FileReader();
        const response = await fetch(
          new URL("@/assets/卡片停用檔.xlsx", import.meta.url).href
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
          worksheet.getCell(`A${rowIndex}`).value = data.cpc_account || "";
          worksheet.getCell(`B${rowIndex}`).value = data.cpc_account || "";
          worksheet.getCell(`C${rowIndex}`).value = data.customerId || "";
          worksheet.getCell(`E${rowIndex}`).value = data.license_plate || "";
          worksheet.getCell(`L${rowIndex}`).value = "U";
          worksheet.getCell(`M${rowIndex}`).value = data.card_number
            ? data.card_number.replace(/#/g, "'")
            : "";
          worksheet.getCell(`N${rowIndex}`).value = "Y";
          worksheet.getCell(`O${rowIndex}`).value = "Y";
          worksheet.getCell(`P${rowIndex}`).value = "N";
          worksheet.getCell(`S${rowIndex}`).value = "B";
          worksheet.getCell(`U${rowIndex}`).value = "A";
          worksheet.getCell(`V${rowIndex}`).value = "N";
          worksheet.getCell(`X${rowIndex}`).value = "7";
          worksheet.getCell(`D${rowIndex}`).value =
            data.card_type == 1
              ? "'0017"
              : data.card_type == 2
              ? "'0006"
              : data.card_type == 3
              ? "'0001"
              : ""; // 預設為空字串，如果沒有匹配
          worksheet.getCell(`W${rowIndex}`).value =
            data.card_type == 1
              ? "OTR"
              : data.card_type == 2
              ? "OIL"
              : data.card_type == 3
              ? "OIL"
              : ""; // 預設為空字串，如果沒有匹配;
          worksheet.getCell(`T${rowIndex}`).value =
            data.card_status == 5 ? "" : data.card_status == 3 ? "C" : ""; // 預設為空字串，如果沒有匹配
        });
        worksheet.getColumn(5).width = 15;
        worksheet.getColumn(13).width = 25;
        // worksheet.getColumn(4).width = 60;
        // 生成下載鏈接並觸發下載
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `卡片停用檔.xlsx`; // 設定下載檔案名
        link.click();
        console.log("4匯出結束");
      } catch (error) {
        console.error("Error during export to Excel:", error);
      }
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
