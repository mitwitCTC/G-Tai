<template>
  <div>
    <ListBar />
    <div class="page-title">
      <h2>{{ pageTitle }}</h2>
    </div>
    <div>
      <BreadCrumb :isSpecialPage="true" />
    </div>

    <el-form :inline="true">
      <el-form-item label="會計編號/會計科目">
        <el-input v-model="searchAcc"></el-input>
        <!-- <el-select
          v-model="searchAcc"
          placeholder="輸入會計編號/會計科目"
          filterable
          :clearable="true"
          style="width: 300px; margin-right: 20px"
 
          <el-option
            v-for="item in searchallAccount"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select> -->
      </el-form-item>

      <!-- <el-form-item label="科目新名稱" v-if="searchAcc">
        <el-input
          v-model="newlabel"
          placeholder="輸入科目新名稱"
          style="width: 300px"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button v-if="newlabel" type="success" @click="editAcc()"
          >確認修改</el-button
        ></el-form-item
      > -->
    </el-form>
    <el-button v-if="!searchAcc" type="warning" @click="dialog = true"
      >新增會計項目</el-button
    >
    <div class="table-container">
      <el-table :data="filteredData" style="width: 100%" v-loading="loading">
        <el-table-column prop="Subjects" label="科目編號" width="200" />
        <el-table-column prop="SubjectsName" label="科目名稱" width="400">
          <template v-slot="scope">
            <el-input
              v-model="scope.row.SubjectsName"
              v-if="editingRow === scope.row"
            ></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="type" label="科目類別" width="200">
          <template v-slot="scope">
            {{
              scope.row.type === "1"
                ? "資產"
                : scope.row.type === "2"
                ? "負債"
                : scope.row.type === "3"
                ? "業主權益"
                : scope.row.type === "4"
                ? "收入"
                : scope.row.type === "5"
                ? "營業成本"
                : scope.row.type === "6"
                ? "營業費用"
                : scope.row.type === "7"
                ? "營業外收入,營業外費用"
                : ""
            }}
          </template>
        </el-table-column>
        <el-table-column prop="useType" label="借/貸方" width="200">
          <template v-slot="scope">
            {{
              scope.row.useType === "DR"
                ? "借方"
                : scope.row.useType === "CR"
                ? "貸方"
                : ""
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="warning"
              @click="Edit(scope.row)"
              v-if="editingRow !== scope.row"
              >修改</el-button
            >
            <el-button
              type="success"
              @click="editAcc(scope.row)"
              v-if="editingRow === scope.row"
              >儲存</el-button
            >
            <el-button type="info" @click="del(scope.row)">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <el-dialog
    v-model="dialog"
    width="80%"
    title="新增會計項目"
    :close-on-click-modal="false"
    :show-close="false"
    ><el-form label-width="120px">
      <!-- 统一標籤寬度 -->
      <el-row style="margin-bottom: 20px">
        <el-form-item label="科目編號">
          <el-input
            v-model="form.Subjects"
            maxlength="6"
            placeholder="請輸入6位數"
            @input="limitToSixDigits"
          ></el-input>
        </el-form-item>
        <el-form-item label="科目名稱">
          <el-input v-model="form.SubjectsName"></el-input>
        </el-form-item>
        <el-form-item label="科目類別" style="width: 300px">
          <el-select v-model="form.type" clearable placeholder="選擇科目類別">
            <el-option label="資產" :value="'1'"></el-option>
            <el-option label="負債" :value="'2'"></el-option>
            <el-option label="業主權益" :value="'3'"></el-option>
            <el-option label="收入" :value="'4'"></el-option>
            <el-option label="營業成本" :value="'5'"></el-option>
            <el-option label="營業費用" :value="'6'"></el-option>
            <el-option label="營業外收入,營業外費用" :value="'7'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="借/貸方" style="width: 300px">
          <el-select
            v-model="form.useType"
            clearable
            placeholder="選擇科目類別"
          >
            <el-option label="借方" :value="'DR'"></el-option>
            <el-option label="貸方" :value="'CR'"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" @click="savePassbill">送出</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="loading"
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
      loading: false,
      dialog: false,
      searchAcc: "",
      debit: [],
      searchallAccount: [],
      form: {},
      editingRow: null, // 追踪正在編輯的行
    };
  },
  async created() {
    this.loading = true;
    await this.debitAccount(); //項目
    this.loading = false;
  },
  computed: {
    // 過濾搜尋後的資料
    filteredData() {
      const searchTerm = this.searchAcc.trim().toLowerCase();

      return this.debit.filter((item) => {
        const Subjects = item.Subjects ? item.Subjects.toLowerCase() : "";
        const SubjectsName = item.SubjectsName
          ? item.SubjectsName.toLowerCase()
          : "";

        return (
          Subjects.includes(searchTerm) || SubjectsName.includes(searchTerm)
        );
      });
    },
  },
  methods: {
    async del(row) {
      const result = confirm("您確定要刪除此項目嗎？此操作無法恢復。");
      if (result) {
        const req ={
          id:row.id
        }
        await axios
          .post("/apiServer/finance/delAccount", req)
          .then((response) => {
            if (response.status === 200 && response.data.returnCode === 0) {
              // 成功提示
              this.$message({
                message: "刪除成功",
                type: "success",
              });
              this.debitAccount();
            } else {
              // 處理非 0 成功代碼
              this.$message({
                message: "刪除失敗",
                type: "error",
              });
            }
          });
      }
    },
    async savePassbill() {
      if (
        !this.form.Subjects ||
        !this.form.SubjectsName ||
        !this.form.type ||
        !this.form.useType
      ) {
        this.$message({
          message: "欄位不得為空",
          type: "warning",
        });
        return;
      }
      if (this.form.Subjects.length != 6) {
        this.$message({
          message: "請確認是否為6位數",
          type: "warning",
        });
        return;
      }
      if (this.debit.some((item) => item.Subjects === this.form.Subjects)) {
        this.$message({
          message: `已存在 科目編號：${this.form.Subjects} 科目名稱：${
            this.debit.find((item) => item.Subjects === this.form.Subjects)
              .SubjectsName
          }`,
          type: "warning",
        });
        return;
      }

      this.loading = true;
      const req = {
        Subjects: this.form.Subjects,
        SubjectsName: this.form.SubjectsName,
        type: this.form.type,
        useType: this.form.useType,
      };
      await axios
        .post("/apiServer/finance/inAccount", req)
        .then((response) => {
          if (response.status === 200 && response.data.returnCode === 0) {
            // 成功提示
            this.$message({
              message: "新增成功",
              type: "success",
            });
            this.debitAccount(); //項目
            this.form = {};
            this.dialog = false;
            this.loading = false;
          }
        })
        .catch((error) => {
          // 發生錯誤時，顯示錯誤提示
          this.$message({
            message: "失敗，伺服器錯誤",
            type: "error",
          });
          console.error("Error:", error);
        });
    },
    async debitAccount() {
      try {
        // 發送 GET 請求到指定的 API
        const response = await axios.get(
          "/apiServer/finance/debitAccount"
        );
        this.debit = response.data.data;
        this.searchallAccount = this.debit.map((item) => ({
          id: item.id,
          label: `${item.Subjects} ${item.SubjectsName}`,
        }));
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    async editAcc(row) {
      this.loading = true;
      const req = {
        id: row.id,
        SubjectsName: row.SubjectsName,
      };
      await axios
        .post("/apiServer/finance/editAccount", req)
        .then((response) => {
          if (response.status === 200 && response.data.returnCode === 0) {
            // 成功提示
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.debitAccount(); //項目
            this.editingRow = null; // 取消編輯狀態
            this.loading = false;
          }
        })
        .catch((error) => {
          // 發生錯誤時，顯示錯誤提示
          this.loading = false;
          this.$message({
            message: "失敗，伺服器錯誤",
            type: "error",
          });
          console.error("Error:", error);
        });
    },
    limitToSixDigits() {
      // 只允許數字，並限制最多6位數
      this.form.Subjects = this.form.Subjects.replace(/\D/g, "").slice(0, 6);
    },
    Edit(row) {
      this.editingRow = row; // 設置當前正在編輯
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
