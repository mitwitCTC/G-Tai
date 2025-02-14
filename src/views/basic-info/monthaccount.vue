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
      </el-form-item>
    </el-form>
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
      mergedData: [],
      data: [],
    };
  },
  created() {},
  computed: {},

  methods: {
    async handleExport() {
      try {
        this.isLoading = true;
        await ExportMonthData.methods.exportExcel(this.search_month,this.mergedData);
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
