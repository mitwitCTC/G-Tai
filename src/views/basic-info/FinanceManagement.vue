<template>
  <ListBar />
  <div class="page-title">
    <h2>{{ pageTitle }}</h2>
  </div>
  <div>
    <BreadCrumb />
  </div>
  <div class="table-container">
    <el-button type="primary" @click="openDialog">新增會計傳票</el-button>
    <el-table :data="cus_message" style="width: 100%">
      <el-table-column prop="id" label="傳票號碼" width="150" />
      <el-table-column prop="creatTime" label="傳票日期" width="200" />
      <el-table-column prop="accFarewell" label="結帳年月" width="100" />
      <el-table-column prop="customerId" label="客戶代號" width="100" />
      <el-table-column prop="cus_name" label="客戶名稱" width="250" />
      <el-table-column prop="amount" label="借貸金額" width="150" />
      <el-table-column prop="message" label="摘要" width="250" />
      <el-table-column label="操作">
        <template v-slot="scope">
          <div class="action-icons">
            <i class="fas fa-eye" @click="editItemVehicle(scope.row)"></i>
            <i
              class="fa-regular fa-copy"
              @click="deleteItemVehicle(scope.row)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog
    title="會計傳票"
    v-model="dialogVisible"
    width="70%"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <!-- 借貸兩方 -->
    <div
      style="display: flex; justify-content: space-between; margin-bottom: 20px"
    >
      <!-- 借方 -->
      <div style="width: 48%">
        <h3>借方</h3>
        <el-row :gutter="20" align="middle">
          <el-form-item label="會計科目" label-width="80px">
            <el-select
              v-model="debitcurrentEntry.subject"
              placeholder="選擇會計科目"
              style="width: 200px"
            >
              <el-option
                v-for="item in debit"
                :key="item.parkId"
                :label="item.SubjectsName"
                :value="item.SubjectsName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="20px">
            <el-button type="success" @click="addEntry('debit')">
              新增
            </el-button>
          </el-form-item>
        </el-row>
        <el-table :data="entries.debit" border>
          <el-table-column prop="subject" label="會計科目"></el-table-column>
          <el-table-column prop="amount" label="金額" align="right">
            <template v-slot="scope">
              <el-input
                v-model="scope.row.amount"
                @blur="scope.row.amount = formatAmount(scope.row.amount)"
                placeholder="輸入金額"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                type="danger"
                size="mini"
                @click="removeEntry(scope.$index, 'debit')"
              >
                刪除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: right; margin-top: 10px">
          <b>借方總金額：</b>{{ totalDebit }}
        </div>
      </div>

      <!-- 貸方 -->
      <div style="width: 48%">
        <h3>貸方</h3>
        <el-row :gutter="20" align="middle">
          <el-form-item label="會計科目" label-width="80px">
            <el-select
              v-model="creditcurrentEntry.subject"
              placeholder="選擇會計科目"
              style="width: 200px"
            >
              <el-option
                v-for="item in credit"
                :key="item.parkId"
                :label="item.SubjectsName"
                :value="item.SubjectsName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="20px">
            <el-button type="warning" @click="addEntry('credit')">
              新增
            </el-button>
          </el-form-item>
        </el-row>
        <el-table :data="entries.credit" border>
          <el-table-column prop="subject" label="會計科目"></el-table-column>
          <el-table-column prop="amount" label="金額" align="right">
            <template v-slot="scope">
              <el-input
                v-model="scope.row.amount"
                @blur="scope.row.amount = formatAmount(scope.row.amount)"
                placeholder="輸入金額"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                type="danger"
                size="mini"
                @click="removeEntry(scope.$index, 'credit')"
              >
                刪除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: right; margin-top: 10px">
          <b>貸方總金額：</b>{{ totalCredit }}
        </div>
      </div>
    </div>

    <!-- 底部按鈕 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm">送出</el-button>
    </span>
  </el-dialog>
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
      dialogVisible: false, // 控制Dialog顯示
      isEditable: null,
      debit: [],
      credit: [],
      debitcurrentEntry: {
        //借方
        subject: "", // 當前選擇的會計科目
        amount: 0, // 當前輸入的金額
      },
      creditcurrentEntry: {
        //貸方
        subject: "", // 當前選擇的會計科目
        amount: 0, // 當前輸入的金額
      },
      entries: {
        debit: [], // 借方資料
        credit: [], // 貸方資料
      },
      cus_message: [
        {
          id: "12",
          customerId: "G1308719",
          cus_name: "測試",
          creatTime: "2024-11-28 20:25:59",
          accFarewell: "2024-11",
          amount: "6000",
          message: "摘要備註",
        },
        {
          id: "13",
          customerId: "G1308719",
          cus_name: "測試",
          creatTime: "2024-11-29 20:25:59",
          accFarewell: "2024-11",
          amount: "7000",
          message: "摘要備註",
        },
        {
          id: "14",
          customerId: "G1308719",
          cus_name: "測試",
          creatTime: "2024-11-30 20:25:59",
          accFarewell: "2024-11",
          amount: "8000",
          message: "摘要備註",
        },
      ],
    };
  },
  created() {
    this.debitAccount(); //借方項目
    this.creditAccount(); //貸方項目
  },
  computed: {
    totalDebit() {
      return this.entries.debit
        .reduce((sum, entry) => {
          // 移除千分位逗號，將金額轉換為數字
          const amount = parseFloat(entry.amount.replace(/,/g, ""));
          return sum + (isNaN(amount) ? 0 : amount); // 處理可能無效的數據
        }, 0)
        .toLocaleString(); // 計算總金額後，格式化為千分位
    },
    totalCredit() {
      return this.entries.credit
        .reduce((sum, entry) => {
          // 移除千分位逗號，將金額轉換為數字
          const amount = parseFloat(entry.amount.replace(/,/g, ""));
          return sum + (isNaN(amount) ? 0 : amount); // 處理可能無效的數據
        }, 0)
        .toLocaleString(); // 計算總金額後，格式化為千分位
    },
  },
  methods: {
    async debitAccount() {
      try {
        // 發送 GET 請求到指定的 API
        const response = await axios.get(
          "http://122.116.23.30:3347/finance/debitAccount"
        );
        this.debit = response.data.data;
        console.log(JSON.stringify(this.debit));
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    async creditAccount() {
      try {
        // 發送 GET 請求到指定的 API
        const response = await axios.get(
          "http://122.116.23.30:3347/finance/creditAccount"
        );
        this.credit = response.data.data;
        console.log(JSON.stringify(this.credit));
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },

    removeEntry(index, type) {
      this.entries[type].splice(index, 1); // 刪除對應類型 (debit/credit) 的索引條目
    },
    openDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      (this.entries = {
        debit: [], // 借方資料
        credit: [], // 貸方資料
      }),
        (this.dialogVisible = false);
    },
    addEntry(Type) {
      if (Type === "debit") {
        if (!this.debitcurrentEntry.subject) {
          this.$message.error("請先選擇會計科目！");
          return;
        }
        const newEntry = {
          amount: "0",
          subject: this.debit.find(
            (item) => item.SubjectsName === this.debitcurrentEntry.subject
          ).SubjectsName,
        };
        this.entries.debit.push(newEntry);
        this.debitcurrentEntry = { subject: "", amount: 0 };
      } else if (Type === "credit") {
        if (!this.creditcurrentEntry.subject) {
          this.$message.error("請先選擇會計科目！");
          return;
        }

        const newEntry = {
          amount: "0",
          subject: this.credit.find(
            (item) => item.SubjectsName === this.creditcurrentEntry.subject
          ).SubjectsName,
        };
        this.entries.credit.push(newEntry);
        this.creditcurrentEntry = { subject: "", amount: 0 };
      }
    },
    submitForm() {
      if (this.totalDebit !== this.totalCredit) {
        this.$message.error("借貸金額不平衡，請確認！");
        return;
      }

      // 提交資料至後端
      const payload = {
        debit: this.entries.debit,
        credit: this.entries.credit,
      };
      console.log("提交資料：", payload);

      // 成功訊息並關閉
      this.$message.success("會計傳票新增成功！");
      this.resetForm();
      this.closeDialog();
    },
    resetForm() {
      this.entries = { debit: [], credit: [] };
      this.debitcurrentEntry = { subject: "", amount: 0 };
      this.creditcurrentEntry = { subject: "", amount: 0 };
    },
    viewDetailVehicles(row) {
      this.$router.push({
        path: "SelectView",
        query: {
          rowType: "5",
          cus_name: this.cus_name,
          cus_code: this.cus_code,
        },
      });
    },
    editItemVehicle(row) {
      this.$router.push({
        path: "UpdateView",
        query: {
          rowType: "5",
          cus_name: this.cus_name,
          cus_code: this.cus_code,
          rowData: JSON.stringify({
            ...row, // 複製原始數據
            updateTime: "", // 將 updateTime 設為空字串
          }),
        },
      });
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
</style>
