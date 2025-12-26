<template>
   <!-- <ListBar /> -->
  <div class="page-title">
    <h2>{{ pageTitle }}</h2>
  </div>
  <div>
    <BreadCrumb :isSpecialPage="true" />
  </div>
  <div style="margin: 10px 0">
    <el-form-item label="匯出類別">
      <el-select
        v-model="type"
        placeholder="選擇類別"
        style="width: 300px; margin-right: 20px"
        @change="clean()"
      >
        <el-option label="1.製卡未用油客戶明細" :value="1"></el-option>
        <el-option label="2.停油客戶明細" :value="2"></el-option>
        <!-- <el-option label="3.同期油量比較表" :value="3"></el-option> -->
        <el-option label="4.客戶數統計" :value="4"></el-option>
        <el-option label="5.車輛數統計明細" :value="5"></el-option>
        <el-option label="6.月結客戶明細" :value="6"></el-option>
        <el-option label="7.尿素量明細" :value="7"></el-option>
        <el-option label="8.未使用車輛明細" :value="8"></el-option>
        <el-option label="9.業務員油量報表" :value="9"></el-option>
        <el-option label="10.加油站油量報表" :value="10"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="報表日期" v-if="type != 5 && type != 6">
      <el-date-picker
        v-model="search_month"
        type="date"
        placeholder="請選擇起日"
        format="YYYY-MM-DD"
        :value-format="valueFormat"
        style="margin-right: 20px"
        v-if="type != 2 && type != 3"
      >
      </el-date-picker>
      <el-date-picker
        v-model="search_end_month"
        type="date"
        placeholder="請選擇迄日"
        format="YYYY-MM-DD"
        :value-format="valueFormat"
        style="margin-right: 20px"
        v-if="type != 2 && type != 3"
      ></el-date-picker>
      <el-date-picker
        v-model="search_date"
        type="month"
        placeholder="請選擇日期"
        format="YYYY-MM"
        value-format="YYYY-MM"
        style="margin-right: 20px"
        v-if="type == 2 || type == 3"
      ></el-date-picker>
    </el-form-item>
    <el-button type="info" @click="do_export(type)">匯出</el-button>
  </div>

  <el-dialog
    v-model="isLoading"
    width="15%"
    title="請稍後..."
    :close-on-click-modal="false"
    :show-close="false"
  />
</template>

<script>
import ListBar from "@/components/ListBar.vue";
import BreadCrumb from "@/components/BreadCrumb.vue";
import TablePaginated from "@/components/TablePaginated.vue";
import axios from "axios";
import Export_Data from "@/components/Export_Data.vue";


export default {
  components: {
    BreadCrumb,
    ListBar,
    TablePaginated,
  },
  data() {
    return {
      isLoading: false,
      type: "",
      search_month: "",
      search_end_month: "",
      search_date:""
    };
  },
  created() {},
  computed: {

  valueFormat() {
    // 綁定值格式
    if (this.type == 1 || this.type == 4 || this.type == 8) {
      return "YYYY-MM-DD";
    } else if (  this.type == 7 || this.type == 9 || this.type == 10) {
      return "YYYY/MM/DD";
    } else {
      return "YYYY-MM-DD";
    }
  }
  },
  methods: {
    clean() {
      (this.search_month = ""),
        (this.search_end_month = ""),
        (this.search_date ="")
    },
    async do_export(TYPE) {
      this.isLoading = true; // 開始加載
      let postdata
      if(TYPE!=2 && TYPE!=3){
        postdata={
          type:TYPE,
          startdate:this.search_month,
          enddate:this.search_end_month}
        }else{
          postdata={
          type:TYPE,
          date:this.search_date}
        }
      try {
        const response = await axios.post(
          "/apiServer/main/export_data",
          postdata
        );
        // const response = await axios.post(
        //   "http://127.0.0.1:3347/main/export_data",
        //   postdata
        // );
        if (response.data.returnCode === 0) {
          await Export_Data.methods.Export_Data(TYPE,postdata,response.data);
        } else {
          this.$message({
            message: response.data.message,
            type: "error",
          });
        }
        // 顯示成功訊息
        this.$message({
          message: `匯出成功`,
          type: "success",
        });
      } catch (error) {
        console.error("Error fetching customer data:", error);
        this.$message({
          message: `匯出失敗`,
          type: "error",
        });
      } finally {
        this.isLoading = false; // 請求完成後關閉加載狀態
      }
    },
  },
};
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.pagination-info {
  margin-right: auto; /* 确保分页信息靠左 */
  padding-right: 1100px; /* 可选: 添加右边距以与分页控件分开 */
  white-space: nowrap;
}
.pagination {
  flex: 1;
  text-align: right;
}
.page-title {
  margin-top: 30px;
  margin-bottom: 30px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

.action-icons {
  display: flex;
  gap: 20px; /* 调整图标之间的间距 */
}
.action-icons i {
  cursor: pointer;
  font-size: 20px; /* 调整图标的大小 */
}
</style>
