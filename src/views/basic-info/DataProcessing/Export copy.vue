<template>
  <ListBar/>
  <div class="page-title"><h2>{{ pageTitle }}</h2></div>
  <div>
      <BreadCrumb/>
  </div>
  <el-select v-model="this.cpc_account" placeholder="選擇中油帳號" style="margin-right:20px ;" @change="filterRecorded">
            <el-option label="TT6112060" :value="'TT6112060'"></el-option>
            <el-option label="TT6112061" :value="'TT6112061'"></el-option>
  </el-select>
  <el-button @click="exportToExcel">匯出</el-button>
  <br>
  <el-button type="primary" @click="dialog=true" style="margin-top: 20px;">新增</el-button>
  <!-- <input type="file" @change="handleFileChange" /> -->
  <el-table :data="paginatedDiscount" style="width: 100%">
      <el-table-column prop="cpc_account" label="中油帳號"  width="100" />
      <el-table-column prop="customerId" label="客戶編號"  width="100" />
      <el-table-column prop="cus_name" label="客戶名稱" width="300" />
      <el-table-column prop="acc_name" label="帳單組別" width="300" />
      <el-table-column prop="license_plate" label="車號" width="150" />
      <el-table-column prop="card_number" label="卡號" width="250" />
      <!-- <el-table-column prop="discount_float" label="狀態" width="150" /> -->
      <el-table-column prop="createTime" label="異動時間"  />
    </el-table>
    <!-- 新增 -->
 <el-dialog title="新增資料" v-model="dialog" width="70%">

    <el-form :model="form" label-width="120px" > <!-- 统一標籤寬度 -->
      <el-row style="margin-bottom: 20px">
        <el-form-item label="客戶編號">
          <el-input v-model="form.cus_code" @input="getdata" maxlength="8"></el-input>
        </el-form-item>
        <el-form-item label="客戶名稱">
            <el-input v-model="form.cus_name" readonly ></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 20px">
        <el-form-item label="帳單組別">
        <el-select v-model="form.account_sortId" placeholder="選擇帳單">
          <el-option
          v-for="bill in bills"
          :key="bill.account_sortId "
          :label="bill.acc_name+'(開立統編：'+bill.use_number+')'"
          :value="bill.account_sortId "
          ></el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="車號">
            <el-input v-model="form.license_plate" @input="getVehicle"  maxlength="8"></el-input>
        </el-form-item>
        <el-form-item label="選擇狀態"v-if="this.form.state===''||this.form.state==2||this.form.state==4" >
          <el-select v-model="form.state" placeholder="選擇狀態">
            <el-option label="刪除" :value="4"></el-option>
            <el-option label="改卡號" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 20px">
        <el-form-item label="卡號" v-if="this.form.state!=1">
            <el-select v-model="form.card_number" placeholder="選擇卡號">
          <el-option
          v-for="card in cards"
          :key="card.card_relationIid "
          :label="card.card_number"
          :value="card.card_number"
          ></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="中油帳號">
          <el-select v-model="form.cpc_account" placeholder="選擇帳號">
            <el-option label="TT6112060" :value="'TT6112060'"></el-option>
            <el-option label="TT6112061" :value="'TT6112061'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="油品">
          <el-select v-model="form.product_name" placeholder="選擇油品">
            <el-option label="0001 95無鉛汽油" :value="'0001'"></el-option>
            <!-- <el-option label="0002 92無鉛汽油" :value="'0002'"></el-option>
            <el-option label="0005 98無鉛汽油" :value="'0005'"></el-option> -->
            <el-option label="0006 超級柴油" :value="'0006'"></el-option>
            <el-option label="0017 尿素溶液" :value="'0017'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="車輛異動-因素">
            <el-input v-model="form.vehicle_change_reason" ></el-input>
        </el-form-item>
        <el-form-item label="上傳中油原因">
          <el-select v-model="form.upload_reason" placeholder="選擇原因">
            <el-option label="新增" :value="'新增'"></el-option>
            <el-option label="停用" :value="'停用'"></el-option>
            <el-option label="遺失" :value="'遺失'"></el-option>
            <el-option label="故障" :value="'故障'"></el-option>
            <el-option label="其它" :value="'其它'"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-form-item label="狀態">
          <el-select v-model="form.state" placeholder="狀態" disabled=true >
            <el-option label="狀態" :value="0"></el-option>
            <el-option label="判斷結果：1.新增" :value="1"></el-option>
            <el-option label="判斷結果：2.更改卡號" :value="2"></el-option>
            <el-option label="判斷結果：3.改客戶" :value="3"></el-option>
            <el-option label="判斷結果：4.刪除卡片" :value="4"></el-option>
          </el-select>
        </el-form-item>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" @click="savePass">送出</el-button>
    </div>
    </template>
  </el-dialog>


    <div class="pagination-container">
      <div class="pagination-info">
        Showing {{ startItem }} to {{ endItem }} of {{ this.filteredRecorded.length }}
      </div>
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="this.filteredRecorded.length"
        layout="prev, pager, next, jumper"
        class="pagination"
      />
    </div>
</template>

<script>
import ListBar from '@/components/ListBar.vue';
import BreadCrumb from '@/components/BreadCrumb.vue';
import TablePaginated from '@/components/TablePaginated.vue';
import axios from 'axios';
import ExcelJS from 'exceljs';

export default {
  components: {
    BreadCrumb,
    ListBar,
    TablePaginated
  },
  data() {
    return {
      dialog:false,
      cus_code:'',
      cus_name:'',
      vehicleId:'',
      cpc_account:'',
      rowData:[],
      DiscountData: [],
      salesmenData:[],
      Vehicle:[],
      bills:[],
      cards:[],
      allVehicle:[],
      Recorded:[],
      result:[],
      filteredRecorded: [], // 篩選後的資料
      form:{
        name:'123',
        age:'456',
        address:'789',
        state:0
      },
      productMap:{
        "0001": "0001 95無鉛汽油",
        "0002": "0002 92無鉛汽油",
        "0005": "0005 98無鉛汽油",
        "0006": "0006 超級柴油",
        "0017": "0017 尿素溶液"
      },
      form:{
        customerId:'',
        discount_float:0
      },
      currentPage: 1,
      pageSize: 10
    };
  },
  created() {
    this.getRecorded()
  },
  mounted() {
    
  },
  computed: {
   
    paginatedDiscount() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredRecorded.slice(start, end);
    },
    startItem() {
      const start = (this.currentPage - 1) * this.pageSize + 1;
      return Math.min(start, this.filteredRecorded.length);
    },
    endItem() {
      const end = this.currentPage * this.pageSize;
      return Math.min(end, this.filteredRecorded.length);
    },
  },
  methods: {
    filterRecorded() {
      if (this.cpc_account) {
        this.filteredRecorded = this.Recorded.filter(item => item.cpc_account === this.cpc_account);
      } else {
        // 如果沒有選擇特定的帳號，顯示所有資料
        this.filteredRecorded = this.Recorded;
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    async getResult() {
      // date:new Date().toISOString().split('T')[0],
      const time = {
        cpc_account:this.cpc_account
      }
      try {
        const response = await axios.post('http://122.116.23.30:3345/main/generateCPCfile', time);
        this.result = response.data.data;
      } catch (error) {
        console.error("API 請求失敗：" + error);
      }
    },
    async getRecorded(){
       const response= await axios.get('http://122.116.23.30:3345/main/getRecordedVehicle')
        try{
            this.Recorded = response.data.data;  // 更新 Recorded
            this.filteredRecorded = this.Recorded;  // 設置 filteredRecorded 為 Recorded 的內容
        }
         catch(error){
          this.$message({
              message: '系統有誤',
              type: 'error'
            });
          console.error('API request failed:', error);
         } 
    },
    async getcard(){
        const postvehicleId = {
              vehicleId:this.vehicleId
        };
        const response = await axios.post('http://122.116.23.30:3345/main/searchCard',postvehicleId)
        try {
          this.cards=response.data.data
          console.log("cards"+JSON.stringify(this.cards))
        }
        catch{
          this.$message({
              message: '系統有誤',
              type: 'error'
            });
          console.error('API request failed:', error);
        }
    },
    async getPlate(){
      const postvehicleId = {
        license_plate :this.form.license_plate
      };
      const response= await axios.post('http://122.116.23.30:3345/main/searchPlate',postvehicleId)
      try{
        this.vehicleId=response.data.data[0].vehicleId
        console.log("車號ID:"+ this.vehicleId)
      }
      catch (error) {
        console.error('取得車牌ID失敗:', error);
      }
   },
    
  async getVehicle() {
  this.form.card_number = '';
  this.form.license_plate = this.form.license_plate.trim();
  
  const postData = {
    customerId: this.form.cus_code,
  };

  if (
    this.form.license_plate.length === 6 ||
    this.form.license_plate.length === 7 ||
    this.form.license_plate.length === 8
  ) {
    
    try {
      //1.先找全部車牌 有就判斷 沒就新增
      this.vehicleId='';
      let vehicleFound = false;
      this.form.state = "判斷中...";
      const response = await axios.get('http://122.116.23.30:3345/main/selectVehicle');
      this.allVehicle = response.data.data;
      for (const vehicle of this.allVehicle) {
        if (vehicle.license_plate === this.form.license_plate) {
          vehicleFound = true;
          break; // 如果找到匹配車牌，退出循環
        }
      }
      if (!vehicleFound) {
        this.form.state = 1; // 資料庫裡沒有此車號，設置狀態為 1
        console.log("資料庫沒有車號，新增" + this.form.state);
        return
      } else {
        console.log("資料庫已有車號，繼續下一步");
      }
      //有車號 就找車號ID
      await this.getPlate();
      //有ID 找卡號
      await this.getcard();
      //2.資料庫有資料 判斷現在輸入的客戶 下是否有此車 有就繼續判斷4.刪除或2.改卡號 沒有就是3.轉客戶
      const cus_response = await axios.post('http://122.116.23.30:3345/main/searchVehicle', postData);
      this.Vehicle = cus_response.data.data;
      let customerHasVehicle = false;
      for (const vehicle of this.Vehicle) {
        if (vehicle.license_plate === this.form.license_plate) {
          customerHasVehicle = true;
          break; // 客戶下有此車牌，退出循環
        }
      }
      if (!customerHasVehicle) {
        this.form.state = 3; // 客戶下沒有此車，但資料庫有，3.轉客戶
        console.log("客戶下沒有此車，但資料庫有，轉客戶：" + this.form.state);
      } else {
        this.form.state = ''; // 客戶有此車牌，判斷刪除或改卡號
        console.log("客戶下已有此車號，請選擇操作：" + this.form.state);
      }
    } catch (error) {
      this.$message({
        message: '系統有誤',
        type: 'error'
      });
      console.error('API request failed:', error);
    }
  }
},


    getdata(){
      this.form.card_number = '';
      this.form.license_plate = '';
      this.form.acc_name = '';
      this.form.state = 0;
      const postData = {
        cus_code:this.form.cus_code,
        customerId:this.form.cus_code,
      };
      this.form.cus_name=''
     if(this.form.cus_code.length==8){
      this.form.cus_name='查詢中..'
      console.log(JSON.stringify(postData))
      axios.post('http://122.116.23.30:3345/main/searchCustomer',postData)
        .then(response => {
            this.form.cus_name = response.data.data[0].cus_name;
        })
        .catch(error => {
          // 處理錯誤
            this.form.cus_name=''
            this.$message({
              message: '請確認客戶代號是否有誤',
              type: 'error'
            });
          console.error('API request failed:', error);
        });
     } 
     if(this.form.cus_name){
      axios.post('http://122.116.23.30:3345/main/searchAccount_sort',postData)
        .then(response => {
            this.bills = response.data.data;
        })
        .catch(error => {
          // 處理錯誤
            this.form.cus_name=''
            this.$message({
              message: '系統錯誤',
              type: 'error'
            });
          console.error('API request failed:', error);
        });
     }
    
  },
    handleFileChange(event) {

      // 獲取選擇的文件
      const file = event.target.files[0];
      if (file) {
        this.excelFile = file; // 保存文件對象
      }
    },
     // 匯出 Excel
     async exportToExcel() {
      if(!this.cpc_account){
        this.$message({
              message: '請先選擇中油帳號',
              type: 'error'
            });
            return
      }
          try {
            // 確保資料先完成取得
            await this.getResult();

            this.result = this.result.slice(0, 20); // 只取前20筆
            console.log("匯入20筆" + JSON.stringify(this.result)); // 檢查資料是否已更新

            // 讀取 Excel 文件
            const workbook = new ExcelJS.Workbook();
            const fr = new FileReader();
            const response = await fetch(new URL('@/assets/new.xlsx', import.meta.url).href); // 從 URL 載入模板檔案
            const data = await response.blob(); // 轉為 Blob
            fr.readAsArrayBuffer(data);

            // 當 FileReader 完成後，讀取 Excel 並進行修改
            fr.onload = async (ev) => {
              await workbook.xlsx.load(ev.target.result);
              const worksheet = workbook.worksheets[0]; // 取得第一個工作表

              let rowstitle=[];
              if(this.cpc_account=='TT6112060'){
                rowstitle=[['TT6112060_鉅泰創新股份有限公司']]
              }else if(this.cpc_account=='TT6112061'){
                rowstitle=[['TT6112061_鉅泰創新股份有限公司']]
              }else{
                rowstitle=[['']]
              }
              // 處理資料，生成每一行的數據
              const rowsData = this.result.map((data, index) => [
                index + 1, // 流水號
                data.license_plate, // 假設 vehicleId 是車牌
                data.product_name === '0006' ? 'V' : '', // 超級柴油
                data.product_name === '0001' ? 'V' : '', // 無鉛汽油
                data.product_name === '0005' ? 'V' : '', // 酒精汽油
                data.product_name === '0009' ? 'V' : '', // 不限油品
                data.product_name === '0017' ? 'V' : '', // 尿素溶液
                data.upload_reason === '新增' ? 'V' : '', // 新增
                data.upload_reason === '停用' ? 'V' : '', // 停用
                data.upload_reason === '遺失' ? 'V' : '', // 遺失
                data.upload_reason === '故障' ? 'V' : '', // 故障
                data.upload_reason === '原卡復油' ? 'V' : '', // 原卡復油
                data.customerId, // 保管單位
                data.custodian.substring(8, 12), // 公司名稱 (取第9~12個字)
                data.notes || '' // 備註
              ]);
              worksheet.addTable({
                name: 'table名稱', // 表格的名稱
                ref: 'C1', // 表格從 A4 開始
                headerRow: false, // 不需要表頭
                columns: [ { name: '標題' } ],
                rows: rowstitle // 將生成的行數據放入表格
              });
              // 添加表格，將所有行數據一次性寫入
              worksheet.addTable({
                name: 'table名稱', // 表格的名稱
                ref: 'A4', // 表格從 A4 開始
                headerRow: false, // 不需要表頭
                columns: [
                  { name: '流水號' },
                  { name: '車牌' },
                  { name: '超級柴油' },
                  { name: '無鉛汽油' },
                  { name: '酒精汽油' },
                  { name: '不限油品' },
                  { name: '尿素溶液' },
                  { name: '新增' },
                  { name: '停用' },
                  { name: '遺失' },
                  { name: '故障' },
                  { name: '原卡復油' },
                  { name: '保管單位' },
                  { name: '公司名稱' },
                  { name: '備註' }
                ],
                rows: rowsData // 將生成的行數據放入表格
              });

              // 保存到新的文件
              const newFileName = '中油製卡明細.xlsx';
              const buffer = await workbook.xlsx.writeBuffer();

              // 生成下載鏈接並觸發下載
              const blob = new Blob([buffer], { type: 'application/octet-stream' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = newFileName;
              link.click();
              
              this.$message({
                      message: '匯出成功',
                      type: 'success'
              });
              setTimeout(() => {
            // 重整網頁
            window.location.reload();
            }, 3000); // 5000 毫秒即為5秒

              this.getRecorded();
            };
          } catch (error) {
            console.error('Error during export to Excel:', error);
          }
},
    savePass() {
      this.form.customerId=this.form.cus_code
      this.form.status=this.form.state
      this.form.createTime=""
      this.form.card_create_date=""
      const postData=this.form
      axios.post('http://122.116.23.30:3345/main/recordedVehicle',postData)
        .then(response => {
          console.log(JSON.stringify(postData)); // 在請求成功後輸出請求數據
          if (response.status === 200 && response.data.returnCode === 0) {
            // 成功提示
            this.$message({
              message: '新增成功',
              type: 'success'
            });
            this.form = {};
            // 關閉對話框
            this.dialog = false;
            // 刷新數據
            this.getRecorded();
          }
        })
        .catch(error => {
          // 處理錯誤
            this.form.cus_name=''
            this.$message({
              message: '請確認客戶代號是否有誤',
              type: 'error'
            });
          console.error('API request failed:', error);
        });
    }, 
    
    handlePageChange(page) {
      this.currentPage = page;
    },

  },
 
};
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.pagination-info {
  margin-right: auto; /* 确保分页信息靠左 */
  padding-right: 900px; /* 可选: 添加右边距以与分页控件分开 */
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
.el-input {
  width: 300px
}
.el-select {
  width: 300px
}
.el-button {
  margin-right: 20px;
}

</style>
