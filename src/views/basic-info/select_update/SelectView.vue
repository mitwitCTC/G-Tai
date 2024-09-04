<template>
  <ListBar/>
  <div class="page-title">
  <h2 v-if="this.rowType === '1'">客戶基本資料查詢</h2>
  <h2 v-else-if="this.rowType === '3'">帳單資料查詢</h2>
  <h2 v-else-if="this.rowType === '6'">員工資料查詢</h2>
</div>
  <div class="page-title">
  <h5 v-if="this.rowType != '1' & this.rowType !== '6'" >
    客戶代號:<h4>{{ this.cus_code }}</h4>
    客戶名稱:<h4>{{ this.cus_name }}</h4>
  </h5>
</div>
  <div>
    <el-form :model="cus_form" label-width="155px"   style="width: 100%; min-width: 1600px;">
    <!-- 客戶基本資料 -->
    <el-form-item label="客戶基本資料" class="section-header" v-if="this.rowType==='1'">
      <el-row style="margin-bottom: 20px">
    <el-form-item label="客戶代號">
      <el-input v-model="cus_form.cus_code" readonly></el-input>
    </el-form-item>
    <el-form-item label="客戶名稱">
      <el-input v-model="cus_form.cus_name" readonly></el-input>
    </el-form-item>
    <el-form-item label="負責業務">
      <el-input v-model="cus_form.salesmanId" readonly></el-input>
    </el-form-item>
    <el-form-item label="虛擬帳號">
      <el-input v-model="cus_form.virtual_account" readonly></el-input>
    </el-form-item>
    <el-form-item label="區域">
      <el-input v-model="cus_form.region" readonly></el-input>
    </el-form-item>
    <el-form-item label="產業類別">
      <el-input v-model="cus_form.industry" readonly></el-input>
    </el-form-item>
    <el-form-item label="預估月加油量">
      <el-input v-model="cus_form.est_fuel_volume" readonly></el-input>
    </el-form-item>
    <el-form-item label="公司電話">
      <el-input v-model="cus_form.phone" readonly></el-input>
    </el-form-item>
    <el-form-item label="傳真號碼">
      <el-input v-model="cus_form.fax" readonly></el-input>
    </el-form-item>
    <el-form-item label="交易模式">
      <el-input v-model="cus_form.transaction_mode" readonly></el-input>
    </el-form-item>
    <el-form-item label="押金">
      <el-input v-model="cus_form.deposit" readonly></el-input>
    </el-form-item>
    <el-form-item label="前台密碼(@)">
      <el-input v-model="cus_form.front_pwd" readonly></el-input>
    </el-form-item>
    <el-form-item label="合約日期(起)">
      <el-input v-model="cus_form.contract_start" readonly></el-input>
    </el-form-item>
    <el-form-item label="停油寬限額度">
      <el-input v-model="cus_form.fuel_grace_limit" readonly></el-input>
    </el-form-item>
    <el-form-item label="公司統編">
      <el-input v-model="cus_form.vat_number" readonly></el-input>
    </el-form-item>
    <el-form-item label="合約日期(迄)">
      <el-input v-model="cus_form.contract_end" readonly></el-input>
    </el-form-item>
    <el-form-item label="低水位通知">
      <el-input v-model="cus_form.low_balance_notice" readonly></el-input>
    </el-form-item>
    <el-form-item label="公司抬頭">
      <el-input v-model="cus_form.company_title" readonly></el-input>
    </el-form-item>
    <el-form-item label="簽呈日期">
      <el-input v-model="cus_form.submission_date" readonly></el-input>
    </el-form-item>
    <el-form-item label="匯款日期">
      <el-input v-model="cus_form.remittance_date" readonly></el-input>
    </el-form-item>
    <el-form-item label="油價簡訊電話">
      <el-input v-model="cus_form.fuel_sms_phone" readonly></el-input>
    </el-form-item>
    <el-form-item label="油價簡訊選項">
      <el-input v-model="cus_form.fuel_sms_option" readonly></el-input>
    </el-form-item>
    <el-form-item label="餘額不足訊息電話">
      <el-input v-model="cus_form.balance_sms_phone" readonly></el-input>
    </el-form-item>
    <el-form-item label="合約狀態">
      <el-input v-model="cus_form.contract_status" readonly></el-input>
    </el-form-item>
    <el-form-item label="營登地址">
      <el-input v-model="cus_form.reg_address" readonly></el-input>
    </el-form-item>
    <el-form-item label="通訊地址">
      <el-input v-model="cus_form.mail_address" readonly></el-input>
    </el-form-item>
  </el-row>

  <!-- 製卡費&備註 -->
  <el-row style="margin-bottom: 20px">
    <el-form-item label="製卡費用">
      <el-input v-model="cus_form.card_fee" readonly></el-input>
    </el-form-item>
    <el-form-item label="再製卡費用">
      <el-input v-model="cus_form.reissue_fee" readonly></el-input>
    </el-form-item>
    <el-form-item label="製卡費備註" style="width: 1000px">
      <el-input v-model="cus_form.card_fee_notes" type="textarea" readonly></el-input>
    </el-form-item>
  </el-row>

  <!-- 備註 -->
  <el-row style="margin-bottom: 20px">
    <el-form-item label="對帳單及發票注意事項" style="width: 1000px">
      <el-input v-model="cus_form.invoice_notes" type="textarea" readonly></el-input>
    </el-form-item>
    <el-form-item label="預付及合約注意事項" style="width: 1000px">
      <el-input v-model="cus_form.con_notes" type="textarea" readonly></el-input>
    </el-form-item>
    <el-form-item label="合約備註" style="width: 1000px">
      <el-input v-model="cus_form.contract_notes" type="textarea" readonly></el-input>
    </el-form-item>
  </el-row>

  <!-- 簽約業務&備註 -->
  <el-row style="margin-bottom: 20px">
    <el-form-item label="簽約業務">
      <el-input v-model="cus_form.contract_sales" readonly></el-input>
    </el-form-item>
    <el-form-item label="業務備註" class="large-textbox">
      <el-input v-model="cus_form.sales_notes" type="textarea" readonly></el-input>
    </el-form-item>
  </el-row>

  <!-- 設定方式&備註 -->
  <el-row style="margin-bottom: 20px">
    <!-- 設定方式 (多選框) -->
    <el-form-item label="設定方式">
      <el-checkbox-group v-model="cus_form.config_method" disabled >
        <el-checkbox :value="1">銀行定存</el-checkbox>
        <el-checkbox :value="2">現金</el-checkbox>
        <el-checkbox :value="3">支票</el-checkbox>
        <el-checkbox :value="4">商業本票</el-checkbox>
        <el-checkbox :value="5">銀行保證</el-checkbox>
        <el-checkbox :value="6">無擔保</el-checkbox>
        <el-checkbox :value="7">其他</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <!-- 設定方式備註 -->
    <el-form-item label="設定方式備註" class="large-textbox">
      <el-input v-model="cus_form.config_notes" type="textarea" readonly></el-input>
    </el-form-item>
  </el-row>

  <el-form-item label="建立時間">
    <el-input v-model="cus_form.createTime" readonly></el-input>
  </el-form-item>
  <el-form-item label="修改時間">
    <el-input v-model="cus_form.updateTime" readonly></el-input>
  </el-form-item>
  </el-form-item>
    

    <!-- 聯絡人 -->
    <!-- <el-form-item label="聯絡人" class="section-header" v-if="this.rowType==='2'">
      <el-row style="margin-bottom: 20px">
        <el-form-item label="職稱">
          <el-input v-model="form.job_title1" readonly></el-input>
        </el-form-item>
        <el-form-item label="性別">
          <el-input v-model="form.gender1" readonly></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name1" readonly></el-input>
        </el-form-item>
        <el-form-item label="電話/手機">
          <el-input v-model="form.mobile1" readonly></el-input>
        </el-form-item>
        <el-form-item label="E-MAIL">
          <el-input v-model="form.email1" readonly></el-input>
        </el-form-item>
        <el-form-item label="備註">
          <el-input v-model="form.notes1" readonly></el-input>
        </el-form-item>
      </el-row>
    </el-form-item> -->

    <!-- 帳單資訊 -->
    <el-form-item label="帳單資訊" class="section-header" v-if="this.rowType==='3'">
      <el-form-item label="帳單名稱">
        <el-input v-model="bills_form.acc_name" readonly></el-input>
      </el-form-item>
      <el-form-item label="開立統編">
        <el-input v-model="bills_form.use_number" readonly></el-input>
      </el-form-item>
      <el-form-item label="發票開立人名稱">
        <el-input v-model="bills_form.invoice_name" readonly></el-input>
      </el-form-item>
      <el-form-item label="帳單寄送方式">
        <el-input v-model="bills_form.billing_method" readonly></el-input>
      </el-form-item>
      <el-form-item label="地址/E-Mail">
        <el-input v-model="bills_form.address_email" readonly></el-input>
      </el-form-item>
      <el-form-item label="對帳單列印">
        <el-input v-model="bills_form.statement_print" readonly></el-input>
      </el-form-item>
      <el-form-item label="收件人姓名">
        <el-input v-model="bills_form.recipient_name" readonly></el-input>
      </el-form-item>
      <el-form-item label="帳單聯絡人">
        <el-input v-model="bills_form.acc_contact" readonly></el-input>
      </el-form-item>
      <el-row style="margin-bottom: 20px">
        <el-form-item label="對帳單備註資訊" style="width: 1000px">
          <el-input v-model="bills_form.statement_notes" type="textarea" readonly></el-input>
        </el-form-item>
        <el-form-item label="對帳單注意事項" style="width: 1000px">
          <el-input v-model="bills_form.statement_remarks" type="textarea" readonly></el-input>
        </el-form-item>
      </el-row>
    </el-form-item>

    <!-- 折讓資料 -->
    <!-- <el-form-item label="折讓資料" class="section-header" v-if="this.rowType==='4'" >
        <el-form-item label="油品名稱">
          <el-input v-model="form.product_name" readonly></el-input>
        </el-form-item>
        <el-form-item label="廠商名稱">
          <el-input v-model="form.supplier_name" readonly></el-input>
        </el-form-item>
        <el-form-item label="折讓">
          <el-input v-model="form.discount" readonly></el-input>
        </el-form-item>
        <el-form-item label="負責業務">
          <el-input v-model="form.responsible_person" readonly></el-input>
      </el-form-item>
    </el-form-item> -->

    <!-- 車籍資料 -->
    <!-- <el-form-item label="車籍資料" class="section-header" v-if="this.rowType==='5'" >
        <el-form-item label="車牌號碼">
          <el-input v-model="form.license_plate" readonly></el-input>
        </el-form-item>
        <el-form-item label="車輛型態">
          <el-input v-model="form.vehicle_type" readonly></el-input>
        </el-form-item>
        <el-form-item label="油品名稱">
          <el-input v-model="form.product_name" readonly></el-input>
        </el-form-item>
        <el-form-item label="卡號">
          <el-input v-model="form.card_number" readonly></el-input>
      </el-form-item>
      <el-form-item label="卡片類別">
          <el-input v-model="form.card_type" readonly></el-input>
      </el-form-item>
      <el-form-item label="上傳中油時間">
          <el-input v-model="form.upload_time" readonly></el-input>
      </el-form-item>
      <el-form-item label="上傳中油原因">
          <el-input v-model="form.upload_reason" readonly></el-input>
      </el-form-item>
      <el-form-item label="到卡日期">
          <el-input v-model="form.card_arrival_date" readonly></el-input>
      </el-form-item>
      <el-form-item label="停卡日期">
          <el-input v-model="form.card_stop_date" readonly></el-input>
      </el-form-item>
      <el-form-item label="備註">
          <el-input v-model="form.notes" readonly></el-input>
      </el-form-item>
      <el-form-item label="車輛異動-因素">
          <el-input v-model="form.vehicle_change_reason" readonly></el-input>
      </el-form-item>
    </el-form-item> -->

     <!-- 員工資料 -->
     <el-form-item label="員工資料" class="section-header" v-if="this.rowType==='6'" >
        <el-form-item label="員工編號">
          <el-input v-model="rowData.employee_id" readonly></el-input>
        </el-form-item>
        <el-form-item label="員工姓名">
          <el-input v-model="rowData.employee_name"readonly ></el-input>
        </el-form-item>
        <el-form-item label="職稱">
          <el-input v-model="rowData.job_title" readonly></el-input>
      </el-form-item>
      <el-form-item label="部門代號">
          <el-input v-model="rowData.department_code" readonly></el-input>
      </el-form-item>
      <el-form-item label="部門名稱">
          <el-input v-model="rowData.department" readonly></el-input>
      </el-form-item>
      <el-row>
      <el-form-item label="更新者">
          <el-input v-model="rowData.updated" readonly></el-input>
      </el-form-item>
      <el-form-item label="建立者">
          <el-input v-model="rowData.created" readonly></el-input>
      </el-form-item>
      </el-row>
    </el-form-item>

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
    rowType: {
      type: String,
      required: true
    },
  },
data() {
  return {
    cus_form:{
      //客戶基本資料
        cus_code: '',
        cus_name: '',
        salesmanId: '',
        virtual_account: '',
        region: '',
        industry: '',
        est_fuel_volume: '',
        phone: '',
        fax: '',
        vat_number: '',
        company_title: '',
        front_pwd: '',
        contract_start: '',
        contract_end: '',
        low_balance_notice: '',
        fuel_grace_limit: '',
        reg_address: '',
        mail_address: '',
        transaction_mode: '',
        deposit: '',
        contract_notes: '',
        submission_date: '',
        remittance_date: '',
        fuel_sms_phone: '',
        fuel_sms_option: '',
        balance_sms_phone: '',
        config_method:[],
        config_notes: '',
        card_fee_notes: '',
        con_notes: '',
        invoice_notes: '',
        contract_status: '',
        contract_sales: '',
        card_fee: '',
        reissue_fee: '',
        sales_notes: '',
        createTime: '',
        updateTime: '',
    },
    bills_form:{
      // 帳單資訊欄位
        use_number: '',
        invoice_name: '',
        statement_group: '',
        billing_method: '',
        address_email: '',
        statement_print: '',
        payment_method:'',
        recipient_name: '',
        statement_notes: '',
        statement_remarks: '',
    },
    rowData:{
      //員工資料直接帶入
       employee_id:'',
        employee_name:'',
        job_title:'',
        department_code:'',
        department:'',
       updated:'',
       created:''
    }
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
          console.log("ABC"+JSON.stringify(this.bills_form));
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
    }else if(this.rowType=='6'){
      this.rowData = JSON.parse(this.$route.query.rowData);
    }
  }
};
</script>

<style scoped>
.el-input {
  width: 300px
}
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
.section-white {
  margin-top: 50px;
  font-weight: bold;
  background-color: #ffffff; /* 浅灰色背景 */

}
.large-textbox {
  width: 600px
}
.page-title  {
  margin-top: 30px;
  margin-bottom: 30px;
}
.page-title h4 {
    color: #f5bd04;
}



</style>