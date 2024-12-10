<template>
  <ListBar />
  <div class="page-title">
    <h2>{{ pageTitle }}</h2>
  </div>
  <div>
    <BreadCrumb />
  </div>
  <div class="table-container">
    <el-button type="primary" @click="openDialog"
      >新增會計傳票</el-button
    >
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

  <el-dialog title="會計傳票" v-model="dialogVisible" width="70%">
    <!-- 上方會計科目選擇和金額輸入 -->
    <div style="margin-bottom: 20px">
      <el-row :gutter="20" align="middle">
        <!-- 會計科目 -->

        <el-form-item label="會計科目" label-width="80px">
          <el-select
            v-model="currentEntry.subject"
            placeholder="選擇會計科目"
            style="width: 150px"
          >
            <el-option
              v-for="item in accountSubjects"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 金額 -->

        <el-form-item label="金額" label-width="50px">
          <el-input
            v-model="currentEntry.amount"
            placeholder="輸入金額"
            style="width: 100px"
          ></el-input>
        </el-form-item>

        <!-- 借貸方 -->

        <el-form-item label="借貸方" label-width="60px">
          <el-select
            v-model="currentEntry.type"
            placeholder="借/貸"
            style="width: 100px"
          >
            <el-option label="借方" value="debit"></el-option>
            <el-option label="貸方" value="credit"></el-option>
          </el-select>
          <el-button type="primary" @click="addEntry" style="margin-left: 10px">
            新增
          </el-button>
        </el-form-item>
      </el-row>
    </div>

    <!-- 借貸兩方 -->
    <div
      style="display: flex; justify-content: space-between; margin-bottom: 20px"
    >
      <!-- 借方 -->
      <div style="width: 48%">
        <h3>借方</h3>
        <el-table :data="entries.debit" border>
          <el-table-column prop="subject" label="會計科目"></el-table-column>
          <el-table-column prop="amount" label="金額"></el-table-column>
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
        <el-table :data="entries.credit" border>
          <el-table-column prop="subject" label="會計科目"></el-table-column>
          <el-table-column prop="amount" label="金額"></el-table-column>
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
      accountSubjects: [
        { label: "現金", value: "cash" },
        { label: "應收帳款", value: "accounts_receivable" },
        { label: "應付帳款", value: "accounts_payable" },
        { label: "存貨", value: "inventory" },
        { label: "銷貨收入", value: "sales_revenue" },
        // 更多會計科目...
      ],
      currentEntry: {
        subject: "", // 當前選擇的會計科目
        amount: 0, // 當前輸入的金額
        type: "", // 當前選擇的類型（借方/貸方）
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
  computed: {
    totalDebit() {
      return this.entries.debit.reduce(
        (sum, entry) => sum + Number(entry.amount),
        0
      );
    },
    totalCredit() {
      return this.entries.credit.reduce(
        (sum, entry) => sum + Number(entry.amount),
        0
      );
    },
  },
  methods: {
    removeEntry(index, type) {
    this.entries[type].splice(index, 1); // 刪除對應類型 (debit/credit) 的索引條目
  },
    openDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    addEntry() {
      if (
        !this.currentEntry.subject ||
        !this.currentEntry.amount ||
        !this.currentEntry.type
      ) {
        this.$message.error("請完整填寫資料！");
        return;
      }

      const newEntry = {
        subject: this.accountSubjects.find(
          (item) => item.value === this.currentEntry.subject
        ).label,
        amount: this.currentEntry.amount,
      };

      if (this.currentEntry.type === "debit") {
        this.entries.debit.push(newEntry);
      } else if (this.currentEntry.type === "credit") {
        this.entries.credit.push(newEntry);
      }

      // 清空當前輸入
      this.currentEntry = { subject: "", amount: 0, type: "" };
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
      this.currentEntry = { subject: "", amount: 0, type: "" };
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
