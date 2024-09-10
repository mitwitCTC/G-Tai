<template>
  <div>
    <ListBar />
    <div class="page-title"><h2>{{ pageTitle }}</h2></div>
    <div>
      <BreadCrumb :isSpecialPage="true" />
    </div>
    <el-button type="warning" @click="dialog = true">新增卡片資訊</el-button>
    <div class="page-title"><h5>客戶代號:<h4>{{this.cus_code}}</h4>客戶名稱:<h4>{{this.cus_name}}</h4>車牌號碼:<h4>{{this.license_plate}}</h4></h5></div>
    <el-table :data="vehicles" style="width: 100%">
      <el-table-column prop="card_number" label="卡號" width="200" />
      <el-table-column prop="card_type" label="卡片類別" width="150" />
      <el-table-column prop="upload_time" label="上傳中油時間" width="150" />
      <el-table-column prop="upload_reason" label="上傳中油原因" width="150" />
      <el-table-column prop="card_arrival_date" label="到卡日期" width="150" />
      <el-table-column prop="card_stop_date" label="停卡日期" width="150" />
      <el-table-column prop="notes" label="備註" />
      <el-table-column prop="vehicle_change_reason" label="車輛異動-因素" />
      <el-table-column label="操作">
        <template v-slot="scope">
          <div class="action-icons">
            <i class="fas fa-edit " @click="editItem(scope.row)"></i>
            <i class="fa-solid fa-trash-can"  @click="deleteItem(scope.row)"></i>
          </div>
        </template>
    </el-table-column>
    </el-table>
    <div class="pagination-info">
        Showing 1 to 0 of 0
      </div>
    <!-- 新增車籍卡片資訊 -->
    <el-dialog title="新增車籍卡片資訊" v-model="dialog" width="50%">
        <el-form :model="form" label-width="120px"> <!-- 统一標籤寬度 -->
            <el-row style="margin-bottom: 20px">
            <!-- <el-form-item label="卡號">
            <el-input v-model="form.card_number" ></el-input>
            </el-form-item> -->
            <el-form-item label="卡片類別">
              <el-select v-model="form.card_type" placeholder="選擇卡片類別">
                <el-option label="1.尿素" :value="1"></el-option>
                <el-option label="2.汽油" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="上傳中油日期">
              <el-date-picker 
                v-model="form.upload_time" 
                type="date" 
                format="YYYY-MM-DD" 
                value-format="YYYY-MM-DD" 
                placeholder="選擇日期"
                style="width: 175px;">
              </el-date-picker>
            </el-form-item> -->
            <el-form-item label="上傳中油原因">
              <el-input v-model="form.upload_reason" ></el-input>
            </el-form-item>
            <!-- <el-form-item label="到卡日期">
              <el-date-picker 
                v-model="form.card_arrival_date" 
                type="date" 
                format="YYYY-MM-DD" 
                value-format="YYYY-MM-DD" 
                placeholder="選擇日期"
                style="width: 175px;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="停卡日期">
              <el-date-picker 
                v-model="form.card_stop_date" 
                type="date" 
                format="YYYY-MM-DD" 
                value-format="YYYY-MM-DD" 
                placeholder="選擇日期"
                style="width: 175px;">
              </el-date-picker>
            </el-form-item> -->
            <el-form-item label="備註">
                <el-input v-model="form.notes" ></el-input>
            </el-form-item>
            <el-form-item label="車輛異動-因素">
                <el-input v-model="form.vehicle_change_reason" ></el-input>
            </el-form-item>
          </el-row>
        </el-form>
          <template v-slot:footer>
          <div  class="dialog-footer">
            <el-button @click="dialog = false">取消</el-button>
            <el-button type="primary" @click="savePass">送出</el-button>
          </div>
        </template>
      </el-dialog>
  </div>
</template>

<script>
import ListBar from '@/components/ListBar.vue';
import BreadCrumb from '@/components/BreadCrumb.vue';
import axios from 'axios';

export default {
  components: {
    BreadCrumb,
    ListBar,
  },
  data() {
    return {
      dialog:false,
      form:{
        vehicleId:'',
        card_type:'',
        upload_reason:'',
        notes:'',
        vehicle_change_reason:'',
        createTime:''
      },
      cus_code:'',
      cus_name:'',
      vehicles: [],
      
    };
  },
  created() {
    this.cus_code=(this.$route.query.cus_code);
    this.cus_name=(this.$route.query.cus_name);
    this.license_plate=(this.$route.query.license_plate);
    this.vehicleId=(this.$route.query.vehicleId);
    this.form.vehicleId=this.vehicleId
    this.getselectData();
  },
  computed: {
   
  },
  methods: {
    savePass() {
      const req = this.form;
      // 發送 POST 請求
      axios.post('http://122.116.23.30:3345/main/createCard', req)
        .then(response => {
          console.log(JSON.stringify(req)); // 在請求成功後輸出請求數據

          if (response.status === 200 && response.data.returnCode === 0) {
            // 成功提示
            this.$message({
              message: '新增成功',
              type: 'success'
            });

            // 清空表單
            this.form.card_type = '';
            this.form.upload_reason = '';
            this.form.notes = '';
            this.form.vehicle_change_reason = '';
            // 關閉對話框
            this.dialog = false;
            // 刷新數據
            this.getselectData();
          } else {
            // 處理非 0 成功代碼
            this.$message({
              message: '新增失敗',
              type: 'error'
            });
          }
        })
        .catch(error => {
          // 發生錯誤時，顯示錯誤提示
          this.$message({
            message: '新增失敗，伺服器錯誤',
            type: 'error'
          });
          console.error('Error:', error);
        });
    },
    async getselectData() {
      const postData = {
      vehicleId:this.vehicleId,
    };
      await axios.post('http://122.116.23.30:3345/main/searchCard',postData)
        .then(response => {
          this.vehicles = response.data.data;
          console.log(this.vehicles)
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
  },
   
    editItem(row) {
      console.log('Edit item:', row);
      this.$router.push({ 
        path: 'UpdateView',
        query: {
          rowType:'7',
          cus_name:this.cus_name,
          cus_code:this.cus_code,
          license_plate:this.license_plate,
          rowData: JSON.stringify({
          ...row, // 複製原始數據
          updateTime: '' // 將 updateTime 設為空字串
          })
        }
      });
    },
    deleteItem(row) {
      console.log('Delete item:', row);
    },
  }
};
</script>

<style scoped>
.el-select {
  width: 175px
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
  gap: 10px;
  margin-bottom: 20px;
}

.filter-input {
  width: 200px;
  height: 40px;
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
