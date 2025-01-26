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
          format="YYYY/MM/DD"
          value-format="YYYY/MM/DD"
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
          format="YYYY/MM/DD"
          value-format="YYYY/MM/DD"
          style="margin-right: 20px"
          @change="clink()"
        ></el-date-picker>
      </el-form-item>
    </el-row>
    <el-form-item label="客戶" v-if="cusDataTT == true">
      <el-select
        v-model="customerId"
        placeholder="輸入客戶名稱/客代"
        filterable
        :clearable="true"
        style="width: 200px; margin-right: 20px"
        @change="filterData"
      >
        <!-- 使用 cusdata 直接顯示每個字符串 -->
        <el-option
          v-for="item in cusData"
          :key="item"
          :label="item"
          :value="item.split(' ')[0]"
        ></el-option>
      </el-select>
      <el-form-item label="車牌號碼">
        <el-input
          v-model="searchplate"
          placeholder="輸入車牌號碼"
          style="width: 150px; margin-right: 20px"
          @input="filterData"
        ></el-input>
      </el-form-item>
      <el-form-item label="品項">
        <el-select
          v-model="mode"
          placeholder="選擇品項"
          filterable
          :clearable="true"
          style="width: 150px; margin-right: 20px"
          @change="filterData"
        >
          <el-option label="柴油" :value="'0006'"></el-option>
          <el-option label="汽油" :value="'無鉛'"></el-option>
          <el-option label="國光尿素" :value="'0017'"></el-option>
          <el-option label="諾瓦尿素" :value="'6617'"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-button type="info" @click="printdialog = true">匯出</el-button> -->
    </el-form-item>

    <div class="table-container" v-if="paginatedData && paginatedData.length">
      <el-table :data="paginatedData" style="width: 100%">
        <el-table-column prop="customerId" label="客戶代號" width="100" />
        <el-table-column prop="cus_name" label="客戶姓名" width="150" />
        <el-table-column prop="acc_name" label="帳單名稱" width="150" />
        <el-table-column prop="license_plate" label="車牌" width="100" />
        <el-table-column prop="trade_time" label="交易時間" width="200" />
        <el-table-column prop="account_date" label="結轉日" width="150" />
        <el-table-column prop="fuel_type" label="油品類型" width="150" />
        <el-table-column prop="fuel_type" label="加油站" width="200"
          ><template v-slot="scope"
            >{{ scope.row.station_code + " " + scope.row.station_name }}
          </template></el-table-column
        >
        <el-table-column prop="card_number" label="卡號" width="200" />
        <el-table-column prop="fuel_volume" label="油量" width="100" />
        <el-table-column prop="reference_price" label="參考單價" width="100" />
        <el-table-column
          prop="reference_amount"
          label="參考金額"
          width="100"
          align="right"
        >
          <template v-slot="scope"
            >{{ formatCurrency(scope.row.reference_amount) }}
          </template></el-table-column
        >
        <el-table-column prop="discount" label="折讓" width="100" />
        <el-table-column
          prop="salesAmount"
          label="售價"
          width="100"
          align="right"
        >
          <template v-slot="scope"
            >{{ formatCurrency(scope.row.salesAmount) }}
          </template></el-table-column
        >
      </el-table>
      <div class="pagination-container">
        <div class="pagination-info">
          Showing {{ startItem }} to {{ endItem }} of
          {{ this.filteredData.length }}
        </div>
        <el-pagination
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="this.filteredData.length"
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
      searchplate: "",
      cpcdata: [],
      mode: "",
      cusDataTT: false,
      customerId: "",
      search_month: "",
      search_end_month: "",
      searchplate: "",
      cusData: [],
      filteredData: [],
      bills: [],
      currentPage: 1,
      pageSize: 10,
    };
  },
  created() {
    this.getcus();
    this.getbill();
  },
  computed: {
    startItem() {
      const start = (this.currentPage - 1) * this.pageSize + 1;
      return Math.min(start, this.filteredData.length);
    },
    endItem() {
      const end = this.currentPage * this.pageSize;
      return Math.min(end, this.filteredData.length);
    },
    paginatedData() {
      if (!Array.isArray(this.filteredData)) {
        return []; // 若 `filteredData` 不是陣列，返回空陣列
      }
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredData.slice(start, end);
    },
  },
  methods: {
    // 篩選資料
    filterData() {
      this.filteredData = this.cpcdata.filter((item) => {
        const matchcus =
          !this.customerId || item.customerId === this.customerId;

        // 這裡不再檢查 selectedTradingModel，只根據 searchDate 過濾
        const matchplate =
          !this.searchplate || item.license_plate.includes(this.searchplate);

        const matchmode = !this.mode || item.fuel_type.includes(this.mode);

        return matchcus && matchplate && matchmode;
      });
    },
    async getcus() {
      this.isLoading = true;
      await axios
        .get("http://122.116.23.30:3347/main/selectCustomer")
        .then((response) => {
          this.cusData = response.data.data;
          this.cusData = this.cusData.map(
            (item) => `${item.cus_code} ${item.cus_name}`
          );
        })
        .catch((error) => {
          // 處理錯誤
          console.error("API request failed:", error);
        });
    },
    async getbill() {
      await axios
        .get("http://122.116.23.30:3347/main/selectAccount_sort")
        .then((response) => {
          this.bills = response.data.data;
          this.isLoading = false;
        })
        .catch((error) => {
          // 處理錯誤
          console.error("API request failed:", error);
        });
    },
    async clink() {
      if (this.search_month && this.search_end_month) {
        const postData = {
          date: this.search_month,
          enddate: this.search_end_month,
        };
        this.isLoading = true;
        await axios
          .post("http://122.116.23.30:3347/finance/searchcpcdata", postData)
          .then((response) => {
            if (!Array.isArray(response.data.data)) {
              this.cpcdata = [];
              this.filteredData = [];
              this.cusDataTT = false;
              this.$message({
                message: `查無選擇年月資料`,
                type: "warning",
              });
              this.isLoading = false;
            } else {
              this.cpcdata = response.data.data;
              this.filteredData = this.cpcdata;
              this.cusDataTT = true;
              this.isLoading = false;
            }
          })
          .catch((error) => {
            // 處理錯誤
            this.cpcdata = [];
            this.filteredData = [];
            this.cusDataTT = false;
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
