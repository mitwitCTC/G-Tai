<template>
  <ListBar/>
  <div class="page-title"><h2>{{ pageTitle }}</h2></div>
  <div>
    <span>商家帳號：{{ customerName }}</span>
    <el-form :model="form" label-width="155px"   style="width: 100%; min-width: 1600px;">
    <!-- 客戶基本資料 -->
    <el-form-item label="客戶基本資料" class="section-header">
      <el-form-item label="客戶代號">
        <el-input v-model="form.customer_id" readonly></el-input>
      </el-form-item>
      <el-form-item label="客戶名稱">
        <el-input v-model="form.customer_name" readonly></el-input>
      </el-form-item>
      <el-form-item label="負責業務">
        <el-input v-model="form.sales_rep" readonly></el-input>
      </el-form-item>
      <el-form-item label="虛擬帳號">
        <el-input v-model="form.virtual_account" readonly></el-input>
      </el-form-item>
      <el-form-item label="區域">
        <el-input v-model="form.region" readonly></el-input>
      </el-form-item>
      <el-form-item label="產業類別">
        <el-input v-model="form.industry" readonly></el-input>
      </el-form-item>
      <el-form-item label="預估月加油量">
        <el-input v-model="form.est_fuel_volume" readonly></el-input>
      </el-form-item>
      <el-form-item label="公司電話">
        <el-input v-model="form.phone" readonly></el-input>
      </el-form-item>
      <el-form-item label="傳真號碼">
        <el-input v-model="form.fax" readonly></el-input>
      </el-form-item>
      <el-form-item label="公司統編">
        <el-input v-model="form.vat_number" readonly></el-input>
      </el-form-item>
      <el-form-item label="公司抬頭">
        <el-input v-model="form.company_title" readonly></el-input>
      </el-form-item>
      <el-form-item label="前台密碼(@)">
        <el-input v-model="form.front_pwd" readonly></el-input>
      </el-form-item>
      <el-form-item label="合約日期(起)">
        <el-input v-model="form.contract_start" readonly></el-input>
      </el-form-item>
      <el-form-item label="合約日期(迄)">
        <el-input v-model="form.contract_end" readonly></el-input>
      </el-form-item>
      <el-form-item label="低水位通知">
        <el-input v-model="form.low_balance_notice" readonly></el-input>
      </el-form-item>
      <el-form-item label="停油寬限額度">
        <el-input v-model="form.fuel_grace_limit" readonly></el-input>
      </el-form-item>
      <el-form-item label="營登地址">
        <el-input v-model="form.reg_address" readonly></el-input>
      </el-form-item>
      <el-form-item label="通訊地址">
        <el-input v-model="form.mail_address" readonly></el-input>
      </el-form-item>
      <el-form-item label="交易模式">
        <el-input v-model="form.transaction_mode" readonly></el-input>
      </el-form-item>
      <el-form-item label="押金">
        <el-input v-model="form.deposit" readonly></el-input>
      </el-form-item>
      <el-form-item label="合約備註">
        <el-input v-model="form.contract_notes" readonly></el-input>
      </el-form-item>
      <el-form-item label="更新者">
        <el-input v-model="form.updated" readonly></el-input>
      </el-form-item>
      <el-form-item label="建立者">
        <el-input v-model="form.created" readonly></el-input>
      </el-form-item>
      <el-form-item label="簽呈日期">
        <el-input v-model="form.submission_date" readonly></el-input>
      </el-form-item>
      <el-form-item label="匯款日期">
        <el-input v-model="form.remittance_date" readonly></el-input>
      </el-form-item>
      <el-form-item label="油價簡訊電話">
        <el-input v-model="form.fuel_sms_phone" readonly></el-input>
      </el-form-item>
      <el-form-item label="油價簡訊選項">
        <el-input v-model="form.fuel_sms_option" readonly></el-input>
      </el-form-item>
      <el-form-item label="餘額不足訊息電話">
        <el-input v-model="form.balance_sms_phone" readonly></el-input>
      </el-form-item>
      <el-form-item label="設定方式">
        <el-input v-model="form.config_method" readonly></el-input>
      </el-form-item>
      <el-form-item label="設定方式備註">
        <el-input v-model="form.config_notes" readonly></el-input>
      </el-form-item>
      <el-form-item label="製卡費備註">
        <el-input v-model="form.card_fee_notes" readonly></el-input>
      </el-form-item>
      <el-form-item label="付款方式">
        <el-input v-model="form.payment_method" readonly></el-input>
      </el-form-item>
      <el-form-item label="預付及合約注意事項">
        <el-input v-model="form.con_notes" readonly></el-input>
      </el-form-item>
      <el-form-item label="對帳單及發票注意事項">
        <el-input v-model="form.invoice_notes" readonly></el-input>
      </el-form-item>
      <el-form-item label="合約狀態">
        <el-input v-model="form.contract_status" readonly></el-input>
      </el-form-item>
      <el-form-item label="簽約業務">
        <el-input v-model="form.contract_sales" readonly></el-input>
      </el-form-item>
      <el-form-item label="製卡費用">
        <el-input v-model="form.card_fee" readonly></el-input>
      </el-form-item>
      <el-form-item label="再製卡費用">
        <el-input v-model="form.reissue_fee" readonly></el-input>
      </el-form-item>
      <el-form-item label="業務備註">
        <el-input v-model="form.sales_notes" readonly></el-input>
      </el-form-item>
      <el-form-item label="記錄號碼">
        <el-input v-model="form.record_id" readonly></el-input>
      </el-form-item>
      <el-form-item label="建立時間">
        <el-input v-model="form.createTime" readonly></el-input>
      </el-form-item>
      <el-form-item label="修改時間">
        <el-input v-model="form.updateTime" readonly></el-input>
      </el-form-item>
      <el-form-item label="刪除時間">
        <el-input v-model="form.deleteTime" readonly></el-input>
      </el-form-item>
    </el-form-item>

    <!-- 聯絡人 -->
    <el-form-item label="聯絡人" class="section-header">
      <el-form-item label="職稱-1">
        <el-input v-model="form.JobTitle1" readonly></el-input>
      </el-form-item>
      <el-form-item label="性別-1">
        <el-input v-model="form.Gender1" readonly></el-input>
      </el-form-item>
      <el-form-item label="姓名-1">
        <el-input v-model="form.Name1" readonly></el-input>
      </el-form-item>
      <el-form-item label="電話/手機-1">
        <el-input v-model="form.Mobile1" readonly></el-input>
      </el-form-item>
      <el-form-item label="E-MAIL-1">
        <el-input v-model="form.Email1" readonly></el-input>
      </el-form-item>
      <el-form-item label="備註-1">
        <el-input v-model="form.Notes1" readonly></el-input>
      </el-form-item>
      <el-form-item label="職稱-2">
        <el-input v-model="form.JobTitle2" readonly></el-input>
      </el-form-item>
      <el-form-item label="性別-2">
        <el-input v-model="form.Gender2" readonly></el-input>
      </el-form-item>
      <el-form-item label="姓名-2">
        <el-input v-model="form.Name2" readonly></el-input>
      </el-form-item>
      <el-form-item label="電話/手機-2">
        <el-input v-model="form.Mobile2" readonly></el-input>
      </el-form-item>
      <el-form-item label="E-MAIL-2">
        <el-input v-model="form.Email2" readonly></el-input>
      </el-form-item>
      <el-form-item label="備註-2">
        <el-input v-model="form.Notes2" readonly></el-input>
      </el-form-item>
    </el-form-item>

    <!-- 帳單資訊 -->
    <el-form-item label="帳單資訊" class="section-header">
      <el-form-item label="開立統編">
        <el-input v-model="form.vat_number" readonly></el-input>
      </el-form-item>
      <el-form-item label="發票開立人名稱">
        <el-input v-model="form.invoice_name" readonly></el-input>
      </el-form-item>
      <el-form-item label="對帳單組別">
        <el-input v-model="form.statement_group" readonly></el-input>
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
      <el-form-item label="付款方式">
        <el-input v-model="form.payment_method" readonly></el-input>
      </el-form-item>
      <el-form-item label="收件人姓名">
        <el-input v-model="form.recipient_name" readonly></el-input>
      </el-form-item>
      <el-form-item label="對帳單備註資訊">
        <el-input v-model="form.statement_notes" readonly></el-input>
      </el-form-item>
      <el-form-item label="對帳單注意事項">
        <el-input v-model="form.statement_remarks" readonly></el-input>
      </el-form-item>
      <el-form-item label="建立時間">
        <el-input v-model="form.created" readonly></el-input>
      </el-form-item>
      <el-form-item label="修改時間">
        <el-input v-model="form.updated" readonly></el-input>
      </el-form-item>
      <el-form-item label="刪除時間">
        <el-input v-model="form.deleted" readonly></el-input>
      </el-form-item>
    </el-form-item>

    <!-- 折讓資料 -->
    <el-form-item label="折讓資料" class="section-header" >
      <el-form-item label="油品名稱">
        <el-input v-model="form.ProductName" readonly></el-input>
      </el-form-item>
      <el-form-item label="廠商名稱">
        <el-input v-model="form.SupplierName" readonly></el-input>
      </el-form-item>
      <el-form-item label="折讓">
        <el-input v-model="form.Discount" readonly></el-input>
      </el-form-item>
      <el-form-item label="負責業務">
        <el-input v-model="form.ResponsiblePerson" readonly></el-input>
      </el-form-item>
      <el-form-item label="更新人">
        <el-input v-model="form.Updated" readonly></el-input>
      </el-form-item>
      <el-form-item label="建立人">
        <el-input v-model="form.Created" readonly></el-input>
      </el-form-item>
      <el-form-item label="更新時間">
        <el-input v-model="form.Update" readonly></el-input>
      </el-form-item>
      <el-form-item label="建立時間">
        <el-input v-model="form.Create" readonly></el-input>
      </el-form-item>
      <el-form-item label="記錄號碼">
        <el-input v-model="form.Record" readonly></el-input>
      </el-form-item>
    </el-form-item>
    <el-form-item label="" class="section-header" >
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
  },
data() {
  return {
    form: {
        customer_id: '',
        customer_name: this.customerName,
        sales_rep: '',
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
        updated: '',
        created: '',
        submission_date: '',
        remittance_date: '',
        fuel_sms_phone: '',
        fuel_sms_option: '',
        balance_sms_phone: '',
        config_method: '',
        config_notes: '',
        card_fee_notes: '',
        payment_method: '',
        con_notes: '',
        invoice_notes: '',
        contract_status: '',
        contract_sales: '',
        card_fee: '',
        reissue_fee: '',
        sales_notes: '',
        record_id: '',
        createTime: '',
        updateTime: '',
        deleteTime: '',
        // 聯絡人欄位
        JobTitle1: '',
        Gender1: '',
        Name1: '',
        Mobile1: '',
        Email1: '',
        Notes1: '',
        JobTitle2: '',
        Gender2: '',
        Name2: '',
        Mobile2: '',
        Email2: '',
        Notes2: '',
        // 帳單資訊欄位
        invoice_name: '',
        statement_group: '',
        billing_method: '',
        address_email: '',
        statement_print: '',
        recipient_name: '',
        statement_notes: '',
        statement_remarks: '',
        // 折讓資料欄位
        ProductName: '',
        SupplierName: '',
        Discount: '',
        ResponsiblePerson: '',
        Updated: '',
        Created: '',
        Update: '',
        Create: '',
        Record: '',
      },
  };
},
};
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
  font-weight: bold; /* 粗体 */
}

</style>