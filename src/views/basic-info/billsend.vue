<template>
  <ListBar />
  <div class="page-title">
    <h2>{{ pageTitle }}</h2>
  </div>
  <div>
    <BreadCrumb />
  </div>
  <el-form-item label="帳單期別">
    <!-- 帳單期別的日期選擇器 -->
    <el-date-picker
      v-model="search_month"
      type="month"
      format="YYYY-MM"
      value-format="YYYY-MM"
      placeholder="請選擇帳單期別"
      style="margin-right: 10px"
      @change="clink()"
    />
    <el-button
      type="primary"
      v-if="this.month_check !== '0' &&  this.check!='30'"
      style="margin-left: 10px"
      @click="changesystemwork('30')"
      >確認寄送名單</el-button
    >
  </el-form-item>
  <div class="page-title" style="color: red" v-if="this.check == '30'">
    <h5>{{ search_month }}寄送名單已確認</h5>
  </div>
  <el-form-item label="Mail發送" class="section-header">
    <el-table :data="this.mail" style="width: 100%">
      <el-table-column prop="farewell" label="期別" width="150" />
      <el-table-column prop="customerId" label="客戶代號" width="150" />
      <el-table-column prop="cus_name" label="客戶名稱" width="400" />
      <el-table-column prop="connectionId" label="寄送資訊" width="300" />
      <el-table-column prop="sendType" label="寄送狀態" width="200">
        <template #default="{ row }">
          <el-tag :type="getTagType(row.sendType)">
            {{ getSendTypeText(row.sendType) }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-form-item>

  <el-form-item label="Line發送" class="section-header">
    <el-table :data="this.line" style="width: 100%">
      <el-table-column prop="farewell" label="期別" width="150" />
      <el-table-column prop="customerId" label="客戶代號" width="150" />
      <el-table-column prop="cus_name" label="客戶名稱" width="400" />
      <el-table-column prop="connectionId" label="寄送資訊" width="300" />
      <el-table-column prop="sendType" label="寄送狀態" width="200">
        <template #default="{ row }">
          <el-tag :type="getTagType(row.sendType)">
            {{ getSendTypeText(row.sendType) }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-form-item>
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
      search_month: "",
      month_check: "",
      check:"",
      mail: [],
      line: [],
    };
  },
  computed: {},
  methods: {
    async clink() {
      this.isLoading = true;
      await this.getdata();
      await this.getsysTIME();
      await this.getsystemwork();
      this.isLoading = false;
    },
    async getdata() {
      try {
        const postdata = {
          farewell: this.search_month,
        };
        const response = await axios.post(
          "http://122.116.23.30:3347/finance/billsend",
          postdata
        );
        // 確認 API 回應是否有資料
        if (response.data) {
          this.mail = response.data.data.Mail;
          this.line = response.data.data.Line;
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    async getsysTIME() {
      try {
        const postdata = {
          workDate: this.search_month,
          type: "24",
        };
        const response = await axios.post(
          "http://122.116.23.30:3347/finance/getsystemwork",
          postdata
        );
        // 確認 API 回應是否有資料
        if (response.data && response.data.data.length > 0) {
          this.month_check = String(response.data.data[0].endTime);
          console.log(this.month_check)
        } else {
          this.month_check = "123";
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    async getsystemwork() {
      try {
        const postdata = {
          workDate: this.search_month,
          type: "30",
        };
        const response = await axios.post(
          "http://122.116.23.30:3347/finance/getsystemwork",
          postdata
        );
        // 確認 API 回應是否有資料
        if (response.data && response.data.data.length > 0) {
          this.check = response.data.data[0].type;
        } else {
          this.check = "";
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    async updatebill() {
      // // 组合 mail[] 和 line[] 的数据
      // const requests = [...this.mail, ...this.line];
      // for (const customer of requests) {
      //   const postdata = {
      //     id: customer.id,
      //     farewell: customer.farewell, // mail 或 line
      //     sendMod: customer.sendMod, // 假设 mail/line 里有 sendMod
      //     customerId: customer.customerId, // 假设 mail/line 里有 customerId
      //   };

      //   try {
      //     const response = await axios.post(
      //       "http://122.116.23.30:3347/finance/updatesend",
      //       postdata
      //     );
      //   } catch (error) {
      //     console.error(`Error updating ${type}:`, error);
      //   }
      // }
      try {
        // 组合 mail[] 和 line[] 的数据
        const requests = [...(this.mail || []), ...(this.line || [])].map((customer) => {
          const postdata = {
            id: customer.id,
            farewell: customer.farewell, // mail 或 line
            sendMod: customer.sendMod,
            customerId: customer.customerId,
          };

          // 返回 axios 请求的 Promise
          return axios.post(
            "http://122.116.23.30:3347/finance/updatesend",
            postdata
          );
        });

        // **并行执行所有 API 请求**
        const responses = await Promise.all(requests);

        console.log("所有 API 請求完成:", responses);
      } catch (error) {
        console.error("Error updating bill:", error);
      }
    },

    async changesystemwork(type) {
      if (!this.search_month) {
        this.$message({
          message: "請先選擇帳務期別",
          type: "error",
        });
        return;
      }
      const result = confirm("此動作無法返回，請確認是否無誤");
      if (result) {
        try {
          // 确保 this.mail 和 this.line 存在
          if (this.mail.length == 0 && this.line.length == 0) {
            this.$message({
              message: "無名單可進行確認",
              type: "error",
            });
            return;
          }
          this.isLoading = true; // 開始加載
          await this.updatebill();
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
          this.clink();
          this.isLoading = false; // 請求完成後關閉加載狀態
        }
      }
    },
    getSendTypeText(type) {
      const statusMap = {
        0: "未設定",
        1: "已設定傳送",
        2: "傳送成功",
        3: "傳送失敗",
        4: "檔案太多需手動發送",
        6: "找無檔案發送",
      };
      return statusMap[type] || "未知狀態";
    },
    getTagType(type) {
      const tagMap = {
        0: "info", // 灰色
        1: "warning", // 橙色
        2: "success", // 綠色
        3: "danger", // 紅色
        4: "danger", // 紅色
        6: "danger", // 紅色
      };
      return tagMap[type] || "info";
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
</style>
