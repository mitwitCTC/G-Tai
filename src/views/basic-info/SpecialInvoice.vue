<template>
  <ListBar />
  <div class="page-title">
    <h2>{{ pageTitle }}</h2>
  </div>
  <div>
    <BreadCrumb />
  </div>
  <div class="page-title" style="color: red" v-if="this.month_check == '22'">
    <h5>{{ search_month }}特殊發票名單已確認，無法變動</h5>
  </div>
  <div
    class="page-title"
    style="color: red"
    v-if="this.month_check == '22' && this.month_final == '24'"
  >
    <h5>{{ search_month }}特殊發票名單已開立完成</h5>
  </div>
 
  <el-form-item label="帳務期別" style="margin-left: 10px">
    <el-date-picker
      v-model="search_month"
      type="month"
      format="YYYY-MM"
      value-format="YYYY-MM"
      placeholder="請選擇帳單期別"
      @change="dototal"
    />
    <el-form-item
      label="新增特殊開立客戶"
      style="margin-left: 10px"
      v-if="this.month_check != '22'"
    >
      <el-select
        v-model="customerId"
        placeholder="輸入客戶名稱/客代"
        filterable
        :clearable="true"
        style="width: 300px; margin-right: 20px"
        value-key="cus_code"
      >
        <el-option
          v-for="item in No_cus_Data"
          :key="item.cus_code"
          :label="`${item.cus_code} ${item.cus_name}`"
          :value="item"
        ></el-option>
      </el-select>
      <el-button
        type="info"
        v-if="customerId && this.month_check != '22'"
        @click="changeinvoicetype(customerId.cus_code, '1', 0)"
        >確認更改</el-button
      >
      
    </el-form-item>
  </el-form-item>
  <el-button
        type="primary"
        v-if="this.month_check != '22'"
        style="margin: 10px;"
        @click="changesystemwork('22')"
        >確認特殊發票名單</el-button
      >
    <el-button
        type="warning"
        v-if="month_final != '24' && month_check == '22'"
        style="margin: 10px;"
        @click="changesystemwork('24')"
        >完成特殊發票開立</el-button
      >

  <el-table :data="cus_Data" style="width: 100%" v-if="search_month">
    <el-table-column prop="cus_code" label="客戶代號" width="200" />
    <el-table-column prop="cus_name" label="客戶名稱" width="300" />
    <el-table-column
      prop="totalSalesAmount"
      label="總金額"
      align="right"
      width="200"
      ><template v-slot="scope"
        >{{ formatCurrency(scope.row.totalSalesAmount) }}
      </template></el-table-column
    >
    <el-table-column
      prop="totalAmount"
      label="已開立發票金額"
      align="right"
      width="200"
      ><template v-slot="scope"
        >{{ formatCurrency(scope.row.totalAmount) }}
      </template></el-table-column
    >
    <el-table-column prop="total" label="可開立金額" align="right" width="200"
      ><template v-slot="scope"
        >{{ formatCurrency(scope.row.total) }}
      </template></el-table-column
    >
    <el-table-column label="操作" v-if="this.month_final != '24'">
      <template v-slot="scope">
        <div class="action-icons">
          <i class="fas fa-edit" @click="onpeDialog(scope.row)"></i>
          <el-button
            type="info"
            v-if="this.month_check != '22'"
            @click="
              changeinvoicetype(scope.row.cus_code, '0', scope.row.totalAmount)
            "
            >更改為一般開立</el-button
          >
        </div>
      </template>
    </el-table-column>
  </el-table>
  <div style="margin-bottom: 50px"></div>
  <el-dialog
    v-model="isLoading"
    width="15%"
    title="請稍後..."
    :close-on-click-modal="false"
    :show-close="false"
  ></el-dialog>

  <el-dialog
    title="發票處理"
    v-model="dialog"
    width="80%"
    :close-on-click-modal="false"
    @close="resetForm"
  >
    <el-row style="margin-bottom: 20px">
      <el-form-item label="客戶代號">
        <el-input
          v-model="form.cus_code"
          disabled
          style="width: 300px"
        ></el-input>
      </el-form-item>
      <el-form-item label="客戶名稱" style="margin-left: 10px">
        <el-input
          v-model="form.cus_name"
          disabled
          style="width: 300px"
        ></el-input>
      </el-form-item>
      <el-form-item label="帳務期別" style="margin-left: 10px">
        <el-date-picker
          v-model="form.search_month"
          type="month"
          format="YYYY-MM"
          value-format="YYYY-MM"
          placeholder="請選擇帳單期別"
          disabled
        />
      </el-form-item>
      <el-form-item
        label="可開立金額"
        style="margin-left: 10px; text-align: right"
      >
        <el-input
          v-model="form.TotalAmount"
          disabled
          class="total-amount-input"
          style="width: 300px"
          :value="formatCurrency(form.TotalAmount)"
        ></el-input>
      </el-form-item>
    </el-row>
    <el-button type="warning" @click="addEntry()"> 新增 </el-button>
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
              :label="item.invoice_name"
              :value="item.invoice_name"
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
  <div style="margin-bottom: 50px"></div>
</template>

<script>
import ListBar from "@/components/ListBar.vue";
import BreadCrumb from "@/components/BreadCrumb.vue";
import { toRaw } from "vue"; // 引入 `toRaw` 函數
import axios from "axios";
const initialFormState = {
  cus_code: "",
  cus_name: "",
  search_month: "",
  TotalAmount: 0,
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
      month_check: "",
      month_final: "",
      isLoading: false,
      dialog: false,
      search_month: "",
      customerId: "",
      cus_Data: [], //特殊開立
      No_cus_Data: [], //一般開立
      bill: [],
      form: { ...initialFormState },
      type: {
        1: "手機簡訊",
        2: "Line",
        3: "mail",
      },
      invoiceNameOptions: [], // 抬頭選項
      useNumberOptions: [], // 統編選項
      product_type: [
        "油品-汽油、柴油",
        "油品-汽油、柴油、尿素",
        "超級柴油",
        "諾瓦尿素",
        "尿素溶液",
        "無鉛汽油",
      ],
    };
  },
  created() {
    this.getcus();
  },
  computed: {
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
      const totalAmount = this.formatString(this.TotalAmount);
      this.form = {
        ...this.form,
        AllAmount: totalAmount,
      };
      if (this.form.TotalAmount < this.form.AllAmount) {
        this.$message({
          message: "總金額不可超過可開立金額",
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
        if (!invoice.invoice_name || !invoice.use_number || !invoice.products) {
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
        const response = await axios.post(
          "http://122.116.23.30:3347/finance/insertinvoice",
          postdata
        );
        this.$message({
          message: "更改成功",
          type: "success",
        });
        this.resetForm();
        this.dialog = false;
        await this.dototal();
      } catch (error) {
        this.$message({
          message: "更改失敗",
          type: "error",
        });
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
    async getbill(customerId) {
      try {
        this.isLoading = true; // 開始加載
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
      } finally {
        this.isLoading = false; // 請求完成後關閉加載狀態
      }
    },
    async changesystemwork(type) {
      if(!this.search_month){
        this.$message({
              message: "請先選擇帳務期別",
              type: "error",
            });
            return
      }
      const result = confirm("請確認是否改變更，是請按'確認'");
      if (result) {
        try {
          this.isLoading = true; // 開始加載
          // 發送 GET 請求到指定的 API
          const postdata = {
            workDate: this.search_month,
            type: type,
          };
          const response = await axios.post(
            "http://122.116.23.30:3347/finance/changesystemwork",
            postdata
          );
          if (response.data && response.data.data) {
            this.$message({
              message: "更改成功",
              type: "success",
            });
            this.getsystemwork();
          }

          // 將資料放入 customers 陣列中
        } catch (error) {
          console.error("Error fetching customer data:", error);
        } finally {
          this.isLoading = false; // 請求完成後關閉加載狀態
        }
      }
    },
    async dototal() {
      this.isLoading = true;
      await this.getinvoicetotal();
      await this.getusetotal();
      await this.getsystemwork();
      for (let i = 0; i < this.cus_Data.length; i++) {
        const total =
          this.cus_Data[i].totalSalesAmount - this.cus_Data[i].totalAmount;
        // 更新 cus_Data 中相應的項目
        this.cus_Data[i] = {
          ...this.cus_Data[i], // 保留原有資料
          total: total,
        };
      }
      this.isLoading = false;
    },
    async getusetotal() {
      try {
        for (let i = 0; i < this.cus_Data.length; i++) {
          const customerId = this.cus_Data[i].cus_code;
          // 發送 API 請求
          const postdata = {
            customerId: customerId,
            salesDate: this.search_month,
          };
          const response = await axios.post(
            "http://122.116.23.30:3347/finance/searchuseamount",
            postdata
          );

          // 確認 API 回應是否有資料
          if (response.data && response.data.data) {
            // 更新 cus_Data 中相應的項目
            this.cus_Data[i] = {
              ...this.cus_Data[i], // 保留原有資料
              totalAmount: response.data.data.totalAmount, // 加入 totalSalesAmount 欄位
            };
          } else {
            console.error(
              `No totalSalesAmount found for customerId: ${customerId}`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    async getsystemwork() {
      try {
        const postdata = {
          workDate: this.search_month,
          type: "22", //開立確認
        };
        const response = await axios.post(
          "http://122.116.23.30:3347/finance/getsystemwork",
          postdata
        );
        // 確認 API 回應是否有資料
        if (response.data && response.data.data.length > 0) {
          this.month_check = response.data.data[0].type;
        } else {
          this.month_check = "";
          this.month_final = "";
        }
        if (this.month_check == "22") {
          const postdata = {
            workDate: this.search_month,
            type: "24", //開立確認
          };
          const response = await axios.post(
            "http://122.116.23.30:3347/finance/getsystemwork",
            postdata
          );
          // 確認 API 回應是否有資料
          if (response.data && response.data.data.length > 0) {
            this.month_final = response.data.data[0].type;
          } else {
            this.month_final = "";
          }
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    async getinvoicetotal() {
      try {
        // 迭代每個 customerId
        for (let i = 0; i < this.cus_Data.length; i++) {
          const customerId = this.cus_Data[i].cus_code;

          // 發送 API 請求
          const postdata = {
            customerId: customerId,
            salesDate: this.search_month,
          };
          const response = await axios.post(
            "http://122.116.23.30:3347/finance/searchtotalamount",
            postdata
          );

          // 確認 API 回應是否有資料
          if (response.data && response.data.data) {
            // 更新 cus_Data 中相應的項目
            this.cus_Data[i] = {
              ...this.cus_Data[i], // 保留原有資料
              totalSalesAmount: response.data.data.totalSalesAmount, // 加入 totalSalesAmount 欄位
            };
          } else {
            console.error(
              `No totalSalesAmount found for customerId: ${customerId}`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    async changeinvoicetype(customerId, type, totalAmount) {
      if (this.month_check != "22") {
        const result = confirm(
          "請確認是否改變此客戶開立發票方式，是請按'確認'"
        );
        if (result) {
          if (totalAmount != 0) {
            this.$message({
              message: "已有特殊開立發票金額 不可轉換",
              type: "error",
            });
            return;
          }

          try {
            // 發送 API 請求
            const postdata = {
              customerId: customerId,
              special_invoice: type,
            };
            const response = await axios.post(
              "http://122.116.23.30:3347/finance/changeinvoicetype",
              postdata
            );
            this.$message({
              message: "轉換成功",
              type: "success",
            });
            setTimeout(() => {
              window.location.reload();
            }, 2000); // 3000 毫秒 = 3 秒
          } catch (error) {
            console.error("Error fetching customer data:", error);
          }
        }
      } else if (this.month_check == "22") {
        this.$message({
          message: "特殊名單已確認 無法更改",
          type: "error",
        });
        return;
      }
    },
    addProduct(row) {
      if (!Array.isArray(row.products)) {
        row.products = []; // 動態設置為空數組
      }
      row.products.push({ product: "", amount: "" });
    },
    removeProduct(row, index) {
      if (Array.isArray(row.products)) {
        row.products.splice(index, 1);
      }
    },
    updateProductText(scope) {
      // 將選擇的品項拼接成一個字符串，並更新到 product_text
      scope.row.product_text = scope.row.product.join(", ");
    },
    async onpeDialog(row) {
      if (this.month_final != "24") {
        this.form.cus_code = row.cus_code;
        this.form.cus_name = row.cus_name;
        this.form.search_month = this.search_month;
        this.form.TotalAmount = row.total;
        await this.getbill(row.cus_code);
        this.dialog = true;
      } else if (this.month_final == "24") {
        this.$message({
          message: "特殊開立已完成 無法變更",
          type: "error",
        });
        return;
      }
    },
    use_number(invoice_name, row) {
      const matchedInvoice = this.bill.find(
        (invoice) => invoice.invoice_name === invoice_name
      );
      if (matchedInvoice) {
        row.account_sortId = matchedInvoice.account_sortId;
        row.use_number = matchedInvoice.use_number;
      } else {
        row.use_number = ""; // 如果沒有匹配項，清空 use_number
      }
    },
    addEntry() {
      const newEntry = {
        account_sortId: "",
        invoice_name: "",
        use_number: "",
      };
      this.form.invoice.push(newEntry);
    },
    async getcus() {
      try {
        this.isLoading = true; // 開始加載
        // 發送 GET 請求到指定的 API
        const response = await axios.get(
          "http://122.116.23.30:3347/main/selectCustomer"
        );
        this.cus_Data = response.data.data.filter(
          (cus_Data) => cus_Data.special_invoice === "1"
        );
        this.No_cus_Data = response.data.data.filter(
          (cus_Data) => cus_Data.special_invoice === "0"
        );
        this.cus_Data.sort((a, b) => {
          // 如果 cus_code 是字符串，使用 localeCompare 進行字典序排序
          return a.cus_code.localeCompare(b.cus_code);
        });
        // 將資料放入 customers 陣列中
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        this.isLoading = false; // 請求完成後關閉加載狀態
      }
    },
    removeEntry(index) {
      this.form.invoice.splice(index, 1);
    },
    formatCurrency(value) {
      if (!value) return "0";
      return Number(value).toLocaleString(); // 使用 toLocaleString 進行千分位格式化
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
.action-icons {
  display: flex;
  gap: 20px; /* 调整图标之间的间距 */
}
.action-icons i {
  cursor: pointer;
  font-size: 20px; /* 调整图标的大小 */
}
.total-amount-input /deep/ .el-input__inner {
  text-align: right;
}
</style>
