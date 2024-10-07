<template>
  <ListBar/>
  <div class="page-title">
  <h2 v-if="this.rowType === '1'">客戶基本資料編輯</h2>
  <h2 v-else-if="this.rowType === '2'">聯絡人資料編輯</h2>
  <h2 v-else-if="this.rowType === '3'">帳單資料編輯</h2>
  <h2 v-else-if="this.rowType === '4'">折讓資料編輯</h2>
  <h2 v-else-if="this.rowType === '5'">車籍資料編輯</h2>
  <h2 v-else-if="this.rowType === '6'">員工資料編輯</h2>
  <h2 v-else-if="this.rowType === '7'">卡片資料編輯</h2>
  <h2 v-else-if="this.rowType === '9'">永豐資料編輯</h2>
</div>
<div class="page-title">
  <h5 v-if="this.rowType != '1' & this.rowType !== '6' & this.rowType !== '7'& this.rowType !== '9'"  >
    客戶代號:<h4>{{ this.cus_code }}</h4>
    客戶名稱:<h4>{{ this.cus_name }}</h4>
  </h5>
</div>
<div class="page-title">
  <h5 v-if="this.rowType ==='7'" >
    客戶代號:<h4>{{ this.cus_code }}</h4>
    客戶名稱:<h4>{{ this.cus_name }}</h4>
    車牌號碼:<h4>{{this.license_plate}}</h4>
  </h5>
</div>
  <div>
    <el-form :model="form" label-width="155px"   style="width: 100%; min-width: 1600px;">
    <!-- 客戶基本資料 -->
    <el-form-item label="客戶基本資料" class="section-header" v-if="this.rowType==='1'">
    <el-row style="margin-bottom: 20px">
      <el-form-item label="客戶代號">
        <el-input v-model="cus_form.cus_code"></el-input>
      </el-form-item>
      <el-form-item label="客戶名稱">
        <el-input v-model="cus_form.cus_name"></el-input>
      </el-form-item>
      <el-form-item label="負責業務">
        <el-select v-model="cus_form.salesmanId" placeholder="選擇業務">
          <el-option
          v-for="salesman in salesmenData"
          :key="salesman.employee_id"
          :label="salesman.employee_name"
          :value="salesman.employee_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="虛擬帳號">
        <el-input v-model="cus_form.virtual_account"></el-input>
      </el-form-item> -->
      <el-form-item label="區域">
        <el-select v-model="cus_form.region" placeholder="選擇區域">
          <el-option label="1.北、北、基、宜" :value="'1'"></el-option>
          <el-option label="2.中、彰、投" :value="'2'"></el-option>
          <el-option label="3.桃、竹、苗" :value="'3'"></el-option>
          <el-option label="4.雲、嘉、南" :value="'4'"></el-option>
          <el-option label="5.高、屏、澎" :value="'5'"></el-option>
          <el-option label="6.花、東" :value="'6'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="產業類別">
        <el-select v-model="cus_form.industry" placeholder="選擇產業類別">
          <el-option label="1.食品飲料" :value="1"></el-option>
          <el-option label="6.營建土木工程" :value="6"></el-option>
          <el-option label="9.大眾運輸" :value="9"></el-option>
          <el-option label="11.物流倉儲" :value="11"></el-option>
          <el-option label="12.礦業土石" :value="12"></el-option>
          <el-option label="13.資訊科技" :value="13"></el-option>
          <el-option label="19.綜合工商" :value="19"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="預估月加油量">
        <el-input v-model="cus_form.est_fuel_volume"></el-input>
      </el-form-item>
      <el-form-item label="公司電話">
        <el-input v-model="cus_form.phone"></el-input>
      </el-form-item>
      <el-form-item label="傳真號碼">
        <el-input v-model="cus_form.fax"></el-input>
      </el-form-item>
      <el-form-item label="交易模式">
        <el-select v-model="cus_form.transaction_mode" placeholder="選擇交易模式">
          <el-option label="1.儲值" :value="'1'"></el-option>
          <el-option label="2.月結" :value="'2'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="押金">
        <el-input v-model="cus_form.deposit"></el-input>
      </el-form-item>
      <el-form-item label="前台密碼(@)">
        <el-input v-model="cus_form.front_pwd"></el-input>
      </el-form-item>
      <el-form-item label="合約日期(起)">
        <el-date-picker
          v-model="cus_form.contract_start"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="選擇日期"
          style="width: 300px;">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="停油寬限額度">
        <el-input v-model="cus_form.fuel_grace_limit"></el-input>
      </el-form-item>
      <el-form-item label="公司統編">
        <el-input v-model="cus_form.vat_number"></el-input>
      </el-form-item>
      <el-form-item label="合約日期(迄)">
        <el-date-picker
          v-model="cus_form.contract_end"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="選擇日期"
          style="width: 300px;">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="低水位通知">
        <el-input v-model="cus_form.low_balance_notice"></el-input>
      </el-form-item>
      <el-form-item label="公司抬頭">
        <el-input v-model="cus_form.company_title"></el-input>
      </el-form-item>
      <el-form-item label="簽呈日期">
        <el-date-picker
          v-model="cus_form.submission_date"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="選擇日期"
          style="width: 300px;">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="匯款日期">
        <el-date-picker
          v-model="cus_form.remittance_date"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="選擇日期"
          style="width: 300px;">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="油價簡訊電話">
        <el-input v-model="cus_form.fuel_sms_phone"></el-input>
      </el-form-item>
      <el-form-item label="油價簡訊選項">
        <el-select v-model="cus_form.fuel_sms_option" placeholder="選擇交易模式">
          <el-option label="Y" :value="'Y'"></el-option>
          <el-option label="N" :value="'N'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="餘額不足訊息電話">
        <el-input v-model="cus_form.balance_sms_phone"></el-input>
      </el-form-item>
      <el-form-item label="合約狀態">
        <el-select v-model="cus_form.contract_status" placeholder="選擇合約狀態">
          <el-option label="啟用" :value="'N'"></el-option>
          <el-option label="暫停" :value="'S'"></el-option>
          <el-option label="終止" :value="'Y'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="營登地址">
        <el-input v-model="cus_form.reg_address"></el-input>
      </el-form-item>
      <el-form-item label="通訊地址">
        <el-input v-model="cus_form.mail_address"></el-input>
      </el-form-item>
    </el-row>
  
    <!-- 製卡費&備註 -->
    <el-row style="margin-bottom: 20px">
      <el-form-item label="製卡費用">
        <el-input v-model="cus_form.card_fee"></el-input>
      </el-form-item>
      <el-form-item label="再製卡費用">
        <el-input v-model="cus_form.reissue_fee"></el-input>
      </el-form-item>
      <el-form-item label="製卡費備註" style="width: 1000px">
        <el-input v-model="cus_form.card_fee_notes" type="textarea"></el-input>
      </el-form-item>
    </el-row>
    <!-- 備註 -->
    <el-row style="margin-bottom: 20px">
      <el-form-item label="對帳單及發票注意事項" style="width: 1000px">
        <el-input v-model="cus_form.invoice_notes" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="預付及合約注意事項" style="width: 1000px">
        <el-input v-model="cus_form.con_notes" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="合約備註" style="width: 1000px">
        <el-input v-model="cus_form.contract_notes" type="textarea"></el-input>
      </el-form-item>
    </el-row>
    <!-- 簽約業務&備註 -->
    <el-row style="margin-bottom: 20px">
      <el-form-item label="簽約業務">
        <el-select v-model="cus_form.contract_sales" placeholder="選擇業務">
          <el-option
          v-for="salesman in salesmenData"
          :key="salesman.employee_id"
          :label="salesman.employee_name"
          :value="salesman.employee_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="業務備註" class="large-textbox">
        <el-input v-model="cus_form.sales_notes" type="textarea"></el-input>
      </el-form-item>
    </el-row>
    <!-- 設定方式&備註 -->
    <el-row style="margin-bottom: 20px">
      <!-- 設定方式 (多選框) -->
      <el-form-item label="設定方式">
        <el-checkbox-group v-model="cus_form.config_method">
          <el-checkbox :label="1">銀行定存</el-checkbox>
          <el-checkbox :label="2">現金</el-checkbox>
          <el-checkbox :label="3">支票</el-checkbox>
          <el-checkbox :label="4">商業本票</el-checkbox>
          <el-checkbox :label="5">銀行保證</el-checkbox>
          <el-checkbox :label="6">無擔保</el-checkbox>
          <el-checkbox :label="7">其他</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!-- 設定方式備註 -->
      <el-form-item label="設定方式備註" class="large-textbox">
        <el-input v-model="cus_form.config_notes" type="textarea"></el-input>
      </el-form-item>
    </el-row>
    <!-- 信用卡收取手續費 -->
    <el-row style="margin-bottom: 20px">
    <el-form-item label="信用卡手續費收取">
          <el-select v-model="cus_form.card_other_fee" placeholder="選擇是否收取">
            <el-option label="0.不收取" :value="'0'"></el-option>
            <el-option label="1.另外收取" :value="'1'"></el-option>
          </el-select>
        </el-form-item>
    <!-- <el-form-item label="信用卡手續費%數">
      <el-input v-model="cus_form.card_handling" ></el-input>
    </el-form-item> -->
    </el-row>
    </el-form-item>
    

    <!-- 聯絡人 -->
    <el-form-item label="聯絡人" class="section-header" v-if="this.rowType==='2'">
      <el-row style="margin-bottom: 20px">
        <el-form-item label="職稱">
          <el-input v-model="rowData.job_title" ></el-input>
        </el-form-item>
        <el-form-item label="性別">
          <el-select v-model="rowData.gender" placeholder="選擇性別">
          <el-option label="男" :value="'男'"></el-option>
          <el-option label="女" :value="'女'"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="rowData.name" ></el-input>
        </el-form-item>
        <el-form-item label="電話/手機">
          <el-input v-model="rowData.mobile" ></el-input>
        </el-form-item>
        <el-form-item label="E-MAIL">
          <el-input v-model="rowData.mail" ></el-input>
        </el-form-item>
        <el-form-item label="備註">
          <el-input v-model="rowData.notes" ></el-input>
        </el-form-item>
      </el-row>
    </el-form-item>

    <!-- 帳單資訊 -->
    <el-form-item label="帳單資訊" class="section-header" v-if="this.rowType==='3'">
      <el-form-item label="帳單名稱">
        <el-input v-model="bills_form.acc_name" ></el-input>
      </el-form-item>
      <el-form-item label="開立統編">
        <el-input v-model="bills_form.use_number" ></el-input>
      </el-form-item>
      <el-form-item label="發票開立人名稱">
        <el-input v-model="bills_form.invoice_name" ></el-input>
      </el-form-item>
      <el-form-item label="帳單寄送方式">
          <el-select v-model="bills_form.billing_method" placeholder="選擇方式">
            <el-option label="0.不需要" :value="'0'"></el-option>
            <el-option label="1.MAIL" :value="'1'"></el-option>
            <el-option label="2.平信" :value="'2'"></el-option>
            <el-option label="3.官方LINE" :value="'3'"></el-option>
            <el-option label="4.掛號" :value="'4'"></el-option>
            <el-option label="5.合併寄" :value="'5'"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="對帳單列印">
        <el-select v-model="bills_form.statement_print" placeholder="選擇方式">
            <el-option label="YES" :value="'YES'"></el-option>
            <el-option label="NO" :value="'NO'"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="收件人姓名">
        <el-input v-model="bills_form.recipient_name" ></el-input>
      </el-form-item>
      <el-form-item label="帳單聯絡人">
        <el-input v-model="bills_form.acc_contact" ></el-input>
      </el-form-item>
      <el-row style="margin-bottom: 20px">
        <el-form-item label="地址/E-Mail" style="width: 1000px" >
        <el-input v-model="bills_form.address_email" type="textarea" ></el-input>
      </el-form-item>
        <el-form-item label="對帳單備註資訊" style="width: 1000px">
          <el-input v-model="bills_form.statement_notes" type="textarea" ></el-input>
        </el-form-item>
        <el-form-item label="對帳單注意事項" style="width: 1000px">
          <el-input v-model="bills_form.statement_remarks" type="textarea" ></el-input>
        </el-form-item>
      </el-row>
    </el-form-item>

    <!-- 折讓資料 -->
    <el-form-item label="折讓資料" class="section-header" v-if="this.rowType==='4'" >
      <el-form-item label="油品">
          <el-select v-model="rowData.product_name" placeholder="選擇油品">
            <el-option label="0001 95無鉛汽油" :value="'0001'"></el-option>
            <el-option label="0002 92無鉛汽油" :value="'0002'"></el-option>
            <el-option label="0005 98無鉛汽油" :value="'0005'"></el-option>
            <el-option label="0006 超級柴油" :value="'0006'"></el-option>
            <el-option label="0017 尿素溶液" :value="'0017'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="廠商名稱" >
          <el-input v-model="rowData.supplier_name" readonly></el-input>
        </el-form-item>
        <el-form-item label="折讓">
          <el-input v-model="rowData.discount_float" ></el-input>
        </el-form-item>
        <el-form-item label="負責業務">
        <el-select v-model="rowData.responsible_person" placeholder="選擇業務">
          <el-option
          v-for="salesman in salesmenData"
          :key="salesman.employee_id"
          :label="salesman.employee_name"
          :value="salesman.employee_id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form-item>
    
    

    <!-- 車籍資料 -->
    <el-form-item label="車籍資料" class="section-header" v-if="this.rowType==='5'" >
      <el-form-item label="帳單編號">
          <el-select v-model="rowData.account_sortId" placeholder="選擇帳單編號">
            <el-option
              v-for="id in bills_form"
              :key="id.account_sortId"
              :label="id.account_sortId"
              :value="id.account_sortId"
          ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="車牌號碼">
          <el-input v-model="rowData.license_plate" ></el-input>
        </el-form-item>
        <el-form-item label="車輛型態">
          <el-select v-model="rowData.vehicle_type" placeholder="選擇車輛型態">
            <el-option label="大巴" :value="'1'"></el-option>
            <el-option label="中巴" :value="'2'"></el-option>
            <el-option label="自小客" :value="'3'"></el-option>
            <el-option label="油罐卡" :value="'4'"></el-option>
            <el-option label="臨時卡" :value="'5'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="油品名稱">
          <el-select v-model="rowData.product_name" placeholder="選擇油品">
            <el-option label="0001 95無鉛汽油" :value="'0001'"></el-option>
            <el-option label="0002 92無鉛汽油" :value="'0002'"></el-option>
            <el-option label="0005 98無鉛汽油" :value="'0005'"></el-option>
            <el-option label="0006 超級柴油" :value="'0006'"></el-option>
            <el-option label="0017 尿素溶液" :value="'0017'"></el-option>
          </el-select>
      </el-form-item>
    </el-form-item>

    <!-- 員工資料 -->
    <el-form-item label="員工資料" class="section-header" v-if="this.rowType==='6'" >
        <el-form-item label="員工編號">
          <el-input v-model="rowData.employee_id" ></el-input>
        </el-form-item>
        <el-form-item label="員工姓名">
          <el-input v-model="rowData.employee_name" ></el-input>
        </el-form-item>
        <el-form-item label="職稱">
          <el-input v-model="rowData.job_title" ></el-input>
      </el-form-item>
      <el-form-item label="部門代號">
          <el-input v-model="rowData.department_code" ></el-input>
      </el-form-item>
      <el-form-item label="部門名稱">
          <el-input v-model="rowData.department" ></el-input>
      </el-form-item>
    </el-form-item>
  <!-- 卡片資料 -->
  <el-form-item label="車籍卡片資料" class="section-header" v-if="this.rowType==='7'" >
        <el-form-item label="卡片類別">
          <el-select v-model="rowData.card_type" placeholder="選擇卡片類別">
            <el-option label="1.尿素" :value="'1'"></el-option>
            <el-option label="2.汽油" :value="'2'"></el-option>
          </el-select>
        </el-form-item>
            <el-form-item label="上傳中油原因">
              <el-input v-model="rowData.upload_reason" ></el-input>
            </el-form-item>
      <el-form-item label="備註">
          <el-input v-model="rowData.notes" ></el-input>
      </el-form-item>
      <el-form-item label="車輛異動-因素">
          <el-input v-model="rowData.vehicle_change_reason" ></el-input>
      </el-form-item>
    </el-form-item>
    <!-- 永豐資料 -->
  <el-form-item label="永豐資料" class="section-header" v-if="this.rowType==='9'" >
    <el-row style="margin-bottom: 20px">
            <el-form-item label="收款單號">
            <el-input v-model="SinopacBank.invoice" readonly ></el-input>
          </el-form-item>
          <el-form-item label="客戶代號">
             <el-input v-model="this.cus_code"readonly ></el-input>
          </el-form-item>
          <el-form-item label="客戶名稱">
            <el-input v-model="SinopacBank.cus_name" readonly ></el-input>
          </el-form-item>
          <el-form-item label="刷卡日期">
              <el-date-picker 
                v-model="SinopacBank.credit_card_data" 
                type="date" 
                format="YYYY-MM-DD" 
                value-format="YYYY-MM-DD" 
                placeholder="選擇日期"
                style="width: 300px;">
              </el-date-picker>
            </el-form-item>
          <el-form-item label="發卡銀行">
            <el-input v-model="SinopacBank.issuing_bank" ></el-input>
          </el-form-item>
          <el-form-item label="授權碼">
            <el-input v-model="SinopacBank.remark" ></el-input>
          </el-form-item>
          <el-form-item label="刷卡金額">
            <el-input v-model="SinopacBank.credit_amount" ></el-input>
          </el-form-item>
          <!-- <el-form-item label="手續費收取">
            <el-input v-model="SinopacBank.card_other_fee" readonly ></el-input>
          </el-form-item> -->
          <el-form-item label="永豐手續費%">
            <el-input v-model="SinopacBank.credit_percent" readonly ></el-input>
          </el-form-item>
          <el-form-item label="永豐手續費">
            <el-input v-model="SinopacBank.handling_fee" readonly ></el-input>
          </el-form-item>
            <el-form-item label="永豐入帳金額">
            <el-input v-model="SinopacBank.bank_amount" ></el-input>
          </el-form-item>
          <el-form-item label="永豐入帳日期">
              <el-date-picker 
                v-model="SinopacBank.account_date" 
                type="date" 
                format="YYYY-MM-DD" 
                value-format="YYYY-MM-DD" 
                placeholder="選擇日期"
                style="width: 300px;">
              </el-date-picker>
            </el-form-item>
          <!--           
          <el-form-item label="系統手續費%">
            <el-input v-model="SinopacBank.card_handling" readonly ></el-input>
          </el-form-item> -->
          <el-form-item label="系統入帳金額">
            <el-input v-model="SinopacBank.amount" readonly ></el-input>
          </el-form-item>
          </el-row>
    </el-form-item>
    <el-button type="primary" @click="onConfirmEdit">確認修改</el-button>
    <el-form-item label="" class="section-white" >
  </el-form-item>
  </el-form>
  </div>
</template>

<script>
import ListBar from '@/components/ListBar.vue'
import axios from 'axios';

export default {
  components: {
    ListBar
  },
  props: {
    customerName: {
      type: String,
      required: true
    },
    rowType: {
      type: String,
      required: true
    },
  },
data() {
  return {
    
    cus_code:'',
    cus_name:'',
    license_plate:'',
    rowData:{
      updateTime:''
    },
    cus_form: {
      
    },
    SinopacBank:{},
    bills_form:{},
    salesmenData:[],
    discount_form:[],
  };
},
mounted() {
    // // 在頁面加載時發送 API 請求
    // axios.get('http://122.116.23.30:3345/main/selectSalesman')
    //   .then(response => {
    //     this.salesmenData = response.data.data; // 將 API 回傳的數據存入 salesmenData
    //     if (this.cus_form.contract_sales || this.cus_form.salesmanId) {
    //       // 找到對應的業務名稱
    //       const selectedSalesman = this.salesmenData.find(salesman => salesman.employee_id === this.cus_form.salesmanId);
    //       const selectedcontractman = this.salesmenData.find(salesman => salesman.employee_id === this.cus_form.contract_sales);
    //       // 如果找到匹配的業務代號，設置為對應的 ID，這樣會顯示名稱
    //       if (selectedSalesman||selectedcontractman) {
    //         this.cus_form.salesmanId=selectedSalesman.employee_name;
    //         this.cus_form.contract_sales = selectedcontractman.employee_name;
    //       }
    //     }
    //   })
    //   .catch(error => {
    //     console.error('API request failed:', error);
    //   });
  },
created() {
  this.cus_code = (this.$route.query.cus_code);
  this.cus_name = (this.$route.query.cus_name);
  this.account_sortId  = (this.$route.query.account_sortId );
  if (this.rowType==='1') {
    axios.get('http://122.116.23.30:3345/main/selectSalesman')
      .then(response => {
        this.salesmenData = response.data.data;
      })
      .catch(error => {
        console.error('API request failed:', error);
      });
      const postData = {
        cus_code:this.cus_code,
      };
      axios.post('http://122.116.23.30:3345/main/searchCustomer',postData)
        .then(response => {
          this.cus_form = response.data.data[0];
          if (this.cus_form.config_method) {
          if (typeof this.cus_form.config_method === 'string') {
            // 将 "1,2" 转换为 [1, 2]
            this.cus_form.config_method = this.cus_form.config_method.split(',').map(Number);
          }
        } else {
        // 如果 config_method 是 null 或 undefined，则设置为空数组
        this.cus_form.config_method = [];
        }
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
    }else if(this.rowType==='3'){
      const postData = {
          account_sortId :this.account_sortId,
      };
      axios.post('http://122.116.23.30:3345/main/viewAccount_sort',postData)
        .then(response => {
          this.bills_form = response.data.data[0];
          console.log("個別帳單"+JSON.stringify(this.bills_form))
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
    }else if(this.rowType==='4'){
      axios.get('http://122.116.23.30:3345/main/selectSalesman')
      .then(response => {
        this.salesmenData = response.data.data;
      })
      .catch(error => {
        console.error('API request failed:', error);
      });
      this.rowData = JSON.parse(this.$route.query.rowData);
    }else if(this.rowType=='5'){
      const postData = {
      customerId:this.cus_code,
    };
      axios.post('http://122.116.23.30:3345/main/searchAccount_sort',postData)
        .then(response => {
          this.bills_form = response.data.data;
            console.log("帳單一覽"+JSON.stringify(this.bills_form))
            this.rowData = JSON.parse(this.$route.query.rowData)
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
    }else if(this.rowType=='2'||this.rowType=='6'){
      this.rowData = JSON.parse(this.$route.query.rowData);
    }else if(this.rowType=='7'){
      this.license_plate = (this.$route.query.license_plate);
      this.rowData = JSON.parse(this.$route.query.rowData);
    }
  },
  methods:{
    handleSalesmanChange(newValue) {
      // Check if the new value is different from the old one
      console.log("newValue"+newValue)
      if (newValue == '') {
        // If no value selected, delete salesmanId
        delete this.cus_form.salesmanId;
      }
    },
    getEmployeeName(employeeId) {
      // 如果 salesmenData 仍為空，則返回空或其他提示
      if (!this.salesmenData || this.salesmenData.length === 0) {
        return '正在加載...';
      }
      // 使用 find 方法找到對應的 employee_name
      const employee = this.salesmenData.find(item => item.employee_id === employeeId);
      return employee ? employee.employee_name : '未知員工'; // 找到返回名字，找不到返回 "未知員工"
    },

    onConfirmEdit(){
      if (this.rowType==='1') {
      console.log("發送客戶修改API")
      this.cus_form.updateTime='';
      const req = this.cus_form;
      axios.post('http://122.116.23.30:3345/main/updateCustomer', req)
        .then(response => {
          console.log(JSON.stringify(req)); // 在請求成功後輸出請求數據
          if (response.status === 200 && response.data.returnCode == 0) {
            // 成功提示
            this.$message({
              message: '更新成功',
              type: 'success'
            });
            // 刷新數據
            setTimeout(() => {
            window.location.reload();
            }, 2000); // 3000 毫秒 = 3 秒

          } else {
            // 處理非 0 成功代碼
            this.$message({
              message: '更新失敗',
              type: 'error'
            });
          }
        })
        .catch(error => {
          // 發生錯誤時，顯示錯誤提示
          this.$message({
            message: ' 更新失敗，伺服器錯誤',
            type: 'error'
          });
          console.error('Error:', error);
        });
    }else if(this.rowType==='3'){
      console.log("發送客戶帳單API")
      this.bills_form.updateTime='';
      const req = this.bills_form;
      axios.post('http://122.116.23.30:3345/main/updateAccount_sort', req)
        .then(response => {
          console.log(JSON.stringify(req)); // 在請求成功後輸出請求數據
          if (response.status === 200 && response.data.returnCode == 0) {
            // 成功提示
            this.$message({
              message: '更新成功',
              type: 'success'
            });
            // 刷新數據
            setTimeout(() => {
            window.location.reload();
            }, 2000); // 3000 毫秒 = 3 秒

          } else {
            // 處理非 0 成功代碼
            this.$message({
              message: '更新失敗',
              type: 'error'
            });
          }
        })
        .catch(error => {
          // 發生錯誤時，顯示錯誤提示
          this.$message({
            message: ' 更新失敗，伺服器錯誤',
            type: 'error'
          });
          console.error('Error:', error);
        });

    }else if(this.rowType==='4'){
      console.log("發送客戶折讓API")
      const req = this.rowData;
      axios.post('http://122.116.23.30:3345/main/updateDiscount', req)
        .then(response => {
          console.log(JSON.stringify(req)); // 在請求成功後輸出請求數據
          if (response.status === 200 && response.data.returnCode == 0) {
            // 成功提示
            this.$message({
              message: '更新成功',
              type: 'success'
            });
            // 刷新數據
            setTimeout(() => {
              window.history.back();
            }, 2000); // 3000 毫秒 = 3 秒

          } else {
            // 處理非 0 成功代碼
            this.$message({
              message: '更新失敗',
              type: 'error'
            });
          }
        })
        .catch(error => {
          // 發生錯誤時，顯示錯誤提示
          this.$message({
            message: ' 更新失敗，伺服器錯誤',
            type: 'error'
          });
          console.error('Error:', error);
        });
    }else if(this.rowType==='5'){
      console.log("發送客戶車籍API")
      this.rowData.license_plate = this.rowData.license_plate.trim();
      const req = this.rowData;
      axios.post('http://122.116.23.30:3345/main/updateVehicle', req)
        .then(response => {
          console.log(JSON.stringify(req)); // 在請求成功後輸出請求數據
          if (response.status === 200 && response.data.returnCode == 0) {
            // 成功提示
            this.$message({
              message: '更新成功',
              type: 'success'
            });
            // 刷新數據
            setTimeout(() => {
              window.history.back();
            }, 2000); // 3000 毫秒 = 3 秒

          } else {
            // 處理非 0 成功代碼
            this.$message({
              message: '更新失敗',
              type: 'error'
            });
          }
        })
        .catch(error => {
          // 發生錯誤時，顯示錯誤提示
          this.$message({
            message: ' 更新失敗，伺服器錯誤',
            type: 'error'
          });
          console.error('Error:', error);
        });
      }else if(this.rowType==='7'){
      console.log("發送客戶車籍卡片API")
      const req = this.rowData;
      axios.post('http://122.116.23.30:3345/main/updateCard', req)
        .then(response => {
          console.log(JSON.stringify(req)); // 在請求成功後輸出請求數據
          if (response.status === 200 && response.data.returnCode == 0) {
            // 成功提示
            this.$message({
              message: '更新成功',
              type: 'success'
            });
            // 刷新數據
            setTimeout(() => {
              window.history.back();
            }, 2000); // 3000 毫秒 = 3 秒

          } else {
            // 處理非 0 成功代碼
            this.$message({
              message: '更新失敗',
              type: 'error'
            });
          }
        })
        .catch(error => {
          // 發生錯誤時，顯示錯誤提示
          this.$message({
            message: ' 更新失敗，伺服器錯誤',
            type: 'error'
          });
          console.error('Error:', error);
        });
      }else if(this.rowType==='2'){
      console.log("發送客戶聯絡人API")
      const req = this.rowData;
      axios.post('http://122.116.23.30:3345/main/updateContact', req)
        .then(response => {
          console.log(JSON.stringify(req)); // 在請求成功後輸出請求數據
          if (response.status === 200 && response.data.returnCode == 0) {
            // 成功提示
            this.$message({
              message: '更新成功',
              type: 'success'
            });
            // 刷新數據
            setTimeout(() => {
              window.history.back();
            }, 2000); // 3000 毫秒 = 3 秒

          } else {
            // 處理非 0 成功代碼
            this.$message({
              message: '更新失敗',
              type: 'error'
            });
          }
        })
        .catch(error => {
          // 發生錯誤時，顯示錯誤提示
          this.$message({
            message: ' 更新失敗，伺服器錯誤',
            type: 'error'
          });
          console.error('Error:', error);
        });
      }else if(this.rowType==='6'){
      console.log("發送員工API")
      const req = this.rowData;
      axios.post('http://122.116.23.30:3345/main/updateSalesman', req)
        .then(response => {
          console.log(JSON.stringify(req)); // 在請求成功後輸出請求數據
          if (response.status === 200 && response.data.returnCode == 0) {
            // 成功提示
            this.$message({
              message: '更新成功',
              type: 'success'
            });
            // 刷新數據
            setTimeout(() => {
              window.history.back();
            }, 2000); // 3000 毫秒 = 3 秒

          } else {
            // 處理非 0 成功代碼
            this.$message({
              message: '更新失敗',
              type: 'error'
            });
          }
        })
        .catch(error => {
          // 發生錯誤時，顯示錯誤提示
          this.$message({
            message: ' 更新失敗，伺服器錯誤',
            type: 'error'
          });
          console.error('Error:', error);
        });
      }
    },
  }
}
</script>

<style scoped>
.el-input {
  width: 300px
}
.el-select {
  width: 300px
}

.page-title {
  margin-top: 30px; 
  margin-bottom: 30px; 
  }
  .section-header {
  margin-top: 50px;
  font-weight: bold;
  background-color: #fde07f; /* 浅灰色背景 */
  border-radius: 10px; /* 圆角 */
  padding: 10px; /* 内边距 */
  margin-bottom: 10px; /* 项目之间的间距 */

}
.section-white {
  margin-top: 50px;
  font-weight: bold;
  background-color: #ffffff; /* 浅灰色背景 */

}
.large-textbox {
  width: 600px
}
.page-title {
  margin-top: 30px;
  margin-bottom: 30px;
}
.page-title h4 {
    color: #f5bd04;
}


</style>