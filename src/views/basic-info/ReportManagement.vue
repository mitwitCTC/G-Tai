<template>
  <ListBar />
  <div class="page-title">
    <h2>{{ pageTitle }}</h2>
  </div>
  <div>
    <BreadCrumb />
  </div>

  <el-form-item label="匯出名單" class="section-header">
    <el-button type="danger" @click="dialog">匯出</el-button>
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
  <!-- <el-form-item label="自動發送客戶" class="section-header">
    <div class="table-container">
      <el-table :data="this.cus_message" style="width: 100%">
        <el-table-column label="選擇" width="55">
          <template v-slot="scope">
            <el-checkbox v-model="scope.row.selected"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="新增日期" width="150" />
        <el-table-column prop="customerId" label="客戶代號" width="150" />
        <el-table-column prop="cusName" label="客戶名稱" width="200" />
        <el-table-column prop="contract_sales" label="負責業務" width="100" />
        <el-table-column
          prop="sendMod"
          label="發送方式"
          width="100"
          :formatter="format"
        />
        <el-table-column prop="connectionId" label="發送資訊" width="150" />
        <el-table-column prop="title" label="發送主旨" width="200" />
        <el-table-column prop="content" label="發送內容" width="200" />
        <el-table-column prop="notused" label="未用油天數" width="100" />
      </el-table>
    </div>
  </el-form-item> -->
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
      observe: [],
      Locked: [],
      Ex_observe: [],
      Ex_Locked: [],
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
      if ((!this.Locked.some((row) => row.selected)) && !this.observe.some((row) => row.selected)) {
        this.$message({
          message: "請勾選後再送出",
          type: "error",
        });
        return; // 停止後續執行
      }
      
      const selectedItemsLocked = this.Locked.filter((row) => row.selected);
      this.isLoading = true;
      for (const item of selectedItemsLocked) {
       await this.updateCardStatus(item.cus_code,item.card_status)
      }
      const selectedItemsobserve = this.observe.filter((row) => row.selected);
      this.isLoading = true;
      for (const item of selectedItemsobserve) {
       await this.updateCardStatus(item.cus_code,item.card_status)
      }
      this.isLoading = false;
    },
    async updateCardStatus(cus_code,card_status) {
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
    async exportExcel() {
      console.log("組成資料");
      await this.doData();
      console.log("組成結束");
      console.log("匯出");
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

        // 開始填充資料
        this.Allexport.forEach((contact, index) => {
          const rowIndex = index + 2; // 從 A2 開始
          worksheet.getCell(`A${rowIndex}`).value = contact.customerId || ""; // 插入 customerId
          worksheet.getCell(`B${rowIndex}`).value = contact.cus_name || "";
          worksheet.getCell(`C${rowIndex}`).value = contact.mail_address || "";
          worksheet.getCell(`D${rowIndex}`).value = contact.billMail || "";
          worksheet.getCell(`E${rowIndex}`).value = contact.job_title || "";
          worksheet.getCell(`F${rowIndex}`).value = contact.name || "";
          worksheet.getCell(`G${rowIndex}`).value = contact.mobile || "";
          worksheet.getCell(`H${rowIndex}`).value = contact.notes || "";
          worksheet.getCell(`I${rowIndex}`).value = contact.employee_name || "";
        });
        worksheet.getColumn(2).width = 50;
        worksheet.getColumn(3).width = 60;
        worksheet.getColumn(4).width = 60;

        // 生成下載鏈接並觸發下載
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `卡片停用檔.xlsx`; // 設定下載檔案名
        link.click();

        console.log("匯出結束");
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
