<template>
  <ListBar />
  <div class="page-title">
    <h2>{{ pageTitle }}</h2>
  </div>
  <div>
    <BreadCrumb />
  </div>
  <el-form-item label="查詢結轉日">
    <el-date-picker
      v-model="selectedDate"
      type="date"
      placeholder="選擇結轉日"
      :disabled-date="DateBeforeToday"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      style="width: 300px; margin-right: 20px"
    >
    </el-date-picker>
  </el-form-item>
  <el-form-item label="需發送客戶" class="section-header">
    <div class="table-container">
      <el-table :data="filteredCusMessage" style="width: 100%">
        <el-table-column label="選擇" width="55">
          <template v-slot="scope">
            <el-checkbox v-model="scope.row.selected"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="新增日期" width="150" />
        <el-table-column prop="customerId" label="客戶代號" width="150" />
        <el-table-column prop="cusName" label="客戶名稱" width="200" />
        <el-table-column
          prop="sendMod"
          label="發送方式"
          width="100"
          :formatter="format"
        />
        <el-table-column prop="connectionId" label="發送資訊" width="150" />
        <el-table-column prop="title" label="發送主旨" width="250" />
        <el-table-column prop="content" label="發送內容" width="350" />
      </el-table>
    </div>
  </el-form-item>
</template>

<script>
import ListBar from "@/components/ListBar.vue";
import BreadCrumb from "@/components/BreadCrumb.vue";
import { toRaw } from "vue"; // 引入 `toRaw` 函數
export default {
  components: {
    BreadCrumb,
    ListBar,
  },
  data() {
    return {
      selectedDate: null,
      cus_message: [
        {
          createDate: "2024-11-21",
          customerId: "G130871",
          cusName: "測試",
          sendMod: "1",
          connectionId: "0912000000",
          title: "停油寬限值以下告警",
          content:
            "今日油款餘額為500。請務必確保油金充足，以免影響用油權益，謝謝。鉅泰窗口：02-2798-9967!",
        },
        {
          createDate: "2024-11-21",
          customerId: "G130871",
          cusName: "測試",
          sendMod: "2",
          connectionId: "U6d645af50b0bbc163aa111d62e917aec",
          title: "停油寬限值以下告警",
          content:
            "今日油款餘額為500。請務必確保油金充足，以免影響用油權益，謝謝。鉅泰窗口：02-2798-9967!",
        },
        {
          createDate: "2024-11-20",
          customerId: "G130871",
          cusName: "測試",
          sendMod: "3",
          connectionId: "jutai@gmail.com",
          title: "停油寬限值以下告警",
          content:
            "今日油款餘額為500。請務必確保油金充足，以免影響用油權益，謝謝。鉅泰窗口：02-2798-9967!",
        },
      ],
      type: {
        1: "手機簡訊",
        2: "Line",
        3: "mail",
      },
    };
  },
  computed: {
    // 根據選擇日期動態篩選資料
    filteredCusMessage() {
      if (!this.selectedDate) {
        return this.cus_message; // 如果未選擇日期，顯示所有資料
      }
      return this.cus_message.filter(
        (item) => item.createDate === this.selectedDate
      );
    },
  },
  methods: {
    format(sendMod) {
      const type = toRaw(sendMod);
      return this.type[type.sendMod.toString()] || "未知";
    },
    DateBeforeToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // 將時間設置為當天午夜
      return date.getTime() > today.getTime(); // 禁用今天以後的日期
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
