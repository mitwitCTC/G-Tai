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
      <el-form-item label="開立日期">
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
      <el-form-item
      v-if="paginatedData.length"
        >
          <el-input
            v-model="search"
            placeholder="發票號碼/客戶代號/客戶名稱/統編/抬頭"
            style="width: 300px ; margin-right: 20px;"
          ></el-input>
        </el-form-item>
      <el-button type="info" @click="invoiceOPEN()">發票開立</el-button>
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
        <el-table-column prop="Bidentifier" label="開立統編" width="150" />
        <el-table-column prop="BName" label="開立抬頭" width="200" />
        <el-table-column prop="InvoiceIdCount" label="開立明細數" width="100" />
        <el-table-column prop="QuantitySum" label="數量總計" width="150" />
      </el-table>
      <div class="pagination-container">
        <div class="pagination-info">
          Showing {{ startItem }} to {{ endItem }} of
          {{ filteredData.length }}
        </div>
        <el-pagination
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="filteredData.length"
          layout="prev, pager, next, jumper"
          class="pagination"
        />
      </div>
    </div>
  </div>
  <el-dialog
    title="發票處理"
    v-model="dialog"
    width="80%"
    :close-on-click-modal="false"
    @close="resetForm"
  >
    <el-row style="margin-bottom: 20px">
      <el-form-item label="客戶代號">
        <el-select
          v-model="form.cus_code"
          placeholder="輸入客戶名稱/客代"
          filterable
          :clearable="true"
          style="width: 300px; margin-right: 20px"
          @change="getdata"
        >
          <!-- 使用 cusdata 直接顯示每個字符串 -->
          <el-option
            v-for="item in cusData"
            :key="item"
            :label="item"
            :value="item.split(' ')[0]"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客戶名稱" style="margin-left: 10px">
        <el-input
          v-model="form.cus_name"
          disabled
          style="width: 300px"
        ></el-input>
      </el-form-item>
      <el-form-item label="開立日期" style="margin-left: 10px">
        <el-date-picker
          v-model="form.search_month"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="開立日期"
        />
      </el-form-item>
    </el-row>

    <div class="page-title"><h3>新增發票</h3></div>
    <el-button type="warning" @click="addEntry()" style="margin-bottom: 10px">
      新增
    </el-button>
    <el-table :data="form.invoice" border>
      <el-table-column prop="invoice_name" label="抬頭" width="400">
        <template v-slot="scope">
          <el-select
            v-model="scope.row.invoice_name"
            placeholder="選擇抬頭"
            style="width: 100%"
            @change="use_number(scope.row.invoice_name, scope.row)"
          >
            <el-option
              v-for="item in bill"
              :key="item.account_sortId"
              :label="item.invoice_name || '開立二聯發票'"
              :value="item.invoice_name || '開立二聯發票'"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>

      <el-table-column prop="use_number" label="統編" width="250">
        <template v-slot="scope">
          <el-input
            v-model="scope.row.use_number"
            disabled
            style="width: 200px"
          ></el-input>
        </template>
      </el-table-column>

      <el-table-column label="品項與金額">
        <template v-slot="scope">
          <!-- 動態渲染 product 和 amount -->
          <div
            v-for="(item, index) in scope.row.products"
            :key="index"
            style="display: flex; align-items: center; margin-bottom: 10px"
          >
            <!-- Product 選擇框 -->
            <el-select
              v-model="item.product"
              placeholder="選擇品項"
              style="width: 300px"
              @change="updateProduct(scope.row, index)"
            >
              <el-option
                v-for="product in product_type"
                :key="product"
                :label="product"
                :value="product"
              ></el-option>
            </el-select>

            <!-- Amount 輸入框 -->
            <el-input
              v-model="item.amount"
              placeholder="輸入金額"
              style="width: 100px"
              class="total-amount-input"
              @blur="item.amount = formatAmount(item.amount)"
              @input="calculateRowAmount(scope.row)"
            ></el-input>

            <!-- 刪除按鈕 -->
            <el-button
              type="danger"
              size="mini"
              @click="removeProduct(scope.row, index)"
              style="margin-left: 5px"
              >刪除品項</el-button
            >
          </div>

          <!-- 添加新 Product -->
          <el-button
            type="primary"
            size="mini"
            @click="addProduct(scope.row)"
            style="margin-top: 10px"
          >
            添加品項
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="Amount" label="單張發票金額總計" width="150">
        <template v-slot="scope">
          <el-input
            v-model="scope.row.Amount"
            disabled
            style="width: 100px"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button
            type="danger"
            size="mini"
            @click="removeEntry(scope.$index)"
          >
            刪除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="text-align: right; margin-top: 10px">
      <b>總金額：</b>{{ TotalAmount }}
      <el-button
        type="success"
        size="mini"
        style="margin-left: 20px"
        @click="save()"
      >
        送出
      </el-button>
    </div>
  </el-dialog>
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
const initialFormState = {
  cus_code: "",
  cus_name: "",
  search_month: "",
  search:"",
  invoice: [
    {
      account_sortId: "",
      invoice_name: "",
      use_number: "",
      // products: [{ product: "", amount: "" }],
    },
  ],
};
export default {
  components: {
    BreadCrumb,
    ListBar,
  },
  data() {
    return {
      isLoading: false,
      dialog: false,
      search_month: "",
      search_end_month: "",
      search:"",
      invoice: [],
      currentPage: 1,
      pageSize: 10,
      form: { ...initialFormState },
      bill: [],
      invoicedata: [],
      cusData: [],
      product_type: [
        "油品-汽油、柴油",
        "油品-汽油、柴油、尿素",
        "超級柴油",
        "諾瓦尿素",
        "尿素溶液",
        "無鉛汽油",
      ],
      TotalAmount: 0,
    };
  },
  created() {
    this.isLoading = true;
    this.getcus();
    this.isLoading = false;
  },
  computed: {
    // 過濾搜尋後的資料
    filteredData() {
      const searchTerm = this.search.trim().toLowerCase();

      return this.invoice.filter((item) => {
            
        const word_track = item.word_track ? item.word_track.toLowerCase() : "";
        const customerId = item.customerId ? item.customerId.toLowerCase() : "";
        const cus_name = item.cus_name ? item.cus_name.toLowerCase() : "";
        const Bidentifier = item.Bidentifier ? item.Bidentifier.toLowerCase() : "";
        const BName = item.BName ? item.BName.toLowerCase() : "";

        return (
          word_track.includes(searchTerm) ||
          customerId.includes(searchTerm) ||
          cus_name.includes(searchTerm) ||
          Bidentifier.includes(searchTerm)||
          BName.includes(searchTerm)
        );
      });
    },
    startItem() {
      const start = (this.currentPage - 1) * this.pageSize + 1;
      return Math.min(start, this.invoice.length);
    },
    endItem() {
      const end = this.currentPage * this.pageSize;
      return Math.min(end, this.invoice.length);
    },
    paginatedData() {
      if (!Array.isArray(this.filteredData)) {
        return []; // 若 `filteredData` 不是陣列，返回空陣列
      }
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredData.slice(start, end);
    },
    TotalAmount() {
      if (!this.form.invoice || !Array.isArray(this.form.invoice)) {
        // 如果 this.form.invoice 不是有效的陣列，返回 0
        return 0;
      }

      // 遍歷所有 invoice 並加總 products 的 amount
      const totalAmount = this.form.invoice.reduce((totalSum, invoice) => {
        if (!invoice.products || !Array.isArray(invoice.products)) {
          // 如果 products 不是有效的陣列，跳過這個 invoice
          return totalSum;
        }

        // 遍歷 products 並加總 amount
        const productsSum = invoice.products.reduce((sum, product) => {
          // 確保 amount 是字串，移除千分位逗號，並轉為數值
          const amount = parseFloat(String(product.amount).replace(/,/g, ""));
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

        return totalSum + productsSum;
      }, 0);

      return totalAmount.toLocaleString(); // 格式化為千分位字串
    },
  },
  methods: {
    async save() {
      this.form = {
        ...this.form,
      };
      if (!this.form.search_month) {
        this.$message({
          message: "請設定發票開立日期",
          type: "error",
        });
        return;
      }
      if (this.form.invoice.length < 1) {
        this.$message({
          message: "請設定發票開立內容",
          type: "error",
        });
        return;
      }
      for (const invoice of this.form.invoice) {
        if (!invoice.products) {
          this.$message({
            message: "欄位不可為空",
            type: "error",
          });
          return; // 停止繼續操作
        }
        for (const products of invoice.products) {
          if (!products.product || !products.amount) {
            this.$message({
              message: "欄位不可為空",
              type: "error",
            });
            return; // 停止繼續操作
          }
        }
      }
      this.formatInvoiceAmounts();
    
      try {
        this.isLoading = true; // 開始加載
        // 發送 GET 請求到指定的 API
        const postdata = this.form;
        console.log(JSON.stringify(postdata));
        const response = await axios.post(
          "http://122.116.23.30:3347/finance/issueinvoice",
          postdata
        );
        this.$message({
          message: "新增成功",
          type: "success",
        });
        this.dialog = false;
        await this.clink();
      } catch (error) {
        if (error.response && error.response.data.returnCode === 400) {
          this.$message({
            message: "找不到對應的收據 (defreceipt)",
            type: "warning",
          });
        } else {
          this.$message({
            message: "新增失敗",
            type: "error",
          });
        }
        console.error("Error fetching customer data:", error);
      } finally {
        this.isLoading = false; // 請求完成後關閉加載狀態
      }
    },
    formatInvoiceAmounts() {
      // 遍歷 this.form.invoice 中每一筆資料
      this.form.invoice.forEach((invoice) => {
        // 格式化 invoice 的 Amount
        invoice.Amount = this.formatString(invoice.Amount);

        // 遍歷 invoice 中的 products，格式化每一個 product 的 amount
        invoice.products.forEach((product) => {
          product.amount = this.formatString(product.amount);
        });
      });
    },
    removeProduct(row, index) {
      if (Array.isArray(row.products)) {
        row.products.splice(index, 1);
      }
    },
    calculateRowAmount(row) {
      if (!row.products || !Array.isArray(row.products)) {
        row.Amount = "0";
        return;
      }
      // 計算該行 products 的總金額
      const totalAmount = row.products.reduce((sum, product) => {
        const amount = parseFloat(String(product.amount).replace(/,/g, ""));
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);

      // 更新該行的 Amount，格式化為千分位
      row.Amount = totalAmount.toLocaleString();
    },
    formatAmount(value) {
      const amount = parseFloat(value.replace(/,/g, ""));
      // 將金額字串轉換為數字並移除前導零
      const num = parseInt(amount, 10);
      // 如果解析後不是數字，返回空字串
      if (isNaN(num)) {
        return "";
      }
      // 使用toLocaleString將數字格式化為千分位
      return num.toLocaleString();
    },
    updateProductText(scope) {
      // 將選擇的品項拼接成一個字符串，並更新到 product_text
      scope.row.product_text = scope.row.product.join(", ");
    },
    use_number(invoice_name, row) {
      const matchedInvoice = this.bill.find(
        (invoice) => invoice.invoice_name == invoice_name
      );
      if (matchedInvoice) {
        row.account_sortId = matchedInvoice.account_sortId;
        row.use_number = matchedInvoice.use_number;
      } else {
        row.use_number = ""; 
        row.account_sortId = "";// 如果沒有匹配項，清空 use_number
      }
    },
    async getcus() {
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
          this.$message({
            message: "系統有誤",
            type: "error",
          });
          console.error("API request failed:", error);
        });
    },
    async getdata() {
      this.form.cus_name = "";
      // 確保 invoice 被重置為初始結構
      this.form.invoice = [
        {
          account_sortId: "",
          invoice_name: "",
          use_number: "",
          products: [{ product: "", amount: "" }],
        },
      ];
      const postData = {
        cus_code: this.form.cus_code,
        customerId: this.form.cus_code,
      };
      if (this.form.cus_code.length == 8) {
        this.form.cus_name = "查詢中..";
        try {
          const response = await axios.post(
            "http://122.116.23.30:3347/main/searchCustomer",
            postData
          );
          this.form.cus_name = response.data.data[0].cus_name;
          await this.getbill(this.form.cus_code);
        } catch {
          this.form.cus_name = "";
          this.$message({
            message: "請確認客戶代號是否有誤",
            type: "error",
          });
          console.error("API request failed:", error);
        }
      }
    },

    async getbill(customerId) {
      try {
        // 發送 GET 請求到指定的 API
        const postdata = {
          customerId: customerId,
        };
        const response = await axios.post(
          "http://122.116.23.30:3347/main/searchAccount_sort",
          postdata
        );
        this.bill = response.data.data;
        // 將資料放入 customers 陣列中
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    addProduct(row) {
      if (!Array.isArray(row.products)) {
        row.products = []; // 動態設置為空數組
      }
      row.products.push({ product: "", amount: "" });
    },
    addEntry() {
      const newEntry = {
        account_sortId: "",
        invoice_name: "",
        use_number: "",
      };
      this.form.invoice.push(newEntry);
    },
    async invoiceOPEN() {
      this.dialog = true;
    },
    resetForm() {
      this.form.cus_code = "";
      this.form.cus_name = "";
      this.form.search_month = "";
      this.form.TotalAmount = 0;

      // 確保 invoice 被重置為初始結構
      this.form.invoice = [
        {
          account_sortId: "",
          invoice_name: "",
          use_number: "",
          products: [{ product: "", amount: "" }],
        },
      ];
    },
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
    formatString(value) {
      if (typeof value === "string") {
        // 移除千分位逗號，並轉換為數字
        const number = Number(value.replace(/,/g, ""));
        return isNaN(number) ? 0 : number; // 如果轉換失敗，回傳 0
      } else if (typeof value === "number") {
        return value; // 如果已經是數字，直接返回
      }
      return 0; // 如果輸入不是字串或數字，返回 0
    },
    removeEntry(index) {
      this.form.invoice.splice(index, 1);
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
