<template>
  <div>
    <ListBar />
    <div class="page-title">
      <h2>{{ pageTitle }}</h2>
    </div>
    <div>
      <BreadCrumb :isSpecialPage="true" />
    </div>
    <el-button type="danger" @click="dialog = true">新增折讓</el-button>
    <div class="page-title">
      <h5>
        客戶代號:
        <h4>{{ this.cus_code }}</h4>
        客戶名稱:
        <h4>{{ this.cus_name }}</h4>
      </h5>
    </div>
    <el-form-item label="折讓資訊" class="section-header">
      <el-table :data="DiscountData" style="width: 90%" v-loading="loading">
        <!-- 產品名稱列 -->
        <el-table-column
          prop="product_name"
          label="產品名稱"
          :formatter="formatProduct"
        />
        <el-table-column prop="discount_float" label="折讓" />
      </el-table>
    </el-form-item>
    <!-- 新增折讓 -->
    <el-dialog
      title="新增折讓"
      v-model="dialog"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-table :data="form" style="width: 90%" v-loading="loading">
        <!-- 產品名稱列 -->
        <el-table-column
          prop="product_name"
          label="產品名稱"
          :formatter="formatProduct"
        />
        <!-- 折讓列 -->
        <el-table-column label="折讓">
          <template v-slot="scope">
            <el-input
              v-model="scope.row.discount_float"
              @input="validateFloat(scope.row)"
            />
          </template>
        </el-table-column>

        <!-- 操作列，顯示新增折讓按鈕 -->
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- 只有在 discount_float 為 0 時顯示新增折讓按鈕 -->
            <el-button type="danger" @click="savePass(scope.row)">
              新增
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="dialog = false">退出</el-button>
          <!-- <el-button type="primary" @click="savePass">送出</el-button> -->
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="isLoading"
      width="15%"
      title="請稍後..."
      :close-on-click-modal="false"
      :show-close="false"
    ></el-dialog>

    <!-- <div class="pagination-container">
      <div class="pagination-info">
        Showing {{ startItem }} to {{ endItem }} of {{ DiscountData.length }}
      </div>
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="DiscountData.length"
        layout="prev, pager, next, jumper"
        class="pagination"
      />
    </div> -->
    <div style="margin-bottom: 50px"></div>
  </div>
</template>

<script>
import ListBar from "@/components/ListBar.vue";
import BreadCrumb from "@/components/BreadCrumb.vue";
import TablePaginated from "@/components/TablePaginated.vue";
import axios from "axios";
import { toRaw } from "vue";

export default {
  components: {
    BreadCrumb,
    ListBar,
    TablePaginated,
  },
  data() {
    return {
      isLoading: false,
      loading: false,
      dialog: false,
      cus_code: "",
      cus_name: "",
      rowData: [],
      DiscountData: [],
      salesmenData: [],
      product: [], //篩選沒有重複出現的
      productMap: [],
      allowedProducts: ["0001", "0006", "0017", "6617"], // 需要顯示的產品
      form: [],
      currentPage: 1,
      pageSize: 10,
    };
  },
  async created() {
    this.cus_code = this.$route.query.cus_code;
    this.cus_name = this.$route.query.cus_name;
    this.form.customerId = this.cus_code;
    await this.getselectData();
    this.getproduct_name();
  },
  mounted() {
    // 發送 API 請求以獲取業務資料
    axios
      .get("http://122.116.23.30:3347/main/selectSalesman")
      .then((response) => {
        this.salesmenData = response.data.data; // 獲取到數據後將其存儲到 salesmenData
      })
      .catch((error) => {
        // 處理錯誤
        console.error("API request failed:", error);
      });
  },
  computed: {
    // paginatedDiscount() {
    //   const start = (this.currentPage - 1) * this.pageSize;
    //   const end = start + this.pageSize;
    //   return this.DiscountData.slice(start, end);
    // },
    // startItem() {
    //   const start = (this.currentPage - 1) * this.pageSize + 1;
    //   return Math.min(start, this.DiscountData.length);
    // },
    // endItem() {
    //   const end = this.currentPage * this.pageSize;
    //   return Math.min(end, this.DiscountData.length);
    // },
  },
  methods: {
    getDiscount(product_name) {
      const product = this.DiscountData.find(
        (item) => item.product_name === product_name
      );
      return product ? product.discount_float : ""; // 如果有值顯示折讓，沒有則顯示空字符串
    },
    // getitem() {
    //   let discountProductNames = new Set(
    //     this.DiscountData.map((item) => item.product_name)
    //   );
    //   this.product = this.product.filter(
    //     (item) => !discountProductNames.has(item.classId)
    //   );
    // },
    async getproduct_name() {
      await axios
        .get("http://122.116.23.30:3347/main/selectProduct")
        .then((response) => {
          this.productMap = response.data.data;
          this.product = this.productMap;
        })
        .catch((error) => {
          // 處理錯誤
          console.error("API request failed:", error);
        });
    },
    async getselectData() {
      this.loading = true;
      const postData = {
        customerId: this.cus_code,
      };
      await axios
        .post("http://122.116.23.30:3347/main/searchDiscount", postData)
        .then((response) => {
          this.DiscountData = response.data.data;
          this.DiscountData = this.DiscountData.filter(
            (item) =>
              item.product_name !== "0002" && item.product_name !== "0005"
          );
          // 確保 allowedProducts 裡面的產品都存在於 DiscountData 中，如果不存在則添加
          this.allowedProducts.forEach((product) => {
            const exists = this.DiscountData.some(
              (item) => item.product_name === product
            );
            if (!exists) {
              // 如果不存在，新增該產品並將 discount_float 設為 0
              this.DiscountData.push({
                discountId: null, // 新增資料時，假設 discountId 會是 null，需根據實際情況處理
                customerId: "", // 這裡設為空字符串或提供適當的值
                product_name: product,
                discount_float: "0", // 折讓為 0
                supplier_name: "",
                responsible_person: "",
                updated: null,
                created: null,
                updateTime: "0",
                createTime: "0",
                deleteTime: "0",
              });
            }
          });
          this.form = this.DiscountData.filter(
            (item) => item.discount_float === "0"
          );
          this.loading = false; // 請求完成後關閉加載狀態
        })
        .catch((error) => {
          // 處理錯誤
          console.error("API request failed:", error);
        });
    },
    async savePass(row) {
      if (row.discount_float == "0") {
        this.$message({
          message: "折讓不得為0",
          type: "error",
        });
        return;
      }
      this.isLoading = true;
      if (row.product_name === "0001") {
        const productNames = ["0001", "0002", "0005"];

        // 依次發送 POST 請求
        productNames.forEach((productName) => {
          const req = {
            customerId: this.cus_code,
            product_name: productName,
            discount_float: row.discount_float,
          };

          console.log(JSON.stringify(req));

          // 發送 POST 請求
          axios
            .post("http://122.116.23.30:3347/main/createDiscount", req)
            .then((response) => {
              if (response.status === 200 && response.data.returnCode === 0) {
                // 成功提示
                this.$message({
                  message: `新增成功: ${productName}`,
                  type: "success",
                });
                this.getselectData();
              } else {
                // 處理非 0 成功代碼
                this.$message({
                  message: `新增失敗: ${productName}`,
                  type: "error",
                });
              }
            })
            .catch((error) => {
              // 發生錯誤時，顯示錯誤提示
              this.$message({
                message: `新增失敗，伺服器錯誤: ${productName}`,
                type: "error",
              });
              console.error("Error:", error);
            });
        });
      } else {
        // 如果不是 "0001"，只發送一次請求
        const req = {
          customerId: this.cus_code,
          product_name: row.product_name,
          discount_float: row.discount_float,
        };

        axios
          .post("http://122.116.23.30:3347/main/createDiscount", req)
          .then((response) => {
            if (response.status === 200 && response.data.returnCode === 0) {
              this.$message({
                message: "新增成功",
                type: "success",
              });
              this.getselectData();
            } else {
              this.$message({
                message: "新增失敗",
                type: "error",
              });
            }
          })
          .catch((error) => {
            this.$message({
              message: "新增失敗，伺服器錯誤",
              type: "error",
            });
            console.error("Error:", error);
          });
      }
      
      this.isLoading = false;
      console.log(row.discount_float)
    },
    validateFloat(row) {
      const regex = /^\d*\.?\d{0,3}$/; // 限制最多兩位小數
      if (!regex.test(row.discount_float)) {
        row.discount_float = row.discount_float.slice(0, -1);
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
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
    getEmployeeName(responsible_person) {
      // 如果 salesmenData 仍為空，則返回空或其他提示
      if (!this.salesmenData || this.salesmenData.length === 0) {
        return "正在加載...";
      }
      // 使用 find 方法找到對應的 employee_name
      const responsible = toRaw(responsible_person);
      const employee = this.salesmenData.find(
        (item) => item.employee_id == responsible.responsible_person
      );
      return employee == null
        ? ""
        : employee
        ? employee.employee_name
        : "未知員工";
    },
    editItem(row) {
      this.$router.push({
        path: "UpdateView",
        query: {
          rowType: "4",
          cus_code: this.cus_code,
          cus_name: this.cus_name,
          rowData: JSON.stringify({
            ...row, // 複製原始數據
            updateTime: "", // 將 updateTime 設為空字串
          }),
        },
      });
    },
    async deleteItem(row) {
      const result = confirm("您確定要刪除此項目嗎？此操作無法恢復。");
      if (result) {
        const req = {
          discountId: row.discountId,
          updated: "",
          deleteTime: "",
        };
        await axios
          .post("http://122.116.23.30:3347/main/deleteDiscount", req)
          .then((response) => {
            if (response.status === 200 && response.data.returnCode === 0) {
              // 成功提示
              this.$message({
                message: "刪除成功",
                type: "success",
              });
              this.getselectData();
            } else {
              // 處理非 0 成功代碼
              this.$message({
                message: "刪除失敗",
                type: "error",
              });
            }
          })
          .catch((error) => {
            // 發生錯誤時，顯示錯誤提示
            this.$message({
              message: "刪除失敗，伺服器錯誤",
              type: "error",
            });
            console.error("Error:", error);
          });
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
.page-title h4 {
  color: #f5bd04;
}
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-input {
  width: 200px;
  height: 40px;
}
.action-icons {
  display: flex;
  gap: 20px; /* 调整图标之间的间距 */
}
.action-icons i {
  cursor: pointer;
  font-size: 20px; /* 调整图标的大小 */
}
.el-input {
  width: 200px;
}
.el-select {
  width: 200px;
}
.section-header {
  margin-top: 50px;
  width: 90%;
  font-weight: bold;
  background-color: #f0ecec; /* 浅灰色背景 */
  border-radius: 10px; /* 圆角 */
  padding: 10px; /* 内边距 */
  margin-bottom: 10px; /* 项目之间的间距 */
}
</style>
