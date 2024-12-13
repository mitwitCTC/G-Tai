<template>
  <ListBar />
  <div class="page-title">
    <h2>{{ pageTitle }}</h2>
  </div>
  <div>
    <BreadCrumb />
    <div>
      <el-form-item label="客戶代號">
        <!-- <el-input v-model="this.customerId" placeholder="輸入客戶代號" style="width: 225px; margin-right:20px;" @input="inputdata" maxlength="8" ></el-input> -->
        <el-select
          v-model="this.customerId"
          @clear="clearFilterbill"
          placeholder="輸入客戶名稱/客代"
          filterable
          :clearable="true"
          style="width: 400px; margin-right: 20px"
          @change="getdata"
        >
          <!-- 使用 cusdata 直接顯示每個字符串 -->
          <el-option
            v-for="item in cusdata"
            :key="item"
            :label="item"
            :value="item.split(' ')[0]"
          ></el-option>
        </el-select>
      </el-form-item>
    </div>

    <el-table :data="DiscountData" style="width: 100%" v-loading="loading">
      <el-table-column
        prop="product_name"
        label="產品名稱"
        :formatter="formatProduct"
        width="300"
      />
      <el-table-column prop="discount_float" label="折讓" width="250" />
      <el-table-column label="操作">
        <template v-slot="scope">
          <div class="action-icons">
            <i class="fas fa-edit" @click="editItem(scope.row)"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="更改折讓"
      v-model="dialogpage"
      width="60%"
      @close="handleClear"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="120px">
        <!-- 统一標籤寬度 -->
        <el-row style="margin-bottom: 20px">
          <el-form-item label="欲修改客戶代號">
            <el-input v-model="form.customerId" readonly></el-input>
          </el-form-item>
        </el-row>
        <el-form-item label="產品名稱">
          <el-select
            v-model="form.product_name"
            placeholder="選擇油品"
            disabled
          >
            <el-option
              style="width: 300px"
              v-for="id in productMap"
              :key="id.id"
              :label="id.className"
              :value="id.classId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="折讓">
          <el-input
            v-model="form.discount_float"
            style="width: 300px"
            @input="validateFloat"
          ></el-input>
        </el-form-item>
        <el-form-item label="結轉日">
          <el-date-picker
            v-model="this.form.newdate"
            type="date"
            placeholder="選擇結轉日"
            :disabled-date="DateBeforeToday"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 300px"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="savePass()">送出</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="isLoading"
      width="15%"
      title="請稍後..."
      :close-on-click-modal="false"
      :show-close="false"
    >
      <!-- 這裡是你的表單或內容 -->
    </el-dialog>
    <div style="margin-bottom: 50px"></div>
  </div>
</template>

<script>
import ListBar from "@/components/ListBar.vue";
import BreadCrumb from "@/components/BreadCrumb.vue";
import axios from "axios";
import { toRaw } from "vue";
export default {
  components: {
    BreadCrumb,
    ListBar,
  },
  data() {
    return {
      dialogpage: false,
      isLoading: false,
      customerId: "",
      DiscountData: [],
      cusdata: [],
      productMap: [],
      form: {},
    };
  },
  created() {
    this.getcusdata();
    this.getproduct_name();
  },
  computed: {},

  methods: {
    async savePass() {
      if (
        !this.form.customerId ||
        !this.form.product_name ||
        !this.form.discount_float ||
        !this.form.newdate
      ) {
        this.$message({
          message: "欄位不可為空",
          type: "error",
        });
        return;
      }
      const postData = {
        customerId: this.form.customerId,
        product_name: this.form.product_name,
        discount_float: this.form.discount_float,
        date: this.form.newdate,
      };
      this.isLoading = true; // 請求開始，顯示 loading 標示
      await axios
        .post("http://122.116.23.30:3347/main/modificationDiscount", postData)
        .then((response) => {
          if (response.data.returnCode == 0) {
            this.$message({
              message: "更新成功",
              type: "success",
            });
          }
          this.getdata();
          this.isLoading = false; // 無論成功還是失敗，隱藏 loading 標示
        })
        .catch((error) => {
          // 處理錯誤
          this.$message({
            message: "系統有誤",
            type: "error",
          });
          console.error("API request failed:", error);
        });
      this.form = {};
      this.dialogpage = false;
    },
    editItem(row) {
      this.form.customerId = row.customerId;
      this.form.product_name = row.product_name;
      this.form.discount_float = row.discount_float;
      this.dialogpage = true;
    },

    async getproduct_name() {
      await axios
        .get("http://122.116.23.30:3347/main/selectProduct")
        .then((response) => {
          this.productMap = response.data.data;
        })
        .catch((error) => {
          // 處理錯誤
          console.error("API request failed:", error);
        });
    },
    formatProduct(product_name) {
      if (!this.productMap || this.productMap.length === 0) {
        return "正在加載...";
      }
      // 使用 find 方法找到對應的 employee_name
      const responsible = toRaw(product_name);
      const employee = this.productMap.find(
        (item) => item.classId == responsible.product_name
      );
      return employee == null ? "" : employee ? employee.className : "未知";
    },
    async getcusdata() {
      await axios
        .get("http://122.116.23.30:3347/main/selectCustomer")
        .then((response) => {
          this.cusdata = response.data.data;
          this.cusdata = this.cusdata.map(
            (item) => `${item.cus_code} ${item.cus_name}`
          );
        })
        .catch((error) => {
          // 處理錯誤
          this.$message({
            message: "系統有誤",
            type: "error",
          });
          console.error("API request failed:", error);
        });
    },
    async getdata() {
      if (this.customerId.length === 8) {
        this.loading = true;
        const postData = {
          customerId: this.customerId,
        };
        await axios
          .post("http://122.116.23.30:3347/main/searchDiscount", postData)
          .then((response) => {
            this.DiscountData = response.data.data;
            this.loading = false; // 請求完成後關閉加載狀態
          })
          .catch((error) => {
            // 處理錯誤
            console.error("API request failed:", error);
          });
      }
    },
    validateFloat() {
      const regex = /^\d*\.?\d{0,3}$/; // 限制最多兩位小數
      if (!regex.test(this.form.discount_float)) {
        this.form.discount_float = this.form.discount_float.slice(0, -1);
      }
    },
    DateBeforeToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // 將時間設置為當天午夜
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth(); // 當前月份
      const startOfMonth = new Date(currentYear, currentMonth, 1); // 當月的 1 號
        return date.getTime() !== startOfMonth.getTime(); // 只允許 1 號
     
    },
    clearFilterbill() {
      this.customerId = "";
      this.DiscountData = [];
    },
  },
};
</script>

<style scoped>
.red {
  color: #f50404;
}
.el-select {
  width: 300px;
}
.page-title {
  margin-top: 30px;
  margin-bottom: 30px;
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
.no-resize >>> textarea {
  resize: none; /* 禁止調整大小 */
}
.action-icons i {
  cursor: pointer;
  font-size: 20px; /* 调整图标的大小 */
}
</style>
