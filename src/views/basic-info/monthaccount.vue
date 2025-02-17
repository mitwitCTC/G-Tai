<template>
  <ListBar />
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
          @click="changesystemwork('21')"
          >確認帳務</el-button
        >
      </el-form-item>
    </el-form>
    <div class="page-title" style="color: red" v-if="this.month_check == '21'">
      <h5>{{ search_month }}帳務已確認</h5>
    </div>
    <el-table
      :data="mergedData"
      style="width: 100%"
      border
      :row-class-name="tableRowClass"
    >
      <el-table-column prop="customerId" label="客代" width="100" />
      <el-table-column prop="acc_name" label="帳單組" width="300">
        <template v-slot="scope">
          <span v-if="scope.row.isSummary"><b>小計</b></span>
        </template>
      </el-table-column>
      <el-table-column prop="record_count" label="筆數" width="100" />
      <el-table-column prop="className" label="產品" width="100" />
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
      mergedData: [],
      data: [],
    };
  },
  created() {
    
  },
  computed: {},

  methods: {
    async changesystemwork(type) {
      if (!this.search_month) {
        this.$message({
          message: "請先選擇期別",
          type: "error",
        });
        return;
      }
      const result = confirm("此動作無法返回，請確認是否無誤");
      if (result) {
        try {
          // 确保 this.mail 和 this.line 存在
          if (this.mergedData == 0) {
            this.$message({
              message: "本月無核帳資料",
              type: "error",
            });
            return;
          }
          this.isLoading = true; // 開始加載
          // 發送 GET 請求到指定的 API
          const postdata = {
            workDate: this.search_month,
            type: type,
          };
          const response = await axios.post(
            "http://122.116.23.30:3347/finance/changesystemwork",
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
          this.isLoading = false; // 請求完成後關閉加載狀態
        }
      }
    },
    async getsystemwork() {
      try {
        const postdata = {
          workDate: this.search_month,
          type: "21",
        };
        const response = await axios.post(
          "http://122.116.23.30:3347/finance/getsystemwork",
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
      return row.isSummary ? "summary-row" : ""; // 如果是小計，給 class "summary-row"
    },
    updateMergedData() {
      if (!this.data || !this.data.accounting) return;

      let tempData = [];
      this.data.accounting.forEach((item, index) => {
        tempData.push({ ...item, isSummary: false });

        const nextItem = this.data.accounting[index + 1];
        if (!nextItem || nextItem.customerId !== item.customerId) {
          const summary = this.data.accountingSUM.find(
            (sum) => sum.customerId === item.customerId
          );
          if (summary) {
            tempData.push({ ...summary, isSummary: true });
          }
        }
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
          "http://122.116.23.30:3347/finance/searchaccounting",
          postdata
        );
        // 確認 API 回應是否有資料
        if (response.data && response.data.message == "查詢月底核帳") {
          this.data = response.data.data;
          this.updateMergedData(); // 組件初始化時執行
        } else {
          this.data = [];
          this.mergedData = [];
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
</style>
