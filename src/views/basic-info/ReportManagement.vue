<template>
  <ListBar />
  <div class="page-title">
    <h2>{{ pageTitle }}</h2>
  </div>
  <div>
    <BreadCrumb />
  </div>

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
      isLoading: false,
      cus_code: "",
      observe: [],
      Locked: [],
      Ex_observe: [],
      Ex_Locked: [],
      Allcard: [],
      Vehicle: [],
      Allexport: [],
      Extype: {
        3: "待鎖卡",
        5: "待解卡",
      },
      type: {
        2: "觀察",
        4: "已鎖卡",
      },
    };
  },
  created() {
    this.getcus();
  },
  computed: {},
  methods: {
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
    async exData() {
      if ((this.Ex_observe.length == 0) && (this.Ex_Locked.length == 0)) {
        this.$message({
          message: "無可匯出資料",
          type: "error",
        });
        return; // 停止後續執行
      }
      this.Allexport = [];
      this.isLoading = true;
      console.log("1查詢卡號資料");
      await this.getselectCARData();
      console.log("1結束");
      console.log("2查詢車籍資料");
      await this.getselectVEHData();
      console.log("2結束");
      console.log("3組成資料");
      this.Allcard = this.Allcard.filter((Allcard) => {
        // 嘗試找到對應的車籍資料
        const Vehicle = this.Vehicle.find(
          (v) => v.vehicleId === Allcard.vehicleId
        );
        // 如果沒有找到對應的 vehicleId，則返回 false，把該筆資料過濾掉
        return Vehicle !== undefined;
      });
      this.OriginalData = this.Allcard.map((Allcard) => {
        // 找到對應的車籍
        const Vehicle = this.Vehicle.find(
          (v) => v.vehicleId === Allcard.vehicleId
        );
        const customerId = Vehicle ? Vehicle.customerId : "";
        const license_plate = Vehicle ? Vehicle.license_plate : "";

        // 4. 將資料組合起來
        return {
          ...Allcard,
          customerId,
          license_plate,
        };
      });
      for (const item of this.Ex_observe) {
        await this.doData(item.cus_code, item.card_status);
      }
      for (const item of this.Ex_Locked) {
        await this.doData(item.cus_code, item.card_status);
      }
      console.log(JSON.stringify(this.Allexport));
      console.log("3結束");
      for (const item of this.Ex_observe) {
        await this.exportCardStatus(item.cus_code, item.card_status);
      }
      for (const item of this.Ex_Locked) {
        await this.exportCardStatus(item.cus_code, item.card_status);
      }
      this.exportExcel();
      this.getcus();
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
    async getselectCARData() {
      try {
        // 發送 GET 請求到指定的 API
        const response = await axios.get(
          "http://122.116.23.30:3347/main/selectAllCard"
        );
        // 將資料放入 customers 陣列中
        this.Allcard = response.data.data.filter(
          //油
          (card) =>
            card.buildType == "3" &&
            (card.card_type === "1" ||
              card.card_type === "2" ||
              card.card_type === "3")
        );
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    async getselectVEHData() {
      try {
        // 發送 GET 請求到指定的 API
        const response = await axios.get(
          "http://122.116.23.30:3347/main/selectVehicle "
        );
        this.Vehicle = response.data.data;
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    async doData(cus_code, card_status) {
      const filteredData = this.OriginalData.filter(
        (item) => item.customerId === cus_code
      ).map((item) => {
        // 新增 card_status 欄位
        return {
          ...item, // 保留原資料
          card_status: card_status, // 為每個項目新增 card_status 欄位，值可根據需求更改
        };
      });

      this.Allexport = [...this.Allexport, ...filteredData];
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
          worksheet.getCell(`M${rowIndex}`).value = data.card_number || "";
          worksheet.getCell(`N${rowIndex}`).value = "Y";
          worksheet.getCell(`O${rowIndex}`).value = "Y";
          worksheet.getCell(`P${rowIndex}`).value = "N";
          worksheet.getCell(`S${rowIndex}`).value = "B";
          worksheet.getCell(`U${rowIndex}`).value = "A";
          worksheet.getCell(`V${rowIndex}`).value = "N";
          worksheet.getCell(`X${rowIndex}`).value = "7";
          worksheet.getCell(`D${rowIndex}`).value =
            data.card_type == 1
              ? "0017"
              : data.card_type == 2
              ? "'0006"
              : data.card_type == 3
              ? "0001"
              : ""; // 預設為空字串，如果沒有匹配
          worksheet.getCell(`W${rowIndex}`).value = data.card_type == 1
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
