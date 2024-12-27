<template>
  <ListBar />
  <div class="page-title">
    <h2>{{ pageTitle }}</h2>
  </div>
  <div>
    <BreadCrumb />
  </div>
  <div>
    <el-form-item label="結帳起日">
      <el-date-picker
        v-model="search_month"
        type="date"
        placeholder="請選擇結帳日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        style="margin-right: 20px"
        @change="clink()"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="結帳迄日">
      <el-date-picker
        v-model="search_end_month"
        type="enddate"
        placeholder="請選擇結帳日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        style="margin-right: 20px"
        @change="clink()"
      >
      </el-date-picker>
      <el-input
        v-model="customerName"
        placeholder="輸入客戶名稱/客戶代號/摘要/"
        style="width: 225px; margin-right: 10px"
        v-if="cus_message.length > 0"
      ></el-input>
      <el-button type="primary" @click="openDialog">新增會計傳票</el-button>
    </el-form-item>
  </div>

  <div class="table-container" v-if="cus_message.length > 0">
    <el-table :data="filteredData" style="width: 100%">
      <el-table-column prop="id" label="傳票號碼" width="200" />
      <el-table-column prop="accDate" label="傳票日期" width="150" />
      <el-table-column prop="accFarewell" label="結帳年月" width="100" />
      <el-table-column prop="customerId" label="客戶代號" width="100" />
      <el-table-column prop="cus_name" label="客戶名稱" width="250" />
      <el-table-column prop="debitmessage" label="主摘要" width="250" />
      <el-table-column prop="amount" label="借貸金額" align="right" width="100"
        ><template v-slot="scope"
          >{{ formatCurrency(scope.row.amount) }}
        </template></el-table-column
      >
      <el-table-column label="操作">
        <template v-slot="scope">
          <div class="action-icons">
            <i class="fas fa-eye" @click="selectItemVehicle(scope.row)"></i>
            <i class="fas fa-edit" @click="editItem(scope.row)"></i>
            <i
              class="fa-regular fa-copy"
              @click="copyItemVehicle(scope.row)"
            ></i>
            <i class="fa-solid fa-trash-can" @click="deleteItem(scope.row)"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div style="margin-bottom: 50px"></div>

  <el-dialog
    :title="dialogTitle == 0 ? '新增會計傳票' : '修改會計傳票'"
    v-model="dialogVisible"
    width="90%"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-form-item label="*傳票日期">
      <el-date-picker
        v-model="entries.accDate"
        type="date"
        placeholder="傳票日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        style="width: 300px; margin-right: 20px"
      >
      </el-date-picker>
    </el-form-item>
    <el-row>
      <el-form-item label="客戶編號">
        <el-select
          v-model="entries.customerId"
          placeholder="輸入客戶名稱/客代"
          filterable
          :clearable="true"
          style="width: 300px"
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
      <el-form-item label="客戶名稱" style="margin-left: 70px">
        <el-input
          v-model="entries.cus_name"
          disabled
          style="width: 300px"
        ></el-input>
      </el-form-item>
    </el-row>
    <el-form-item label="主摘要&nbsp;&nbsp;&nbsp;">
      <el-input
        v-model="entries.debitmessage"
        type="textarea"
        style="width: 46%"
        placeholder="主摘要"
      ></el-input>
    </el-form-item>
    <!-- 借貸兩方 -->
    <div
      style="display: flex; justify-content: space-between; margin-bottom: 20px"
    >
      <!-- 借方 -->
      <div style="width: 48%">
        <h3>借方</h3>
        <el-row :gutter="20" align="middle">
          <el-form-item label="會計科目" label-width="80px">
            <!-- <el-select
              v-model="debitcurrentEntry.subject"
              placeholder="選擇會計科目"
              style="width: 200px"
            >
              <el-option
                v-for="item in debit"
                :key="item.parkId"
                :label="item.SubjectsName"
                :value="item.Subjects"
              ></el-option>
            </el-select> -->
            <el-select
              v-model="debitcurrentEntry.subject"
              placeholder="輸入會計科目"
              filterable
              :clearable="true"
              style="width: 200px"
            >
              <!-- 使用 cusdata 直接顯示每個字符串 -->
              <el-option
                v-for="item in debit"
                :key="item.parkId"
                :label="item.SubjectsName"
                :value="item.Subjects"
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
          <el-table-column
            prop="SubjectsName"
            label="會計科目"
          ></el-table-column>
          <el-table-column prop="amount" label="金額" align="right" width="150">
            <template v-slot="scope">
              <el-input
                v-model="scope.row.amount"
                @blur="scope.row.amount = formatAmount(scope.row.amount)"
                placeholder="輸入金額"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="debitmessage" label="借方摘要">
            <template v-slot="scope">
              <el-input
                v-model="scope.row.debitmessage"
                placeholder="借方-摘要"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="90">
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
            <!-- <el-select
              v-model="creditcurrentEntry.subject"
              placeholder="選擇會計科目"
              style="width: 200px"
            >
              <el-option
                v-for="item in credit"
                :key="item.parkId"
                :label="item.SubjectsName"
                :value="item.Subjects"
              ></el-option>
            </el-select> -->
            <el-select
              v-model="creditcurrentEntry.subject"
              placeholder="輸入會計科目"
              filterable
              :clearable="true"
              style="width: 200px"
            >
              <!-- 使用 cusdata 直接顯示每個字符串 -->
              <el-option
                v-for="item in credit"
                :key="item.parkId"
                :label="item.SubjectsName"
                :value="item.Subjects"
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
          <el-table-column
            prop="SubjectsName"
            label="會計科目"
          ></el-table-column>
          <el-table-column prop="amount" label="金額" align="right" width="150">
            <template v-slot="scope">
              <el-input
                v-model="scope.row.amount"
                @blur="scope.row.amount = formatAmount(scope.row.amount)"
                placeholder="輸入金額"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="creditmessage" label="貸方摘要">
            <template v-slot="scope">
              <el-input
                v-model="scope.row.creditmessage"
                placeholder="貸方-摘要"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="90">
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
        <!-- <el-input
          v-model="entries.creditmessage"
          type="textarea"
          style="width: 100%"
          placeholder="貸方-摘要"
        ></el-input> -->
      </div>
    </div>

    <!-- 底部按鈕 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取消</el-button>
      <!-- <el-button type="info" @click="submitForm(1)">新增傳票</el-button> -->
      <el-button type="primary" @click="submitForm(2)">送出</el-button>
    </span>
  </el-dialog>

  <!-- 查詢詳細 -->
  <el-dialog
    title="會計傳票"
    v-model="selectdialog"
    width="90%"
    :close-on-click-modal="false"
  >
    <el-table :data="select" style="width: 100%" class="section-header">
      <el-table-column prop="id" label="傳票號碼" width="200" />
      <el-table-column prop="accDate" label="傳票日期" width="250" />
      <el-table-column prop="accFarewell" label="結帳年月" width="150" />
      <el-table-column prop="customerId" label="客戶代號" width="210" />
      <el-table-column prop="cus_name" label="客戶名稱" width="300" />
      <el-table-column prop="debitmessage" label="主摘要" width="400" />
      <el-table-column prop="amount" label="借貸金額" align="right" width="150"
        ><template v-slot="scope"
          >{{ formatCurrency(scope.row.amount) }}
        </template></el-table-column
      >
    </el-table>
    <!-- 借貸兩方 -->
    <div
      style="display: flex; justify-content: space-between; margin-bottom: 20px"
    >
      <!-- 借方 -->
      <div style="width: 48%">
        <h3>借方</h3>

        <el-table :data="select[0].debit" border>
          <el-table-column
            prop="SubjectsName"
            label="會計科目"
          ></el-table-column>
          <el-table-column prop="amount" label="金額" align="right" width="150">
            <template v-slot="scope"
              >{{ formatCurrency(scope.row.amount) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="debitmessage"
            label="借方摘要"
          ></el-table-column>
        </el-table>
        <div style="text-align: right; margin-top: 10px">
          <b>借方總金額：</b>{{ totalSelDebit }}
        </div>

        <!-- <el-input
          v-model="select[0].debitmessage"
          type="textarea"
          style="width: 100%"
          placeholder="主摘要"
          disabled
        ></el-input> -->
      </div>

      <!-- 貸方 -->
      <div style="width: 48%">
        <h3>貸方</h3>
        <el-table :data="select[0].credit" border>
          <el-table-column
            prop="SubjectsName"
            label="會計科目"
          ></el-table-column>
          <el-table-column prop="amount" label="金額" align="right" width="150">
            <template v-slot="scope"
              >{{ formatCurrency(scope.row.amount) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="creditmessage"
            label="貸方摘要"
          ></el-table-column>
        </el-table>
        <div style="text-align: right; margin-top: 10px">
          <b>貸方總金額：</b>{{ totalSelDebit }}
        </div>
        <!-- <el-input
          v-model="select[0].creditmessage"
          type="textarea"
          style="width: 100%"
          placeholder="貸方-摘要"
          disabled
        ></el-input> -->
      </div>
    </div>
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
      customerName: "",
      dialogVisible: false, // 控制Dialog顯示
      selectdialog: false,
      isEditable: null,
      search_month: "",
      search_end_month: "",
      dialogTitle: "",
      debit: [],
      credit: [],
      cusData: [],
      debitcurrentEntry: {
        //借方
        subject: "", // 當前選擇的會計科目
      },
      creditcurrentEntry: {
        //貸方
        subject: "", // 當前選擇的會計科目
      },
      entries: {
        id:"",
        customerId: "",
        cus_name: "",
        accDate: "", //傳票日期
        debitmessage: "", //借方摘要
        // creditmessage: "", //貸方摘要
        debit: [], // 借方資料
        credit: [], // 貸方資料
      },
      cus_message: [],
      select: {
        debit: [], // 借方資料
        credit: [], // 貸方資料,
      },
    };
  },
  created() {
    this.debitAccount(); //借方項目
    this.creditAccount(); //貸方項目
    this.getcus(); //客戶資料
  },
  computed: {
    totalDebit() {
      return this.entries.debit
        .reduce((sum, entry) => {
          // 確保 amount 是字串，然後移除千分位逗號
          const amount = parseFloat(String(entry.amount).replace(/,/g, ""));
          return sum + (isNaN(amount) ? 0 : amount); // 確保數值有效
        }, 0)
        .toLocaleString(); // 格式化為千分位字串
    },
    totalCredit() {
      return this.entries.credit
        .reduce((sum, entry) => {
          // 移除千分位逗號，將金額轉換為數字
          const amount = parseFloat(String(entry.amount).replace(/,/g, ""));
          return sum + (isNaN(amount) ? 0 : amount); // 處理可能無效的數據
        }, 0)
        .toLocaleString(); // 計算總金額後，格式化為千分位
    },
    totalSelDebit() {
      return this.select[0].debit
        .reduce((sum, entry) => {
          // 確保 amount 是字串，然後移除千分位逗號
          const amount = parseFloat(String(entry.amount).replace(/,/g, ""));
          return sum + (isNaN(amount) ? 0 : amount); // 確保數值有效
        }, 0)
        .toLocaleString(); // 格式化為千分位字串
    },
    totalSelCredit() {
      return this.select[0].credit
        .reduce((sum, entry) => {
          // 移除千分位逗號，將金額轉換為數字
          const amount = parseFloat(String(entry.amount).replace(/,/g, ""));
          return sum + (isNaN(amount) ? 0 : amount); // 處理可能無效的數據
        }, 0)
        .toLocaleString(); // 計算總金額後，格式化為千分位
    },
    filteredData() {
      const searchTerm = this.customerName.trim().toLowerCase();

      return this.cus_message.filter((item) => {
        const cusCode = item.customerId ? item.customerId.toLowerCase() : "";
        const cusName = item.cus_name ? item.cus_name.toLowerCase() : "";
        const debitmessage = item.debitmessage
          ? item.debitmessage.toLowerCase()
          : "";

        return (
          cusCode.includes(searchTerm) ||
          cusName.includes(searchTerm) ||
          debitmessage.includes(searchTerm)
        );
      });
    },
  },
  methods: {
    async deleteItem(row) {
      const result = confirm("您確定要刪除此項目嗎？此操作無法恢復。");
      if (result) {
        const req = {
          id: row.id,
        };
        await axios
          .post("http://122.116.23.30:3347/finance/deleteSubpoena", req)
          .then((response) => {
            if (response.status === 200 && response.data.returnCode === 0) {
              // 成功提示
              this.$message({
                message: "刪除成功",
                type: "success",
              });
              this.clink();
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
    async debitAccount() {
      try {
        // 發送 GET 請求到指定的 API
        const response = await axios.get(
          "http://122.116.23.30:3347/finance/debitAccount"
        );
        this.debit = response.data.data;
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
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },

    removeEntry(index, type) {
      this.entries[type].splice(index, 1); // 刪除對應類型 (debit/credit) 的索引條目
    },
    openDialog() {
      this.dialogTitle = "0";
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
          id:this.debitcurrentEntry.id,
          amount: "0",
          SubjectsName: this.debit.find(
            (item) => item.Subjects === this.debitcurrentEntry.subject
          ).SubjectsName,
          Subjects: this.debitcurrentEntry.subject,
          // type: this.debit.find(
          //   (item) => item.Subjects === this.debitcurrentEntry.subject
          // ).type,
          type: "1",
        };
        this.entries.debit.push(newEntry);
        // this.debitcurrentEntry = { subject: "" };
      } else if (Type === "credit") {
        if (!this.creditcurrentEntry.subject) {
          this.$message.error("請先選擇會計科目！");
          return;
        }

        const newEntry = {
          id:this.creditcurrentEntry.id,
          amount: "0",
          SubjectsName: this.credit.find(
            (item) => item.Subjects === this.creditcurrentEntry.subject
          ).SubjectsName,
          Subjects: this.creditcurrentEntry.subject,
          // type: this.credit.find(
          //   (item) => item.Subjects === this.creditcurrentEntry.subject
          // ).type,
          type: "2",
        };
        this.entries.credit.push(newEntry);
        // this.creditcurrentEntry = { subject: "" };
      }
    },
    async submitForm(type) {
      if (this.totalDebit !== this.totalCredit) {
        this.$message.error("借貸金額不平衡，請確認！");
        return;
      }
      if (!this.entries.accDate) {
        this.$message.error("請填寫傳票日期");
        return;
      }
      const totalAmount = this.formatString(this.totalDebit);
      this.entries.debit = this.entries.debit.map((entry) => ({
        ...entry,
        amount: this.formatString(entry.amount),
      }));
      this.entries.credit = this.entries.credit.map((credit) => ({
        ...credit,
        amount: this.formatString(credit.amount),
      }));
      const postData = {
        id:this.entries.id,
        trade_name: "資產負債表",
        totalAmount: totalAmount,
        accDate: this.entries.accDate,
        debitmessage: this.entries.debitmessage,
        creditmessage: this.entries.creditmessage,
        customerId: this.entries.customerId,
        cus_name: this.entries.cus_name,
        detail: [...this.entries.debit, ...this.entries.credit],
      };
      if(this.dialogTitle=='0'){
        await axios
        .post("http://122.116.23.30:3347/finance/subpoena", postData)
        .then((response) => {
          this.$message.success("會計傳票新增成功！");
          if (type == 1) {
            this.resetForm(1);
          } else if (type == 2) {
            this.resetForm(2);
            this.closeDialog();
          }
          this.clink();
        })
        .catch((error) => {
          // 處理錯誤
          this.$message({
            message: "新增失敗",
            type: "error",
          });
          console.error("API request failed:", error);
        });
      //成功訊息並關閉
      }else if(this.dialogTitle=='1'){
        await axios
        .post("http://122.116.23.30:3347/finance/updatesubpoena", postData)
        .then((response) => {
          this.$message.success("會計傳票修改成功！");
          if (type == 1) {
            this.resetForm(1);
          } else if (type == 2) {
            this.resetForm(2);
            this.closeDialog();
          }
          this.clink();
        })
        .catch((error) => {
          // 處理錯誤
          this.$message({
            message: "新增失敗",
            type: "error",
          });
          console.error("API request failed:", error);
        });
      //成功訊息並關閉
      }
      
    },
    resetForm(type) {
      if (type == 1) {
        this.entries.debit.forEach((entry) => {
          entry.amount = 0; // 清空 debit 的 amount
        });
        this.entries.credit.forEach((entry) => {
          entry.amount = 0; // 清空 credit 的 amount
        });
        (this.entries.customerId = ""),
          (this.entries.cus_name = ""),
          (this.entries.debitmessage = ""),
          (this.entries.creditmessage = "");
      } else if (type == 2) {
        this.entries = { debit: [], credit: [] };
        this.debitcurrentEntry = { subject: "", amount: 0 };
        this.creditcurrentEntry = { subject: "", amount: 0 };
      }
    },
    async selectdata(id, type) {
      const postData = {
        id: id,
      };
      await axios
        .post("http://122.116.23.30:3347/finance/selectSubpoena", postData)
        .then((response) => {
          if (type == "select") {
            this.select = response.data.data.map((record) => {
              // 初始化 debit 和 credit
              const debit = [];
              const credit = [];

              // 遍歷 detail，根據 type 分類
              record.detail.forEach((item) => {
                if (item.type === "1") {
                  debit.push(item); // 借方資料
                } else {
                  credit.push(item); // 貸方資料
                }
              });

              // 返回合併後的資料結構
              return {
                ...record, // 保留其他屬性 (如 id, parkId, trade_name 等)
                debit,
                credit,
              };
            });
            this.select[0].debit = this.select[0].debit.map((entry) => {
              // 尋找對應的 SubjectsName
              const subject = this.debit.find(
                (item) => item.Subjects === entry.Subjects
              );
              return {
                ...entry, // 保留原始資料
                SubjectsName: subject ? subject.SubjectsName : "", // 如果找到則添加，否則為空字符串
              };
            });
            this.select[0].credit = this.select[0].credit.map((credit) => {
              // 尋找對應的 SubjectsName
              const subject = this.credit.find(
                (item) => item.Subjects === credit.Subjects
              );
              return {
                ...credit, // 保留原始資料
                SubjectsName: subject ? subject.SubjectsName : "", // 如果找到則添加，否則為空字符串
              };
            });
          } else if (type == "copy") {
            this.entries = response.data.data.map((record) => {
              // 初始化 debit 和 credit
              const debit = [];
              const credit = [];

              // 遍歷 detail，根據 type 分類
              record.detail.forEach((item) => {
                if (item.type === "1") {
                  debit.push(item); // 借方資料
                } else {
                  credit.push(item); // 貸方資料
                }
              });

              // 返回合併後的資料結構
              return {
                ...record, // 保留其他屬性 (如 id, parkId, trade_name 等)
                debit,
                credit,
              };
            });
            this.entries[0].debit = this.entries[0].debit.map((entry) => {
              // 尋找對應的 SubjectsName
              const subject = this.debit.find(
                (item) => item.Subjects === entry.Subjects
              );
              return {
                ...entry, // 保留原始資料
                SubjectsName: subject ? subject.SubjectsName : "", // 如果找到則添加，否則為空字符串
              };
            });
            this.entries[0].credit = this.entries[0].credit.map((credit) => {
              // 尋找對應的 SubjectsName
              const subject = this.credit.find(
                (item) => item.Subjects === credit.Subjects
              );
              return {
                ...credit, // 保留原始資料
                SubjectsName: subject ? subject.SubjectsName : "", // 如果找到則添加，否則為空字符串
              };
            });
            this.entries = this.entries[0];
          }
        })
        .catch((error) => {
          // 處理錯誤
          this.$message({
            message: "系統錯誤",
            type: "error",
          });
          console.error("API request failed:", error);
        });
      // 成功訊息並關閉
    },
    async copyItemVehicle(row) {
      await this.selectdata(row.id, "copy");
      this.dialogTitle = "0";
      this.dialogVisible = true;
    },
    async editItem(row) {
      await this.selectdata(row.id, "copy");
      this.entries.id=row.id
      this.dialogTitle = "1";
      this.dialogVisible = true;
    },
    async selectItemVehicle(row) {
      await this.selectdata(row.id, "select");
      this.selectdialog = true;
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
    DateBeforeToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // 將時間設置為當天午夜
      return date.getTime() > today.getTime(); // 禁用今天以後的日期
    },
    getdata() {
      this.entries.cus_name = "";
      const postData = {
        cus_code: this.entries.customerId,
        customerId: this.entries.customerId,
      };
      if (this.entries.customerId.length == 8) {
        this.entries.cus_name = "查詢中..";
        axios
          .post("http://122.116.23.30:3347/main/searchCustomer", postData)
          .then((response) => {
            this.entries.cus_name = response.data.data[0].cus_name;
          })
          .catch((error) => {
            // 處理錯誤
            this.entries.cus_name = "";
            this.$message({
              message: "請確認客戶代號是否有誤",
              type: "error",
            });
            console.error("API request failed:", error);
          });
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
          console.error("API request failed:", error);
        });
    },
    async clink() {
      if (this.search_month && this.search_end_month) {
        const postData = {
          date: this.search_month,
          enddate: this.search_end_month,
        };
        await axios
          .post("http://122.116.23.30:3347/finance/searchSubpoena", postData)
          .then((response) => {
            this.cus_message = response.data.data;
            if (!this.cus_message) {
              this.cus_message = [];
              this.$message({
                message: `查無選擇年月資料`,
                type: "warning",
              });
            }
          })
          .catch((error) => {
            // 處理錯誤
            console.error("API request failed:", error);
          });
      }
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
</style>
