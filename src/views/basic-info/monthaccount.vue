<template>
   <!-- <ListBar /> -->
  <div class="page-title">
    <h2>{{ pageTitle }}</h2>
  </div>
  <div>
    <BreadCrumb />
  </div>
  <div>
    <el-form :inline="true">
      <el-form-item label="帳單期別">
        <!-- 帳單期別的日期選擇器 -->
        <el-date-picker
          v-model="search_month"
          type="month"
          format="YYYY-MM"
          value-format="YYYY-MM"
          placeholder="請選擇帳單期別"
          style="margin-right: 10px"
          @change="clink()"
        ></el-date-picker>
        <el-button
          type="info"
          @click="handleExport()"
          v-if="mergedData.length > 0"
          >匯出</el-button
        >
        <el-button
          type="primary"
          style="margin-left: 10px"
          v-if="this.month_check != '21'"
          @click="checksys()"
          >確認帳務</el-button
        >
      </el-form-item>
    </el-form>
    <div class="page-title" style="color: red" v-if="this.month_check == '21'">
      <h5>{{ search_month }}帳務已確認</h5>
    </div>
    <div class="page-title" style="color: red" v-if="Allfee">
      <h5>{{ search_month }}製卡費小計:${{ Allfee }}</h5>
    </div>
    <div class="page-title" style="color: red" >
      <h5>(小計金額不含製卡費)</h5>
    </div>
    <el-table
      :data="mergedData"
      style="width: 100%"
      border
      :row-class-name="tableRowClass"
    >
      <el-table-column prop="customerId" label="客代" width="100" />
      <el-table-column prop="cus_name" label="客戶名稱" width="300" />
      <el-table-column prop="acc_name" label="帳單組" width="300">
        <template v-slot="scope">
          <span v-if="scope.row.isSummary"><b>小計</b></span>
        </template>
      </el-table-column>
      <el-table-column prop="record_count" label="筆數" width="100" />
      <el-table-column prop="className" label="產品" width="100">
        <template v-slot="scope">
          <span v-if="scope.row.iscard"><b>製卡費</b></span>
        </template>
      </el-table-column>
      <el-table-column prop="fuel_volume" label="用油" width="150" />
      <el-table-column prop="amount" label="銷售金額" width="150">
        <template v-slot="scope"
          >{{ formatCurrency(scope.row.amount) }}
        </template></el-table-column
      >
      <el-table-column prop="use_number" label="統編" width="100" />
      <el-table-column prop="invoice_name" label="抬頭" />
    </el-table>
  </div>

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
import ExportMonthData from "@/components/ExportMonthData.vue";
import axios from "axios";
export default {
  components: {
    BreadCrumb,
    ListBar,
  },
  data() {
    return {
      isLoading: false,
      search_month: "",
      month_check: "",
      Allfee:"",
      mergedData: [],
      data: [],
    };
  },
  created() {},
  computed: {},

  methods: {
    async checksys() {
      if (!this.search_month) {
        this.$message({
          message: "請先選擇期別",
          type: "error",
        });
        return;
      }
      const result = confirm("此動作無法返回，請確認是否無誤");
      if (result) {
        // 确保 this.mail 和 this.line 存在
        if (this.mergedData == 0) {
          this.$message({
            message: "本月無核帳資料",
            type: "error",
          });
          return;
        }
        this.isLoading = true;
        await this.groupproductid();
        await this.changesystemwork("21");
        this.isLoading = false;
      }
    },
    async groupproductid() {
      try {
        const postdata = {
          salesDate: this.search_month,
        };
        const response = await axios.post(
          "/apiServer/finance/groupproductid",
          postdata
        );
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    async changesystemwork(type) {
      try {
        // 發送 GET 請求到指定的 API
        const postdata = {
          workDate: this.search_month,
          type: type,
        };
        const response = await axios.post(
          "/apiServer/finance/changesystemwork",
          postdata
        );
        if (response.data && response.data.data) {
          this.$message({
            message: "成功",
            type: "success",
          });
          this.getsystemwork();
        }

        // 將資料放入 customers 陣列中
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        this.clink();
      }
    },
    async getsystemwork() {
      try {
        const postdata = {
          workDate: this.search_month,
          type: "21",
        };
        const response = await axios.post(
          "/apiServer/finance/getsystemwork",
          postdata
        );
        // 確認 API 回應是否有資料
        if (response.data && response.data.data.length > 0) {
          this.month_check = response.data.data[0].type;
        } else {
          this.month_check = "";
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    async handleExport() {
      try {
        this.isLoading = true;
        await ExportMonthData.methods.exportExcel(
          this.search_month,
          this.mergedData
        );
        // 顯示成功訊息
        this.$message({
          message: `匯出成功`,
          type: "success",
        });
      } catch {
        this.$message({
          message: `匯出失敗`,
          type: "error",
        });
      } finally {
        this.isLoading = false;
      }
    },
    tableRowClass({ row }) {
      if (row.isSummary) {
        return "summary-row"; // 小計紅色背景
      }
      if (row.iscard) {
        return "card-row"; // 手續費藍色背景
      }
      return "";
    },
    updateMergedData() {
  if (!this.data || !this.data.accounting) return;

  let tempData = [];
  let insertedCardFees = new Set(); // 用來記錄已插入的 cardfee 避免重複

  // 先處理 accounting
  this.data.accounting.forEach((item, index) => {
    tempData.push({ ...item, isSummary: false });

    // 1️⃣ 插入 customerId && use_number 都匹配的 cardfee
    this.data.cardfee
      .filter((fee) => fee.customerId === item.customerId && fee.use_number === item.use_number)
      .forEach((fee) => {
        if (!insertedCardFees.has(fee)) {
          tempData.push({ ...fee, iscard: true });
          insertedCardFees.add(fee); // 標記為已插入
        }
      });

    // 2️⃣ 當 accounting 的 customerId 變更時（處理 customerId 的最後一筆）
    const nextItem = this.data.accounting[index + 1];
    if (!nextItem || nextItem.customerId !== item.customerId) {
      // 插入 customerId 相符但 use_number 不匹配的 cardfee
      this.data.cardfee
        .filter((fee) => fee.customerId === item.customerId && !insertedCardFees.has(fee))
        .forEach((fee) => {
          tempData.push({ ...fee, iscard: true });
          insertedCardFees.add(fee);
        });

      // 3️⃣ 插入 accountingSUM
      const summary = this.data.accountingSUM.find((sum) => sum.customerId === item.customerId);
      if (summary) {
        tempData.push({ ...summary, isSummary: true });
      }
    }
  });

  // 4️⃣ 最後處理完全沒有對應 customerId 的 cardfee
  this.data.cardfee
    .filter((fee) => !this.data.accounting.some(acc => acc.customerId === fee.customerId) && !insertedCardFees.has(fee))
    .forEach((fee) => {
      tempData.push({ ...fee, iscard: true });
      insertedCardFees.add(fee);
    });

  this.mergedData = tempData; // 更新 mergedData
},


    async clink() {
      this.isLoading = true;
      this.getsystemwork();
      await this.getdata();
      this.isLoading = false;
    },
    async getdata() {
      try {
        const postdata = {
          salesDate: this.search_month,
        };
        const response = await axios.post(
          "/apiServer/finance/searchaccounting",
          postdata
        );
        // 確認 API 回應是否有資料
        if (response.data && response.data.message == "查詢月底核帳") {
          this.data = response.data.data;
          this.Allfee=(this.data.SUMcardfee || 0).toLocaleString()
          this.updateMergedData(); // 組件初始化時執行
        } else {
          this.data = [];
          this.mergedData = [];
          this.Allfee=""
          this.$message({
            message: "無資料",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    formatCurrency(value) {
      if (!value) return "0";
      return Number(value).toLocaleString(); // 使用 toLocaleString 進行千分位格式化
    },
  },
};
</script>

<style scoped>
.page-title {
  margin-top: 30px;
  margin-bottom: 30px;
}

:deep(.summary-row) {
  background-color: #ffebee !important; /* 淺紅色背景 */
  color: #d32f2f !important; /* 深紅色文字 */
  font-weight: bold;
}
:deep(.card-row) {
  background-color: #dae2ff !important; /* 淺紅色背景 */
  color: #100deb !important;
  font-weight: bold;
}
</style>
