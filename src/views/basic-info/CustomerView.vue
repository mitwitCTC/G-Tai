<template>
  <div>
    <ListBar/>
    <div class="page-title"><h2>{{ pageTitle }}</h2></div>
    <div>
      <BreadCrumb :isSpecialPage="true"/>
    </div>
    
    <div>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="客戶名稱/客戶代號/統編" v-if="!search.customerV">
          <el-input v-model="search.customerName" placeholder="輸入客戶名稱/客戶代號/統編/" style="width: 225px;"></el-input>
        </el-form-item>
        <el-form-item label="車牌" v-if="!search.customerName">
          <el-input v-model="search.customerV" placeholder="輸入車牌" style="width: 225px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="dialog = true" v-if="!search.customerV">新增客戶</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click=searchV(1) v-if="search.customerV">尋找</el-button>
        </el-form-item>
        <el-form-item>
          <el-button  @click=searchV(0) v-if="search.customerV">清除</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="paginatedData" style="width: 100%" v-loading="loading">
        <!-- <el-table-column prop="cus_code" label="客戶代號" width="100"></el-table-column>
        <el-table-column prop="cus_name" label="客戶名稱" width="250"></el-table-column> -->
        <el-table-column prop="cus_code" label="客戶代號" width="100">
          <template v-slot="scope">
            <span @click="viewDetails(scope.row)" style="cursor: pointer; color: blue;">
              {{ scope.row.cus_code }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="cus_name" label="客戶名稱" width="250">
          <template v-slot="scope">
            <span @click="viewDetails(scope.row)" style="cursor: pointer; color: blue;">
              {{ scope.row.cus_name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="vat_number" label="統編" width="150"></el-table-column>
        <el-table-column prop="front_pwd" label="密碼"  width="200"></el-table-column>
        <el-table-column prop="submission_date" label="簽呈日期"  width="175"></el-table-column>
        <el-table-column prop="month_gas" label="當月用油公升" width="125"></el-table-column>
        <el-table-column prop="month_balance" label="當月餘額金額" width="125"></el-table-column>
        <!-- <el-table-column prop="region" label="區域" :formatter="formatRegion" width="150"></el-table-column>
        <el-table-column prop="industry" label="產業類別" :formatter="formatIndustry" width="150"></el-table-column>
        <el-table-column prop="est_fuel_volume" label="預估月加油量" width="150"></el-table-column>
        <el-table-column prop="phone" label="公司電話" width="200"></el-table-column> -->
        <!-- 操作列 -->
    <el-table-column label="操作">
      <template v-slot="scope">
        <div class="action-icons">
          <!-- <i class="fas fa-eye " @click="viewDetails(scope.row)"></i> -->
          <i class="fas fa-edit " @click="editItem(scope.row)"></i>
          <i class="fa-solid fa-trash-can"  @click="deleteItem(scope.row)"></i>
          <el-button type="primary" @click="onContact(scope.row)">聯絡人</el-button>
          <el-button type="success" @click="onBill(scope.row)">帳單</el-button>
          <el-button type="danger" @click="onDiscount(scope.row)">折讓</el-button>
        </div>
      </template>
    </el-table-column>

      </el-table>

      <div class="pagination-container">
      <div class="pagination-info">
        Showing {{ startItem }} to {{ endItem }} of {{ filteredData.length }}
      </div>
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="filteredData.length"
        layout="prev, pager, next, jumper"
        class="pagination"
      />
    </div>
    


 <!-- 新增客戶 -->
 <el-dialog title="新增客戶" v-model="dialog" width="80%" :close-on-click-modal="false">
  <h6>*為必填欄位</h6>
    <el-form :model="form" label-width="155px"> <!-- 统一标签宽度 -->
      <el-row style="margin-bottom: 20px">
        <el-form-item label="*客戶代號">
          <el-input v-model="form.cus_code" maxlength=8></el-input>
        </el-form-item>
        <el-form-item label="*客戶名稱">
          <el-input v-model="form.cus_name" ></el-input>
        </el-form-item>
        <el-form-item label="負責業務">
          <el-select v-model="form.salesmanId" placeholder="選擇業務">
            <el-option
          v-for="salesman in salesmenData"
          :key="salesman.salesmanId"
          :label="salesman.employee_name"
          :value="salesman.employee_id"
          ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="虛擬帳號">
          <el-input v-model="form.virtual_account" ></el-input>
        </el-form-item> -->
        <el-form-item label="區域">
          <el-select v-model="form.region" placeholder="選擇區域">
            <el-option label="1.北、北、基、宜" :value="1"></el-option>
            <el-option label="2.中、彰、投" :value="2"></el-option>
            <el-option label="3.桃、竹、苗" :value="3"></el-option>
            <el-option label="4.雲、嘉、南" :value="4"></el-option>
            <el-option label="5.高、屏、澎" :value="5"></el-option>
            <el-option label="6.花、東" :value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="產業類別">
          <el-select v-model="form.industry" placeholder="選擇產業類別">
            <el-option label="1.食品飲料" :value="1"></el-option>
            <el-option label="2.傢飾傢俱家電" :value="2"></el-option>
            <el-option label="3.石油化學" :value="3"></el-option>
            <el-option label="4.五金製造" :value="4"></el-option>
            <el-option label="5.電力機械" :value="5"></el-option>
            <el-option label="6.營建土木工程" :value="6"></el-option>
            <el-option label="7.紙業製造" :value="7"></el-option>
            <el-option label="8.金屬製造" :value="8"></el-option>
            <el-option label="9.大眾運輸" :value="9"></el-option>
            <el-option label="10橡膠塑膠" :value="10"></el-option>
            <el-option label="11.物流倉儲" :value="11"></el-option>
            <el-option label="12.物流倉儲" :value="12"></el-option>
            <el-option label="13.資訊科技" :value="13"></el-option>
            <el-option label="14.環境衛生" :value="14"></el-option>
            <el-option label="15.傳播類" :value="15"></el-option>
            <el-option label="16.生技醫療" :value="16"></el-option>
            <el-option label="17.電子科技" :value="17"></el-option>
            <el-option label="18.食品飲料" :value="18"></el-option>
            <el-option label="19.綜合工商" :value="19"></el-option>
            <el-option label="20.汽機車買賣維修" :value="20"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="預估月加油量">
          <el-input v-model="form.est_fuel_volume" ></el-input>
        </el-form-item>
        <el-form-item label="公司電話">
          <el-input v-model="form.phone" ></el-input>
        </el-form-item>
        <el-form-item label="傳真號碼">
          <el-input v-model="form.fax" ></el-input>
        </el-form-item>
        <el-form-item label="交易模式">
          <el-select v-model="form.transaction_mode" placeholder="選擇交易模式">
            <el-option label="儲值" :value="1"></el-option>
            <el-option label="月結" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="押金">
          <el-input v-model="form.deposit" ></el-input>
        </el-form-item>
        <el-form-item label="前台密碼(@)">
          <el-input v-model="form.front_pwd" ></el-input>
        </el-form-item>
        <el-form-item label="合約日期(起)">
          <el-date-picker 
          v-model="form.contract_start" 
          type="date" 
          format="YYYY-MM-DD" 
          value-format="YYYY-MM-DD" 
          placeholder="選擇日期"
          style="width: 300px;">
        </el-date-picker>
        </el-form-item>
        <el-form-item label="停油寬限額度" v-if="this.form.transaction_mode==1">
          <el-input v-model="form.fuel_grace_limit" ></el-input>
        </el-form-item>
        <el-form-item label="*公司統編">
          <el-input v-model="form.vat_number" maxlength=10 ></el-input>
        </el-form-item>
        <el-form-item label="合約日期(迄)">
          <el-date-picker 
          v-model="form.contract_end" 
          type="date" 
          format="YYYY-MM-DD" 
          value-format="YYYY-MM-DD" 
          placeholder="選擇日期"
          style="width: 300px;">
        </el-date-picker>
        </el-form-item>
        <el-form-item label="低水位通知" v-if="this.form.transaction_mode==1">
          <el-input v-model="form.low_balance_notice" ></el-input>
        </el-form-item>
        <el-form-item label="公司抬頭">
          <el-input v-model="form.company_title" ></el-input>
        </el-form-item>
        <el-form-item label="簽呈日期">
          <el-date-picker 
          v-model="form.submission_date" 
          type="date" 
          format="YYYY-MM-DD" 
          value-format="YYYY-MM-DD" 
          placeholder="選擇日期"
          style="width: 300px;">
        </el-date-picker>
        </el-form-item>
        <el-form-item label="匯款日期" v-if="this.form.transaction_mode==2">
          <el-date-picker 
          v-model="form.remittance_date" 
          type="date" 
          format="YYYY-MM-DD" 
          value-format="YYYY-MM-DD" 
          placeholder="選擇日期"
          style="width: 300px;">
        </el-date-picker>
        </el-form-item>
        <el-form-item label="油價簡訊電話">
          <el-input v-model="form.fuel_sms_phone" ></el-input>
        </el-form-item>
        <el-form-item label="油價簡訊選項">
          <el-select v-model="form.fuel_sms_option" placeholder="選擇模式">
            <el-option label="Y" :value="'Y'"></el-option>
            <el-option label="N" :value="'N'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="餘額不足訊息電話" v-if="this.form.transaction_mode==1">
          <el-input v-model="form.balance_sms_phone" ></el-input>
        </el-form-item>
        <el-form-item label="合約狀態">
          <el-select v-model="form.contract_status" placeholder="選擇合約狀態">
            <el-option label="未解約" :value="'N'"></el-option>
            <el-option label="暫停" :value="'S'"></el-option>
            <el-option label="解約" :value="'Y'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="營登地址" >
          <el-input v-model="form.reg_address" ></el-input>
        </el-form-item>
        <el-form-item label="通訊地址" >
        <el-input v-model="form.mail_address" ></el-input>
        </el-form-item>
      </el-row> 
    
      <!-- 製卡費&備註 -->
      <el-row style="margin-bottom: 20px">
        <el-form-item label="製卡費用">
          <el-input v-model="form.card_fee" ></el-input>
        </el-form-item>
        <el-form-item label="再製卡費用">
          <el-input v-model="form.reissue_fee" ></el-input>
        </el-form-item>
        <el-form-item label="製卡費備註" style="width: 1000px">
          <el-input v-model="form.card_fee_notes" type="textarea" ></el-input>
        </el-form-item>
      </el-row>
      <!-- 備註 -->
      <el-row style="margin-bottom: 20px">
        <el-form-item label="對帳單及發票注意事項" style="width: 1000px">
          <el-input v-model="form.invoice_notes" type="textarea" ></el-input>
        </el-form-item>
        <el-form-item label="預付及合約注意事項" style="width: 1000px">
          <el-input v-model="form.con_notes" type="textarea" ></el-input>
        </el-form-item>
        <el-form-item label="合約備註" style="width: 1000px">
          <el-input v-model="form.contract_notes" type="textarea" ></el-input>
        </el-form-item>
      </el-row>
      <!-- 簽約業務&備註 -->
     <el-row style="margin-bottom: 20px">
      <el-form-item label="簽約業務">
          <el-select v-model="form.contract_sales" placeholder="選擇業務">
            <el-option
          v-for="salesman in salesmenData"
          :key="salesman.salesmanId"
          :label="salesman.employee_name"
          :value="salesman.employee_id"
          ></el-option>
          </el-select>
        </el-form-item>
      <el-form-item label="業務備註" class="large-textbox">
        <el-input v-model="form.sales_notes" type="textarea" ></el-input>
      </el-form-item>
    </el-row>
    
      <!-- <el-form-item label="設定方式">
        <el-checkbox-group v-model="form.config_method" >
          <el-checkbox :label="1">銀行定存</el-checkbox>
          <el-checkbox :label="2">現金</el-checkbox>
          <el-checkbox :label="3">支票</el-checkbox>
          <el-checkbox :label="4">商業本票</el-checkbox>
          <el-checkbox :label="5">銀行保證</el-checkbox>
          <el-checkbox :label="6">無擔保</el-checkbox>
          <el-checkbox :label="7">其他</el-checkbox>
        </el-checkbox-group>
    </el-form-item>  -->
    <!-- 設定方式備註 -->
     <!-- <el-form-item label="設定方式備註" class="large-textbox">
      <el-input v-model="form.config_notes" type="textarea" ></el-input>
    </el-form-item> -->
     <!-- 信用卡收取手續費 -->
     <el-row style="margin-bottom: 20px">
    <el-form-item label="信用卡手續費收取">
          <el-select v-model="form.card_other_fee" placeholder="選擇是否收取">
            <el-option label="0.不收取" :value="'0'"></el-option>
            <el-option label="1.另外收取" :value="'1'"></el-option>
          </el-select>
        </el-form-item>
    <!-- <el-form-item label="信用卡手續費%數">
      <el-input v-model="form.card_handling" ></el-input>
    </el-form-item> -->
    </el-row>
    <el-form-item label="設定方式" class="section-header" v-if="this.form.transaction_mode==2" >
      <el-form-item label="銀行定存" >
          <el-input v-model="form.one" ></el-input>
      </el-form-item>
      <el-form-item label="現金" >
          <el-input v-model="form.two" ></el-input>
      </el-form-item>
      <el-form-item label="支票" >
          <el-input v-model="form.three" ></el-input>
      </el-form-item>
      <el-form-item label="商業本票" >
          <el-input v-model="form.four" ></el-input>
      </el-form-item>
      <el-form-item label="銀行保證" >
          <el-input v-model="form.five" ></el-input>
      </el-form-item>
      <el-form-item label="無擔保" >
          <el-input v-model="form.six" ></el-input>
      </el-form-item>
      <el-form-item label="其它" >
          <el-input v-model="form.seven" ></el-input>
      </el-form-item>
    </el-form-item>
   
    </el-form>
    <!-- <template v-slot:footer>
    <div  class="dialog-footer">
      <el-button @click="dialog = false">取消</el-button>
      <el-button type="primary" @click="savePass">送出</el-button>
    </div>
</template> -->
<div class="dialog-footer">
  <el-button @click="dialog = false">取消</el-button>
  <el-button type="primary" @click="savePass()">送出</el-button>
</div>
  </el-dialog>

    </div>
  </div>
</template>

<script>
import ListBar from '@/components/ListBar.vue'
import BreadCrumb from '@/components/BreadCrumb.vue';
import TablePaginated from '@/components/TablePaginated.vue';
import axios from 'axios';
import { toRaw } from 'vue'; // 引入 `toRaw` 函數
// import SelectDialog from '@/components/SelectDialog.vue';
export default {
  components: {
    BreadCrumb,
    ListBar,
    TablePaginated,
    
  },
  data() {
    return {
      loading: false,  // 加載狀態
      dialog: false,
      search: {
        customerName: '',
        customerV:''
      },
      customers:[],
      customers2:[],
      industryMap: {
        '1': '食品飲料',
        '2': '傢飾傢俱家電',
        '3': '石油化學',
        '4': '五金製造',
        '5': '電力機械',
        '6': '營建土木工程',
        '7': '紙業製造',
        '8': '金屬製造',
        '9': '大眾運輸',
        '10': '橡膠塑膠',
        '11': '物流倉儲',
        '12': '礦業土石',
        '13': '資訊科技',
        '14': '文教類',
        '15': '傳播類',
        '16': '環境衛生',
        '17': '生技醫療',
        '18': '電子科技',
        '19': '綜合工商',
        '20': '汽機車買賣維修',
      } ,// 產業類別對應的映射
      regionMap: {
        '1': '北、北、基、宜',
        '2': '中、彰、投',
        '3': '桃、竹、苗',
        '4': '雲、嘉、南',
        '5': '高、屏、澎',
        '6': '花、東'
      } ,// 區域對應的映射
      form: {
        createTime:'',
        cus_code:'',
        cus_name:'',
        one: '',   // 銀行定存
        two: '',   // 現金
        three: '', // 支票
        four: '',  // 商業本票
        five: '',  // 銀行保證
        six: '',   // 無擔保
        seven: ''  // 其它
      },
      salesmenData:[],
      Vehicle:[],
      Vehicle2:[],
      currentPage: 1,
      pageSize: 10
    };
  },
  created() {
    this.getselectData();
    this.getVehicle();
  },
  computed: {

    
    // 計算當前頁面顯示的起始和結束項目
    startItem() {
      const start = (this.currentPage - 1) * this.pageSize + 1;
      return Math.min(start, this.customers2.length);
    },
    endItem() {
      const end = this.currentPage * this.pageSize;
      return Math.min(end, this.customers2.length);
    },
     // 過濾搜尋後的資料
     filteredData() {
      const searchTerm = this.search.customerName.trim().toLowerCase();

      return this.customers2.filter(item => {
        const cusCode = item.cus_code ? item.cus_code.toLowerCase() : '';
        const cusName = item.cus_name ? item.cus_name.toLowerCase() : '';
        const vatNumber = item.vat_number ? item.vat_number.toLowerCase() : '';

        return (
          cusCode.includes(searchTerm) ||
          cusName.includes(searchTerm) ||
          vatNumber.includes(searchTerm)
        );
      });
    },
    // 處理分頁資料
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredData.slice(start, end);
    }
  },
  methods: {
    searchV(type){
      if(type==0){
        this.getselectData();
        this.search.customerV=''
      }else if(type==1){
        this.Vehicle2 = this.Vehicle.filter(vehicle => vehicle.license_plate === this.search.customerV);
        const vehicleCustomerIds = this.Vehicle2.map(vehicle => vehicle.customerId);
        // 过滤 this.customers，保留那些 cus_code 存在于 vehicleCustomerIds 数组中的项
        this.customers2 = this.customers.filter(customer => vehicleCustomerIds.includes(customer.cus_code));
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    formatIndustry(industry) {
      const rawIndustry = toRaw(industry);
      return this.industryMap[rawIndustry.industry.toString()] || '未知';
    },
    formatRegion(region) {
      const rawregion = toRaw(region);
      return this.regionMap[rawregion.region.toString()] || '未知';
    },
    async getselectData() {
    try {
      this.loading = true;  // 開始加載
        // 發送 GET 請求到指定的 API
        const response = await axios.get('http://122.116.23.30:3345/main/selectCustomer');
        const customerData = response.data.data; 
        // 將資料放入 customers 陣列中
        this.customers=customerData;
        this.customers2=this.customers
    } catch (error) {
        console.error('Error fetching customer data:', error);
    } finally {
        this.loading = false;  // 請求完成後關閉加載狀態
      }
  },
  async getVehicle() {
    try {
        // 發送 GET 請求到指定的 API
        const response = await axios.get('http://122.116.23.30:3345/main/selectVehicle');
        this.Vehicle= response.data.data;;
    } catch (error) {
        console.error('Error fetching customer data:', error);
    } 
  },
  savePass() {
    
    if(!this.form.config_method){
      this.form.config_method=[0]
    }

    if(this.form.transaction_mode==2){
      this.form.config_notes = `銀行定存: ${this.form.one ? this.form.one : '0'}, 現金: ${this.form.two ? this.form.two : '0'}, 支票: ${this.form.three ? this.form.three : '0'}, 商業本票: ${this.form.four ? this.form.four : '0'}, 銀行保證: ${this.form.five ? this.form.five : '0'}, 無擔保: ${this.form.six ? this.form.six : '0'}, 其它: ${this.form.seven ? this.form.seven : '0'}`;
    }else{
      this.form.config_notes=''
    }

    if(this.form.createTime){
      this.form.createTime = this.form.createTime.trim();
    }
      this.form.cus_name = this.form.cus_name.trim();
      this.form.cus_code = this.form.cus_code.trim();
      const req = this.form;
      if(!req.cus_code||!req.cus_name||!req.vat_number){
        this.$message({
              message: '必填欄位不可為空',
              type: 'error'
            });
        return
      }
      console.log("req"+JSON.stringify(req))
      axios.post('http://122.116.23.30:3345/main/createCustomer', req)
        .then(response => {
          if (response.status === 200 && response.data.returnCode === 0) {
            // 成功提示
            this.$message({
              message: '新增成功',
              type: 'success'
            });
            this.form = {};
            this.dialog = false
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
    viewDetails(row) {
      this.$router.push({ 
        path: 'SelectView',
        query: {
          rowType:'1',
          cus_code:row.cus_code
        }
      });
    },
    editItem(row) {
      console.log('Edit item:', row);
      this.$router.push({ 
        path: 'UpdateView',
        query: {
          rowType:'1',
          cus_code:row.cus_code
        }
      });
    },
    async deleteItem(row) {
      const result = confirm("您確定要刪除此項目嗎？此操作無法恢復。");
      if (result) {
      console.log('Delete item:', row);
      const req = {
        customerId:row.customerId,
        updated:'',
        deleteTime:''
      };
      console.log('Delete item:', req);
      await axios.post('http://122.116.23.30:3345/main/deleteCustomer', req)
        .then(response => {
          if (response.status === 200 && response.data.returnCode === 0) {
            // 成功提示
            this.$message({
              message: '刪除成功',
              type: 'success'
            });
            this.getselectData();
          } else {
            // 處理非 0 成功代碼
            this.$message({
              message: '刪除失敗',
              type: 'error'
            });
          }
        })
        .catch(error => {
          // 發生錯誤時，顯示錯誤提示
          this.$message({
            message: '刪除失敗，伺服器錯誤',
            type: 'error'
          });
          console.error('Error:', error);
        });
      }
    },
    onContact(row) {
      console.log('View details for:', row);
      this.$router.push({ 
        path: 'contact',
        query: {
          cus_code:row.cus_code,
          cus_name:row.cus_name
        }
      });
    },
    onBill(row) {
      console.log('View details for:', row);
      this.$router.push({ 
        path: 'bill',
        query: {
          cus_code:row.cus_code,
          cus_name:row.cus_name,
        }
      });
    },
    
    onDiscount(row) {
      console.log('View details for:', row);
      this.$router.push({ 
        path: 'discount',
        query: {
          cus_code:row.cus_code,
          cus_name:row.cus_name
        }
      });
    },
  },
  mounted() {
    // 在頁面加載時發送 API 請求
      axios.get('http://122.116.23.30:3345/main/selectSalesman')
      .then(response => {
        this.salesmenData = response.data.data; // 將 API 回傳的數據存入 salesmenData
      })
      .catch(error => {
        console.error('API request failed:', error);
      });
  },
};
</script>

<style scoped>
.demo-form-inline {
  margin-bottom: 20px;
}
.custom-select {
  width: 200px; /* 调整宽度 */
  height: 40px; /* 调整高度 */
}
.page-title {
  margin-top: 30px;
  margin-bottom: 30px;
}
.el-input {
  width: 300px
}
.el-select {
  width: 300px
}
.large-textbox {
  width: 600px
}
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.pagination-info {
  margin-right: auto; /* 确保分页信息靠左 */
  padding-right: 890px; /* 可选: 添加右边距以与分页控件分开 */
  white-space: nowrap;
}
.pagination {
  flex: 1;
  text-align: right;
}
.action-icons {
  display: flex;
  gap: 20px; /* 调整图标之间的间距 */
}

.action-icons i {
  cursor: pointer;
  font-size: 20px; /* 调整图标的大小 */
}
h6 {
  color: rgb(255, 0, 0);
  margin-left: 20px;
  }

</style>