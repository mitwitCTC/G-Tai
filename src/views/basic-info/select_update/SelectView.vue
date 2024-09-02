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
    <el-form :model="form" label-width="155px"   style="width: 100%; min-width: 1600px;">
    <!-- 客戶基本資料 -->
    <el-form-item label="客戶基本資料" class="section-header" v-if="this.rowType==='1'">
      <el-row style="margin-bottom: 20px">
        <el-form-item label="客戶代號">
          <el-input v-model="rowData.cus_code" readonly></el-input>
        </el-form-item>
        <el-form-item label="客戶名稱">
          <el-input v-model="rowData.cus_name" readonly></el-input>
        </el-form-item>
        <el-form-item label="負責業務">
          <el-input v-model="rowData.salesmanId" readonly></el-input>
        </el-form-item>
        <el-form-item label="虛擬帳號">
          <el-input v-model="rowData.virtual_account" readonly></el-input>
        </el-form-item>
        <el-form-item label="區域">
          <el-input v-model="rowData.region" readonly></el-input>
        </el-form-item>
        <el-form-item label="產業類別">
          <el-input v-model="rowData.industry" readonly></el-input>
        </el-form-item>
        <el-form-item label="預估月加油量">
          <el-input v-model="rowData.est_fuel_volume" readonly></el-input>
        </el-form-item>
        <el-form-item label="公司電話">
          <el-input v-model="rowData.phone" readonly></el-input>
        </el-form-item>
        <el-form-item label="傳真號碼">
          <el-input v-model="rowData.fax" readonly></el-input>
        </el-form-item>
        <el-form-item label="交易模式">
          <el-input v-model="rowData.transaction_mode" readonly></el-input>
        </el-form-item>
        <el-form-item label="押金">
          <el-input v-model="rowData.deposit" readonly></el-input>
        </el-form-item>
        <el-form-item label="前台密碼(@)">
          <el-input v-model="rowData.front_pwd" readonly></el-input>
        </el-form-item>
        <el-form-item label="合約日期(起)">
          <el-input v-model="rowData.contract_start" readonly></el-input>
        </el-form-item>
        <el-form-item label="停油寬限額度">
          <el-input v-model="rowData.fuel_grace_limit" readonly></el-input>
        </el-form-item>
        <el-form-item label="公司統編">
          <el-input v-model="rowData.vat_number" readonly></el-input>
        </el-form-item>
        <el-form-item label="合約日期(迄)">
          <el-input v-model="rowData.contract_end" readonly></el-input>
        </el-form-item>
        <el-form-item label="低水位通知">
          <el-input v-model="rowData.low_balance_notice" readonly></el-input>
        </el-form-item>
        <el-form-item label="公司抬頭">
          <el-input v-model="rowData.company_title" readonly></el-input>
        </el-form-item>
        <el-form-item label="簽呈日期">
          <el-input v-model="rowData.submission_date" readonly></el-input>
        </el-form-item>
        <el-form-item label="匯款日期">
          <el-input v-model="rowData.remittance_date" readonly></el-input>
        </el-form-item>
        <el-form-item label="油價簡訊電話">
          <el-input v-model="rowData.fuel_sms_phone" readonly></el-input>
        </el-form-item>
        <el-form-item label="油價簡訊選項">
          <el-input v-model="rowData.fuel_sms_option" readonly></el-input>
        </el-form-item>
        <el-form-item label="餘額不足訊息電話">
          <el-input v-model="rowData.balance_sms_phone" readonly></el-input>
        </el-form-item>
        <el-form-item label="合約狀態">
          <el-input v-model="rowData.contract_status" readonly></el-input>
        </el-form-item>
        <el-form-item label="營登地址" >
          <el-input v-model="rowData.reg_address" readonly></el-input>
        </el-form-item>
        <el-form-item label="通訊地址" >
        <el-input v-model="rowData.mail_address" readonly></el-input>
        </el-form-item>
      </el-row> 
    
      <!-- 製卡費&備註 -->
      <el-row style="margin-bottom: 20px">
        <el-form-item label="製卡費用">
          <el-input v-model="rowData.card_fee" readonly></el-input>
        </el-form-item>
        <el-form-item label="再製卡費用">
          <el-input v-model="rowData.reissue_fee" readonly></el-input>
        </el-form-item>
        <el-form-item label="製卡費備註" style="width: 1000px">
          <el-input v-model="rowData.card_fee_notes" type="textarea" readonly></el-input>
        </el-form-item>
      </el-row>
      <!-- 備註 -->
      <el-row style="margin-bottom: 20px">
        <el-form-item label="對帳單及發票注意事項" style="width: 1000px">
          <el-input v-model="rowData.invoice_notes" type="textarea" readonly></el-input>
        </el-form-item>
        <el-form-item label="預付及合約注意事項" style="width: 1000px">
          <el-input v-model="rowData.con_notes" type="textarea" readonly></el-input>
        </el-form-item>
        <el-form-item label="合約備註" style="width: 1000px">
          <el-input v-model="rowData.contract_notes" type="textarea" readonly></el-input>
        </el-form-item>
      </el-row>
      <!-- 簽約業務&備註 -->
     <el-row style="margin-bottom: 20px">
      <el-form-item label="簽約業務">
        <el-input v-model="rowData.contract_sales" readonly></el-input>
      </el-form-item>
      <el-form-item label="業務備註" class="large-textbox">
        <el-input v-model="rowData.sales_notes" type="textarea" readonly></el-input>
      </el-form-item>
    </el-row>
      <!-- 設定方式&備註 -->
    <el-row style="margin-bottom: 20px">
      <!-- 設定方式 (多選框) -->
      <el-form-item label="設定方式">
        <el-checkbox-group v-model="rowData.config_method" disabled>
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
      <el-input v-model="rowData.config_notes" type="textarea" readonly></el-input>
    </el-form-item>
  </el-row>
  <el-form-item label="建立時間">
    <el-input v-model="rowData.createTime" readonly></el-input>
  </el-form-item>
  <el-form-item label="修改時間">
    <el-input v-model="rowData.updateTime" readonly></el-input>
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
        <el-input v-model="form.account_sortId" readonly></el-input>
      </el-form-item>
      <el-form-item label="開立統編">
        <el-input v-model="form.use_number" readonly></el-input>
      </el-form-item>
      <el-form-item label="發票開立人名稱">
        <el-input v-model="form.invoice_name" readonly></el-input>
      </el-form-item>
      <el-form-item label="帳單寄送方式">
        <el-input v-model="form.billing_method" readonly></el-input>
      </el-form-item>
      <el-form-item label="地址/E-Mail">
        <el-input v-model="form.address_email" readonly></el-input>
      </el-form-item>
      <el-form-item label="對帳單列印">
        <el-input v-model="form.statement_print" readonly></el-input>
      </el-form-item>
      <el-form-item label="收件人姓名">
        <el-input v-model="form.recipient_name" readonly></el-input>
      </el-form-item>
      <el-form-item label="帳單聯絡人">
        <el-input v-model="form.recipient_name" readonly></el-input>
      </el-form-item>
      <el-row style="margin-bottom: 20px">
        <el-form-item label="對帳單備註資訊" style="width: 1000px">
          <el-input v-model="form.statement_notes" type="textarea" readonly></el-input>
        </el-form-item>
        <el-form-item label="對帳單注意事項" style="width: 1000px">
          <el-input v-model="form.statement_remarks" type="textarea" readonly></el-input>
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
    rowData:{},
    form: {
        cus_code: 'G2200696',
        cus_name: this.customerName,
        salesmanId: '李柏青',
        virtual_account: '123456789',
        region: '北、北、基、宜',
        industry: '大眾運輸',
        est_fuel_volume: '5000',
        phone: '06-266-1349',
        fax: '02-2503-1200',
        vat_number: '81155355',
        company_title: '整樹貨運股份有限公司',
        front_pwd: 'Lw81155355G2200696',
        contract_start: '2024/8/1',
        contract_end: '2027/7/31',
        low_balance_notice: '100000',
        fuel_grace_limit: '50000',
        reg_address: '屏東縣內埔鄉振豐村新南路14號1樓',
        mail_address: '717台南市仁德區中正西路1011巷122號',
        transaction_mode: '1.儲值',
        deposit: '80000',
        contract_notes: '91083134甫漾物流通運有限公司所屬車籍開91083134甫漾物流通運有限公司',
        submission_date: '2024/8/1',
        remittance_date: '2024/8/1',
        fuel_sms_phone: '0971111222',
        fuel_sms_option: 'Y',
        balance_sms_phone: '0913-776-083',
        config_method: [1, 2],
        config_notes: '111/12月製卡費為業務自行吸收(扣抵獎金)',
        card_fee_notes: '111/12月製卡費為業務自行吸收(扣抵獎金)',
        con_notes: '每個禮拜一傳負數到LINE群(不要天天傳)',
        invoice_notes: 'LINE包含EXCEL表',
        contract_status: '暫停',
        contract_sales: '李柏青',
        card_fee: '100',
        reissue_fee: '100',
        sales_notes: '111/9/1起原業務李蔚生改為魯孝亜。',
        createTime: '2024/04/10',
        updateTime: '2024/04/10',
        // 聯絡人欄位
        job_title1: '承辦',
        gender1: '女',
        name1: '謝小姐',
        mobile1: '0913-776-083',
        email1: 's-y-1979@hotmail.com',
        notes1: '有兩支手機',
        job_title2: '會計',
        gender2: '女',
        name2: '陳羽芯',
        mobile2: '0913-776-083',
        email2: 'annie88022821@gmail.com',
        notes2: '公司電話#812',
        // 帳單資訊欄位
        use_number: 'A12345678',
        invoice_name: '台灣叮叮巴士股份有限公司',
        statement_group: 'A',
        billing_method: '官方LINE',
        address_email: '717台南市仁德區中正西路1011巷122號',
        statement_print: 'YES',
        payment_method:'月結30日',
        recipient_name: '汪宗毅',
        statement_notes: '',
        statement_remarks: '',
        // 折讓資料欄位
        product_name: '0001 95無鉛汽油',
        supplier_name: '台灣中油股份有限公司',
        discount: '1.5',
        responsible_person: '魯孝亜',
        // 車籍資料欄位
        license_plate:'ACC-1234',
        vehicle_type:'中巴',
        product_name:' 0001 95無鉛汽油',
        card_number:'#121611200607123495',
        card_type:'尿素',
        upload_time:'2023/11/15',
        upload_reason:'2023/11/15',
        card_arrival_date:'2023/11/10',
        card_stop_date:'2023/11/10',
        notes:'台灣叮叮巴士股份有限公司',
        vehicle_change_reason:'更換油品',
         //員工
         record_id:'123',
        employee_id:'GF-012',
        employee_name:'湯惠誠',
        job_title:'業務',
        department_code:'C01',
        department:'業務部',
        updated:'柏青',
        created:'柏青'
      },
  };
},
created() {
  this.rowData = JSON.parse(this.$route.query.rowData);
  this.cus_code = (this.$route.query.cus_code);
  this.cus_name = (this.$route.query.cus_name);
},
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