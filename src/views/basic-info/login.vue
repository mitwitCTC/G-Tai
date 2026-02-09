<template>
  <div>
    <el-form>
      <div class="sidebar-heading">
        <img src="@/assets/logo.png" alt="Logo" class="img-fluid" />
      </div>
      <div style="margin-bottom: 50px"></div>
      <el-form-item label="帳號" prop="account">
        <el-input v-model="account" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密碼" prop="password">
        <el-input
          v-model="password"
          type="password"
          autocomplete="off"
          @keydown.enter="submitForm(loginFormRef)"
        />
      </el-form-item>
      <el-form-item>
        <div class="w-100 text-center">
          <button
            type="button"
            class="btn btn-warning"
            @click="submitForm(loginFormRef)"
          >
            登入
          </button>
        </div>
      </el-form-item>
    </el-form>

    <!-- 新增車籍資訊 -->
    <el-dialog
      v-model="loading"
      width="15%"
      title="請稍後..."
      :close-on-click-modal="false"
      :show-close="false"
    ></el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from 'js-cookie';
export default {
  components: {},
  data() {
    return {
      loading: false,
      account: "",
      password: "",
      user: {},
    };
  },
  created() {},
  computed: {},
  methods: {
    async submitForm() {
      try {
        this.loading = true; // 開始加載
        // 發送 GET 請求到指定的 API
        const postdata = {
          account: this.account,
          pwd: this.password,
        };
        const response = await axios.post(
          "http://219.85.83.15:3347/main/logIn",
          postdata
        );
        // const response = await axios.post(
        //   "/apiServer/main/logIn",
        //   postdata
        // );
        if (response.data.returnCode === 0) {
          const token = response.data.token;
          this.user = { ...response.data.data[0], token: token };
          // 儲存 token 到 Cookie，1 天後過期
          Cookies.set("login", JSON.stringify(this.user), {
            expires: 1,
          });
          if (Cookies.get("login") && token) {
            this.$router.push("/");
          }
        } else {
          this.$message({
            message: response.data.message,
            type: "error",
          });
        }
      } catch (error) {
        this.$message({
          message: "伺服器錯誤",
          type: "error",
        });
        console.error("Error fetching customer data:", error);
      } finally {
        this.loading = false; // 請求完成後關閉加載狀態
      }
    },
  },
};
</script>

<style scoped>
.el-form {
  max-width: 400px; /* 限制表單最大寬度 */
  margin: 0 auto; /* 讓表單置中 */
}
</style>
