<template>
  <ListBar />
  <div class="page-title">
    <h2>{{ pageTitle }}</h2>
  </div>
  <div>
    <BreadCrumb />
  </div>
  <el-form :model="form" label-width="100px">
    <el-row>
      <el-form-item label="中油帳號">
        <el-select
          v-model="cpc_account"
          placeholder="選擇帳號"
          style="width: 200px"
        >
          <el-option label="TT6112060" :value="'T6112060'"></el-option>
          <el-option label="TT6112061" :value="'T6112061'"></el-option>
        </el-select>
      </el-form-item>
    </el-row>
    <el-form-item label="密碼">
      <el-input v-model="pwd" style="width: 200px"></el-input>
      <el-button type="success" @click="save" style="margin-left: 50px"
        >變更</el-button
      >
    </el-form-item>
  </el-form>
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
      cpc_account: "",
      pwd: "",
    };
  },
  created() {},
  computed: {},
  methods: {
    async save() {
      if (!this.cpc_account || !this.pwd) {
        this.$message({
          message: `欄位不得為空白`,
          type: "warning",
        });
        return
      }
      this.pwd= this.pwd.trim()
      const postData = {
        account: this.cpc_account,
        password: this.pwd,
        modification_time:""
      };
      this.isLoading = true;
      await axios
        .post("http://122.116.23.30:3347/main/updateSupplierAcc", postData)
        .then((response) => {
          this.$message({
            message: `變更成功`,
            type: "success",
          });
          (this.cpc_account = ""), (this.pwd = "");
          this.isLoading = false;
        })
        .catch((error) => {
          // 處理錯誤
          this.$message({
            message: `變更失敗`,
            type: "warning",
          });
          console.error("API request failed:", error);
          this.isLoading = false;
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
</style>
