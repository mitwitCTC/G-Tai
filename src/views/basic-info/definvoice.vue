<template>
  <ListBar />
  <div class="page-title">
    <h2>{{ pageTitle }}</h2>
  </div>
  <div>
    <BreadCrumb />
  </div>
  <div>
    <el-row>
      <el-form-item label="結轉起日">
        <el-date-picker
          v-model="search_month"
          type="date"
          placeholder="請選擇結轉日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="margin-right: 20px"
          @change="clink()"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="結轉迄日">
        <el-date-picker
          v-model="search_end_month"
          type="enddate"
          placeholder="請選擇結轉日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="margin-right: 20px"
          @change="clink()"
        ></el-date-picker>
      </el-form-item>
    </el-row>

    <div class="table-container" v-if="paginatedData && paginatedData.length">
      <el-table :data="paginatedData" style="width: 100%">
        <el-table-column prop="mode" label="狀態" width="80"
          ><template #default="scope">
            <span v-if="scope.row.mode === '1'">開立</span>
            <span v-else-if="scope.row.mode === '2'">作廢</span>
            <span v-else>未知</span>
            <!-- 可選，處理其他值的情況 -->
          </template>
        </el-table-column>
        <el-table-column prop="word_track" label="發票號碼" width="150"
          ><template v-slot="scope"
            >{{ scope.row.word_track + " " + scope.row.number }}
          </template></el-table-column
        >
        <el-table-column prop="customerId" label="客戶代號" width="100" />
        <el-table-column prop="cus_name" label="客戶名稱" width="200" />
        <el-table-column prop="acc_name" label="帳單名稱" width="200" />
        <el-table-column prop="invoiceDate" label="發票日期" width="150" />
        <el-table-column
          prop="Amount"
          label="金額(含稅)"
          width="100"
          align="right"
        >
          <template v-slot="scope"
            >{{ formatCurrency(scope.row.Amount) }}
          </template></el-table-column
        >
        <el-table-column prop="Bidentifier" label="統編" width="150" />
        <el-table-column prop="BName" label="抬頭" width="200" />
        <el-table-column prop="InvoiceIdCount" label="開立明細數" width="100" />
        <el-table-column prop="QuantitySum" label="數量總計" width="150" />
      </el-table>
      <div class="pagination-container">
        <div class="pagination-info">
          Showing {{ startItem }} to {{ endItem }} of
          {{ this.invoice.length }}
        </div>
        <el-pagination
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="this.invoice.length"
          layout="prev, pager, next, jumper"
          class="pagination"
        />
      </div>
    </div>
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
      search_end_month: "",
      invoice: [],
      currentPage: 1,
      pageSize: 10,
    };
  },
  created() {},
  computed: {
    startItem() {
      const start = (this.currentPage - 1) * this.pageSize + 1;
      return Math.min(start, this.invoice.length);
    },
    endItem() {
      const end = this.currentPage * this.pageSize;
      return Math.min(end, this.invoice.length);
    },
    paginatedData() {
      if (!Array.isArray(this.invoice)) {
        return []; // 若 `filteredData` 不是陣列，返回空陣列
      }
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.invoice.slice(start, end);
    },
  },
  methods: {
    async clink() {
      if (this.search_month && this.search_end_month) {
        const postData = {
          date: this.search_month,
          enddate: this.search_end_month,
        };
        this.isLoading = true;
        await axios
          .post("http://122.116.23.30:3347/finance/searchdefinvoice", postData)
          .then((response) => {
            if (!Array.isArray(response.data.data)) {
              this.invoice = [];
              this.$message({
                message: `查無選擇年月資料`,
                type: "warning",
              });
              this.isLoading = false;
            } else {
              this.invoice = response.data.data;
              this.isLoading = false;
            }
          })
          .catch((error) => {
            // 處理錯誤
            this.invoice = [];
            console.error("API request failed:", error);
            this.isLoading = false;
          });
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
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
.action-icons {
  display: flex;
  gap: 20px; /* 调整图标之间的间距 */
}
.action-icons i {
  cursor: pointer;
  font-size: 20px; /* 调整图标的大小 */
}
.section-header {
  margin-top: 50px;
  font-weight: bold;
  background-color: #f0ecec; /* 浅灰色背景 */
  border-radius: 10px; /* 圆角 */
  padding: 10px; /* 内边距 */
  margin-bottom: 10px; /* 项目之间的间距 */
}
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.pagination-info {
  margin-right: auto; /* 确保分页信息靠左 */
  padding-right: 890px; /* 可选: 添加右边距以与分页控件分开 */
  white-space: nowrap;
}
.pagination {
  flex: 1;
  text-align: right;
}
</style>
