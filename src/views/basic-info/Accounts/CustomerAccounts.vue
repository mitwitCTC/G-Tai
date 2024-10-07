<template>
  <ListBar/>
  <div class="page-title"><h2>{{ pageTitle }}</h2></div>
  <div>
      <BreadCrumb/>
  </div>
  <div> 
      <el-form-item label="結轉日">
          <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="選擇日期"
          :disabled-date="DateBeforeToday"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="width: 300px; margin-right:20px;">
        </el-date-picker>
        <el-button  type="danger" @click=dialog>查詢</el-button>
      </el-form-item>
    </div>
  <el-form-item label="核銷狀態" class="section-header" >
  <el-table :data="writeoff" style="width: 100%">
  <el-table-column prop="T6112060" label="T6112060(OIL加油)" width="350" />
  <el-table-column prop="T6112060_OTR" label="T6112060(OTR其他類)" width="350" />
  <el-table-column prop="BBB" label="台企" width="350" />
  <el-table-column prop="NNN" label="諾瓦"  />
</el-table>
</el-form-item>
<el-form-item label="中油" class="section-header" >
  <el-table :data="writeoff" style="width: 100%">
  <el-table-column prop="T6112060" label="客代" width="100" />
  <el-table-column prop="T6112060_OTR" label="車牌" width="100" />
  <el-table-column prop="BBB" label="交易時間" width="150" />
  <el-table-column prop="NNN" label="結轉日" width="150" />
  <el-table-column prop="NNN" label="油品類型" width="100" />
  <el-table-column prop="NNN" label="加油站"  width="150"/>
  <el-table-column prop="NNN" label="卡號"  width="250"/>
  <el-table-column prop="NNN" label="油量" width="100" />
  <el-table-column prop="NNN" label="參考單價"  width="100"/>
  <el-table-column prop="NNN" label="參考金額" width="100" />
  <el-table-column label="操作">
  <template v-slot="scope">
  <el-button type="primary" @click="onContact(scope.row)">核銷</el-button>
  </template>
</el-table-column>
</el-table>
</el-form-item>
<el-form-item label="儲值" class="section-header" >
  <el-table :data="writeoff" style="width: 100%">
  <el-table-column prop="T6112060" label="客代" width="350" />
  <el-table-column prop="T6112060_OTR" label="入帳來源" width="350" />
  <el-table-column prop="BBB" label="虛擬帳號" width="350" />
  <el-table-column prop="NNN" label="交易時間"  />
  <el-table-column prop="NNN" label="正確帳號"  />
  <el-table-column prop="NNN" label="不核銷原因"  />
  <el-table-column label="操作">
  <template v-slot="scope">
  <el-button type="primary" @click="onContact(scope.row)">核銷</el-button>
  </template>
</el-table-column>
</el-table>
</el-form-item>
</template>

<script>
import ListBar from '@/components/ListBar.vue'
import BreadCrumb from '@/components/BreadCrumb.vue';
export default {
  components: {
    BreadCrumb,
    ListBar
  },
data() {
  return {
    selectedDate: null ,
    writeoff: [
      {
        T6112060: "1筆",
        T6112060_OTR: "5筆",
        BBB: "8筆",
        NNN: "10筆"
      }
    ]
  };
},
  methods:{
    DateBeforeToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // 將時間設置為當天午夜
      return date.getTime() > today.getTime(); // 禁用今天以後的日期
    },
  }
}
</script>

<style scoped>
.page-title {
  margin-top: 30px; 
  margin-bottom: 30px; 
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