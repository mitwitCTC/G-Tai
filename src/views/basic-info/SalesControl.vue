<template>
  <ListBar />
  <div class="page-title">
    <h2>{{ pageTitle }}</h2>
  </div>
  <div>
    <BreadCrumb />
  </div>
  <el-form-item label="查詢結帳日">
    <el-date-picker
      v-model="selectedDate"
      type="date"
      placeholder="選擇結帳日"
      :disabled-date="DateBeforeToday"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      style="width: 300px; margin-right: 20px"
      @change="Defnotify"
    >
    </el-date-picker>
    <el-button type="primary" @click="submitData">送出</el-button>
  </el-form-item>
  <el-form-item label="手動發送客戶" class="section-header">
    <div class="table-container">
      <el-table :data="this.cus_PerMes" style="width: 100%">
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
  </el-form-item>
  <el-form-item label="自動發送客戶" class="section-header">
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
      selectedDate: null,
      cus_message: [],
      cus_PerMes: [],
      AllCustomer:[],
      type: {
        1: "手機簡訊",
        2: "Line",
        3: "mail",
      },
    };
  },
  computed: {},
  methods: {
    async submitData() {
      if (!this.cus_message.some((row) => row.selected)) {
        this.$message({
          message: "請勾選後再送出",
          type: "error",
        });
        return; // 停止後續執行
      }
      this.isLoading = true;
      const selectedData = this.cus_message.filter((row) => row.selected);
      const processedData = {
        id: selectedData.map((row) => row.id),
      };
      await axios
        .post("http://122.116.23.30:3347/main/setDefnotify", processedData)
        .then((response) => {
          if (response.data.returnCode === 0) {
            this.isLoading = false;
            // 成功提示
            this.$message({
              message: "修改成功",
              type: "success",
            });
            // 清除所有勾選框
            this.cus_message.forEach((row) => {
              row.selected = false; // 直接將 selected 設為 false
            });
            this.selectedDate = null;
            this.Defnotify();
          } else {
            // 處理非 0 成功代碼
            this.isLoading = false;
            this.$message({
              message: "新增失敗",
              type: "error",
            });
          }
        })
        .catch((error) => {
          // 處理錯誤
          console.error("API request failed:", error);
        });
    },
    format(sendMod) {
      const type = toRaw(sendMod);
      return this.type[type.sendMod.toString()] || "未知";
    },
    DateBeforeToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // 將時間設置為當天午夜
      return date.getTime() > today.getTime(); // 禁用今天以後的日期
    },
    async Defnotify() {
      this.isLoading = true;
      this.cus_message = [];
      this.cus_PerMes = [];
      const postdata = {
        createDate: this.selectedDate,
      };
      await axios
        .post("http://122.116.23.30:3347/main/selectDefnotify", postdata)
        .then((response) => {
          if (response.data.data.length > 0) {
            this.AllCustomer=response.data.data
            this.AllCustomer.sort((a, b) => {
              // 字串排序（假設 customerId 是字串，根據字典順序）
              return a.customerId.localeCompare(b.customerId);
            });
            response.data.data.forEach((item) => {
              if (item.sendMod == 0) {
                // 如果 sendMod 是 0，加入 cus_PerMes
                this.cus_PerMes.push(item);
              } else {
                // 否則加入 cus_message
                this.cus_message.push(item);
              }
            });
          } else {
            this.$message({
              message: "此日期無資料",
              type: "warning",
            });
          }
          this.isLoading = false;
        })
        .catch((error) => {
          // 處理錯誤
          console.error("API request failed:", error);
          this.isLoading = false;
        });
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
</style>
