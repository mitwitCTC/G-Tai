<template>
  <ListBar />
  <h1>{{ text }}</h1>
  <el-form-item label="當日排程" class="section-header">
    <div class="table-container">
      <div v-if="!data || data.length === 0">
        今日尚無執行排程紀錄
      </div>
      <div v-if="data && data.length > 0">
        <el-table :data="data" style="width: 100%" v-loading="loading">
          <el-table-column
            prop="message"
            label="排程"
            width="200"
          ></el-table-column>
          <el-table-column prop="startTime" label="開始時間" width="200" />
          <el-table-column prop="endTime" label="結束時間" width="200" />
        </el-table>
      </div>
    </div>
  </el-form-item>
  <el-dialog
    v-model="loading"
    width="15%"
    title="請稍後..."
    :close-on-click-modal="false"
    :show-close="false"
  ></el-dialog>
</template>

<script>
import ListBar from "@/components/ListBar.vue";
import axios from "axios";
export default {
  components: {
    ListBar,
  },
  data() {
    return {
      text: "首頁",
      loading:true,
      data:[]
      }
  },
   async created() {
      try {
        this.loading = true; // 開始加載
        // 發送 GET 請求到指定的 API
        const response = await axios.post(
          "/apiServer/main/getdaysys"
        );
        // 將資料放入 customers 陣列中
        this.data = response.data.data;

      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        this.loading = false; // 請求完成後關閉加載狀態
      }
  },
};
</script>
<style>
.section-header {
  margin-top: 50px;
  font-weight: bold;
  background-color: #f0ecec; /* 浅灰色背景 */
  border-radius: 10px; /* 圆角 */
  padding: 10px; /* 内边距 */
  margin-bottom: 10px; /* 项目之间的间距 */
}
</style>
