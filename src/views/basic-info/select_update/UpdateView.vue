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
</div>
<div class="page-title">
  <h5 v-if="this.rowType != '1' & this.rowType !== '6' & this.rowType !== '7'" >
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
          <el-option label="李柏青" :value="1"></el-option>
          <el-option label="陳先生" :value="2"></el-option>
          <el-option label="林先生" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="虛擬帳號">
        <el-input v-model="cus_form.virtual_account"></el-input>
      </el-form-item>
      <el-form-item label="區域">
        <el-select v-model="cus_form.region" placeholder="選擇區域">
          <el-option label="1.北、北、基、宜" :value="1"></el-option>
          <el-option label="2.中、彰、投" :value="2"></el-option>
          <el-option label="3.桃、竹、苗" :value="3"></el-option>
          <el-option label="4.雲、嘉、南" :value="4"></el-option>
          <el-option label="5.高、屏、澎" :value="5"></el-option>
          <el-option label="6.花、東" :value="6"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="產業類別">
        <el-select v-model="cus_form.industry" placeholder="選擇產業類別">
          <el-option label="食品飲料" :value="1"></el-option>
          <el-option label="營建土木工程" :value="6"></el-option>
          <el-option label="大眾運輸" :value="9"></el-option>
          <el-option label="物流倉儲" :value="11"></el-option>
          <el-option label="礦業土石" :value="12"></el-option>
          <el-option label="資訊科技" :value="13"></el-option>
          <el-option label="綜合工商" :value="19"></el-option>
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
          <el-option label="儲值" :value="1"></el-option>
          <el-option label="月結" :value="2"></el-option>
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
          <el-option label="Y" :value="Y"></el-option>
          <el-option label="N" :value="N"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="餘額不足訊息電話">
        <el-input v-model="cus_form.balance_sms_phone"></el-input>
      </el-form-item>
      <el-form-item label="合約狀態">
        <el-select v-model="cus_form.contract_status" placeholder="選擇合約狀態">
          <el-option label="啟用" :value="1"></el-option>
          <el-option label="暫停" :value="2"></el-option>
          <el-option label="終止" :value="3"></el-option>
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
          <el-option label="李柏青" :value="1"></el-option>
          <el-option label="陳先生" :value="2"></el-option>
          <el-option label="林先生" :value="3"></el-option>
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
    </el-form-item>
    

    <!-- 聯絡人 -->
    <el-form-item label="聯絡人" class="section-header" v-if="this.rowType==='2'">
      <el-row style="margin-bottom: 20px">
        <el-form-item label="職稱">
          <el-input v-model="rowData.job_title1" ></el-input>
        </el-form-item>
        <el-form-item label="性別">
          <el-select v-model="rowData.gender1" placeholder="選擇性別">
          <el-option label="男" :value="'男'"></el-option>
          <el-option label="女" :value="'女'"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="rowData.name1" ></el-input>
        </el-form-item>
        <el-form-item label="電話/手機">
          <el-input v-model="rowData.mobile1" ></el-input>
        </el-form-item>
        <el-form-item label="E-MAIL">
          <el-input v-model="rowData.email1" ></el-input>
        </el-form-item>
        <el-form-item label="備註">
          <el-input v-model="rowData.notes1" ></el-input>
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
            <el-option label="MAIL" :value="1"></el-option>
            <el-option label="平信" :value="2"></el-option>
            <el-option label="官方LINE" :value="3"></el-option>
            <el-option label="掛號" :value="4"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="地址/E-Mail">
        <el-input v-model="bills_form.address_email" ></el-input>
      </el-form-item>
      <el-form-item label="對帳單列印">
        <el-input v-model="bills_form.statement_print" ></el-input>
      </el-form-item>
      <el-form-item label="收件人姓名">
        <el-input v-model="bills_form.recipient_name" ></el-input>
      </el-form-item>
      <el-form-item label="帳單聯絡人">
        <el-input v-model="bills_form.acc_contact" ></el-input>
      </el-form-item>
      <el-row style="margin-bottom: 20px">
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
          <el-select v-model="form.product_name" placeholder="選擇油品">
            <el-option label="95無鉛汽油" :value="1"></el-option>
            <el-option label="92無鉛汽油" :value="2"></el-option>
            <el-option label="98無鉛汽油" :value="5"></el-option>
            <el-option label="超級柴油" :value="6"></el-option>
            <el-option label="尿素溶液" :value="17"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="廠商名稱" >
          <el-input v-model="form.supplier_name" readonly></el-input>
        </el-form-item>
        <el-form-item label="折讓">
          <el-input v-model="form.discount" ></el-input>
        </el-form-item>
       <!-- 確認修改按鈕 -->
    </el-form-item>
    
    

    <!-- 車籍資料 -->
    <el-form-item label="車籍資料" class="section-header" v-if="this.rowType==='5'" >
        <el-form-item label="車牌號碼">
          <el-input v-model="rowData.license_plate" ></el-input>
        </el-form-item>
        <el-form-item label="車輛型態">
          <el-select v-model="rowData.vehicle_type" placeholder="選擇車輛型態">
            <el-option label="大巴" :value="1"></el-option>
            <el-option label="中巴" :value="2"></el-option>
            <el-option label="自小客" :value="3"></el-option>
            <el-option label="油罐卡" :value="4"></el-option>
            <el-option label="臨時卡" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="油品名稱">
          <el-select v-model="rowData.product_name" placeholder="選擇油品">
            <el-option label="95無鉛汽油" :value="1"></el-option>
            <el-option label="92無鉛汽油" :value="2"></el-option>
            <el-option label="98無鉛汽油" :value="5"></el-option>
            <el-option label="超級柴油" :value="6"></el-option>
            <el-option label="尿素溶液" :value="17"></el-option>
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
        <el-form-item label="卡號">
          <el-input v-model="rowData.card_number" ></el-input>
        </el-form-item>
        <el-form-item label="卡片類別">
          <el-select v-model="rowData.card_type" placeholder="選擇卡片類別">
            <el-option label="1.尿素" :value="1"></el-option>
            <el-option label="2.汽油" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上傳中油日期">
              <el-date-picker 
                v-model="rowData.upload_time" 
                type="date" 
                format="YYYY-MM-DD" 
                value-format="YYYY-MM-DD" 
                placeholder="選擇日期"
                style="width: 300px;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="上傳中油原因">
              <el-input v-model="rowData.upload_reason" ></el-input>
            </el-form-item>
            <el-form-item label="到卡日期">
              <el-date-picker 
                v-model="rowData.card_arrival_date" 
                type="date" 
                format="YYYY-MM-DD" 
                value-format="YYYY-MM-DD" 
                placeholder="選擇日期"
                style="width: 300px;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="停卡日期">
              <el-date-picker 
                v-model="rowData.card_stop_date" 
                type="date" 
                format="YYYY-MM-DD" 
                value-format="YYYY-MM-DD" 
                placeholder="選擇日期"
                style="width: 300px;">
              </el-date-picker>
            </el-form-item>
      <el-form-item label="備註">
          <el-input v-model="rowData.notes" ></el-input>
      </el-form-item>
      <el-form-item label="車輛異動-因素">
          <el-input v-model="rowData.vehicle_change_reason" ></el-input>
      </el-form-item>
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
    rowData:{},
    cus_form: {},
    bills_form:{}
  };
},
created() {
  this.cus_code = (this.$route.query.cus_code);
  this.cus_name = (this.$route.query.cus_name);
  if (this.rowType==='1') {
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
      customerId:this.cus_code,
    };
      axios.post('http://122.116.23.30:3345/main/searchAccount_sort',postData)
        .then(response => {
          this.bills_form = response.data.data[0];
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
    }else if(this.rowType=='2'||this.rowType=='5'||this.rowType=='6'){
      this.rowData = JSON.parse(this.$route.query.rowData);
    }else if(this.rowType=='7'){
      this.license_plate = (this.$route.query.license_plate);
      this.rowData = JSON.parse(this.$route.query.rowData);
    }
  
},
};
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