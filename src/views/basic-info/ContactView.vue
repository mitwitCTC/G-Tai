<template>
  <ListBar />
  <div class="page-title">
    <h2>{{ pageTitle }}</h2>
  </div>
  <div>
    <BreadCrumb :isSpecialPage="true" />
  </div>
  <el-button type="primary" @click="dialog = true">新增聯絡人</el-button>
  <div class="page-title">
    <h5>
      客戶代號:
      <h4>{{ this.cus_code }}</h4>
      客戶名稱:
      <h4>{{ this.cus_name }}</h4>
    </h5>
  </div>
  <div class="table-container">
    <el-table :data="paginatedData" style="width: 100%" v-loading="loading">
      <el-table-column
        prop="job_title"
        label="職稱"
        width="100"
      ></el-table-column>
      <!-- <el-table-column prop="gender" label="性別"></el-table-column> -->
      <el-table-column prop="name" label="姓名" width="150"></el-table-column>
      <el-table-column
        prop="mobile"
        label="手機/電話"
        width="120"
      ></el-table-column>
      <!-- <el-table-column prop="mail" label="聯絡E-MAIL"></el-table-column> -->
      <el-table-column
        prop="isLine"
        label="是否綁定Line"
        style="width: 50px"
        :formatter="format3"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="messageNotify"
        label="訊息通知"
        :formatter="format"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="messageMail"
        label="通知Mail"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="billNotify"
        label="帳單通知"
        :formatter="format2"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="billMail"
        label="帳務地址/Mail"
        width="280"
      ></el-table-column>
      <el-table-column prop="notes" label="備註" width="300"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <div class="action-icons">
            <!-- <i class="fas fa-eye " @click="viewDetails(scope.row)"></i> -->
            <i class="fas fa-edit" @click="editItem(scope.row)"></i>
            <!-- <i class="fa-solid fa-trash-can"  @click="deleteItem(scope.row)"></i> -->
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <div class="pagination-info">
        Showing {{ startItem }} to {{ endItem }} of {{ contact.length }}
      </div>
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="contact.length"
        layout="prev, pager, next, jumper"
        class="pagination"
      />
    </div>
    <!-- 新增聯絡人 -->
    <el-dialog
      title="新增聯絡人"
      v-model="dialog"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="120px">
        <!-- 统一標籤寬度 -->
        <el-row style="margin-bottom: 20px">
          <!-- <el-form-item label="職稱">
            <el-input v-model="form.job_title"></el-input>
          </el-form-item> -->
          <el-form-item label="職稱">
            <el-select v-model="form.job_title" placeholder="選擇職稱">
            <el-option label="承辦" :value="'承辦'"></el-option>
            <el-option label="會計" :value="'會計'"></el-option>
          </el-select>
        </el-form-item>
          <!-- <el-form-item label="性別">
            <el-select v-model="form.gender" placeholder="選擇性別">
            <el-option label="男" :value="'男'"></el-option>
            <el-option label="女" :value="'女'"></el-option>
          </el-select>
        </el-form-item> -->
          <el-form-item label="姓名">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="備註">
            <el-input v-model="form.notes"></el-input>
          </el-form-item>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-form-item label="聯絡E-MAIL">
            <el-input v-model="form.mail"></el-input>
          </el-form-item>
          <el-form-item label="電話/手機">
            <el-input
              v-model="form.mobile"
              @input="validatePhone"
              maxlength="10"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-form-item label="訊息通知">
            <el-select v-model="form.messageNotify" placeholder="選擇">
              <el-option label="無" :value="'0'"></el-option>
              <el-option label="手機" :value="'1'"></el-option>
              <!-- <el-option label="line" :value="'2'"></el-option> -->
              <el-option label="Mail" :value="'3'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="帳單通知">
            <el-select v-model="form.billNotify" placeholder="選擇">
              <el-option label="無" :value="'0'"></el-option>
              <el-option label="寄送" :value="'1'"></el-option>
              <!-- <el-option label="line" :value="'2'"></el-option> -->
              <el-option label="Mail" :value="'3'"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-form-item label="訊息通知Mail" v-if="form.messageNotify == 3">
            <el-input v-model="form.messageMail"></el-input>
          </el-form-item>
          <el-form-item
            label="帳務地址/Mail"
            v-if="form.billNotify == 1 || form.billNotify == 3"
          >
            <el-input v-model="form.billMail"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="dialog = false">取消</el-button>
          <el-button type="primary" @click="savePass">送出</el-button>
        </div>
      </template>
    </el-dialog>
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
      ismobile: false,
      ismail: false,
      loading: false,
      cus_code: "",
      cus_name: "",
      dialog: false,
      contact: [],
      form: {
        createTime: "",
      },
      type: {
        0: "無",
        1: "手機",
        2: "Line",
        3: "Mail",
      },
      type2: {
        0: "無",
        1: "寄送",
        2: "Line",
        3: "Mail",
      },
      type3: {
        0: "否",
        1: "是",
      },
      currentPage: 1,
      pageSize: 10,
    };
  },
  created() {
    this.cus_code = this.$route.query.cus_code;
    this.cus_name = this.$route.query.cus_name;
    this.form.customerId = this.cus_code;
    this.getselectData();
  },
  computed: {
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.contact.slice(start, end);
    },
    startItem() {
      return (this.currentPage - 1) * this.pageSize + 1;
    },
    endItem() {
      return Math.min(this.currentPage * this.pageSize, this.contact.length);
    },
  },
  methods: {
    validatePhone(value) {
      // 僅保留數字，限制最大長度 10
      this.form.mobile = value.replace(/\D/g, "").slice(0, 10);
    },
    format(messageNotify) {
      const type = toRaw(messageNotify);
      return this.type[type.messageNotify] || "未知";
    },
    format2(billNotify) {
      const type = toRaw(billNotify);
      return this.type2[type.billNotify] || "未知";
    },
    format3(isLine) {
      const type = toRaw(isLine);
      return this.type3[type.isLine] || "未知";
    },

    async getselectData() {
      this.loading = true; // 開始加載
      const postData = {
        customerId: this.cus_code,
      };
      await axios
        .post("http://122.116.23.30:3347/main/searchContact", postData)
        .then((response) => {
          this.contact = response.data.data;
          this.loading = false; // 請求完成後關閉加載狀態
        })
        .catch((error) => {
          // 處理錯誤
          console.error("API request failed:", error);
        });
    },
    savePass() {
      const req = this.form;
      if (!this.form.name) {
        this.$message({
          message: "姓名不可為空",
          type: "warning",
        });
        return;
      }
      if (this.form.messageNotify == 1 && !this.form.mobile) {
        this.$message({
          message: "簡訊方式通知 手機欄位不可為空",
          type: "warning",
        });
        return;
      }
      if (this.form.messageNotify == 3 && !this.form.messageMail) {
        this.$message({
          message: "Mail方式通知 訊息通知Mail欄位不可為空",
          type: "warning",
        });
        return;
      }
      if (
        (this.form.billNotify == 1 || this.form.billNotify == 3) &&
        !this.form.billMail
      ) {
        this.$message({
          message: "寄送/Mail方式通知 帳務地址/Mail欄位不可為空",
          type: "warning",
        });
        return;
      }
      // 發送 POST 請求
      axios
        .post("http://122.116.23.30:3347/main/createContact", req)
        .then((response) => {
          if (response.status === 200 && response.data.returnCode === 0) {
            // 成功提示
            this.$message({
              message: "新增成功",
              type: "success",
            });

            // 清空表單
            this.form = "";
            // 關閉對話框
            this.dialog = false;

            // 刷新數據
            this.getselectData();
          } else {
            // 處理非 0 成功代碼
            this.$message({
              message: "新增失敗",
              type: "error",
            });
          }
        })
        .catch((error) => {
          // 發生錯誤時，顯示錯誤提示
          this.$message({
            message: "新增失敗，伺服器錯誤",
            type: "error",
          });
          console.error("Error:", error);
        });
    },
    handlePageChange(page) {
      this.currentPage = page;
    },

    editItem(row) {
      this.$router.push({
        path: "UpdateView",
        query: {
          rowType: "2",
          cus_code: this.cus_code,
          cus_name: this.cus_name,
          rowData: JSON.stringify(row),
        },
      });
    },
  },
};
</script>

<style scoped>
.el-select {
  width: 175px;
}
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.pagination-info {
  margin-right: auto; /* 确保分页信息靠左 */
  padding-right: 1090px; /* 可选: 添加右边距以与分页控件分开 */
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
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-input {
  width: 200px;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

.el-table {
  min-width: 900px;
}

.el-table th,
.el-table td {
  white-space: nowrap;
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
