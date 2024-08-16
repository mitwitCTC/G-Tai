<template>
  <el-dialog :visible.sync="visible" title="詳細資訊" width="80%">
    <div>
      <!-- 客戶基本資料 -->
      <el-row :gutter="20" class="section">
        <el-col :span="6" v-for="(label, key) in customerBasicInfo" :key="key">
          <el-form-item :label="label">
            <el-input v-model="data[key]" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 聯絡人 -->
      <el-row :gutter="20" class="section">
        <el-col :span="6" v-for="(label, key) in contactsInfo" :key="key">
          <el-form-item :label="label">
            <el-input v-model="data[key]" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 帳單資訊 -->
      <el-row :gutter="20" class="section">
        <el-col :span="6" v-for="(label, key) in billingInfo" :key="key">
          <el-form-item :label="label">
            <el-input v-model="data[key]" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 折讓資料 -->
      <el-row :gutter="20" class="section">
        <el-col :span="6" v-for="(label, key) in discountInfo" :key="key">
          <el-form-item :label="label">
            <el-input v-model="data[key]" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">關閉</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    customerBasicInfo() {
      return {
        customer_id: '客戶代號',
        customer_name: '客戶名稱',
        sales_rep: '負責業務',
        virtual_account: '虛擬帳號',
        region: '區域',
        industry: '產業類別',
        est_fuel_volume: '預估月加油量',
        phone: '公司電話',
        fax: '傳真號碼',
        vat_number: '公司統編',
        company_title: '公司抬頭',
        front_pwd: '前台密碼(@)',
        contract_start: '合約日期(起)',
        contract_end: '合約日期(迄)',
        low_balance_notice: '低水位通知',
        fuel_grace_limit: '停油寬限額度',
        reg_address: '營登地址',
        mail_address: '通訊地址',
        transaction_mode: '交易模式',
        deposit: '押金',
        contract_notes: '合約備註',
        updated: '更新者',
        created: '建立者',
        submission_date: '簽呈日期',
        remittance_date: '匯款日期',
        fuel_sms_phone: '油價簡訊電話',
        fuel_sms_option: '油價簡訊選項',
        balance_sms_phone: '餘額不足訊息電話',
        config_method: '設定方式',
        config_notes: '設定方式備註',
        card_fee_notes: '製卡費備註',
        payment_method: '付款方式',
        con_notes: '預付及合約注意事項',
        invoice_notes: '對帳單及發票注意事項',
        contract_status: '合約狀態',
        contract_sales: '簽約業務',
        card_fee: '製卡費用',
        reissue_fee: '再製卡費用',
        sales_notes: '業務備註',
        record_id: '記錄號碼',
        createTime: '建立時間',
        updateTime: '修改時間',
        deleteTime: '刪除時間'
      };
    },
    contactsInfo() {
      return {
        JobTitle1: '職稱-1',
        Gender1: '性別-1',
        Name1: '姓名-1',
        Mobile1: '電話/手機-1',
        Email1: 'E-MAIL-1',
        Notes1: '備註-1',
        JobTitle2: '職稱-2',
        Gender2: '性別-2',
        Name2: '姓名-2',
        Mobile2: '電話/手機-2',
        Email2: 'E-MAIL-2',
        Notes2: '備註-2'
      };
    },
    billingInfo() {
      return {
        vat_number: '開立統編',
        invoice_name: '發票開立人名稱',
        statement_group: '對帳單組別',
        billing_method: '帳單寄送方式',
        address_email: '地址/E-Mail',
        statement_print: '對帳單列印',
        payment_method: '付款方式',
        recipient_name: '收件人姓名',
        statement_notes: '對帳單備註資訊',
        statement_remarks: '對帳單注意事項',
        created: '建立時間',
        updated: '修改時間',
        deleted: '刪除時間'
      };
    },
    discountInfo() {
      return {
        ProductName: '油品名稱',
        SupplierName: '廠商名稱',
        Discount: '折讓',
        ResponsiblePerson: '負責業務',
        Updated: '更新人',
        Created: '建立人',
        Update: '更新時間',
        Create: '建立時間',
        Record: '記錄號碼'
      };
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false);
    }
  }
};
</script>

<style scoped>
.section {
  margin-bottom: 20px;
}

.dialog-footer {
  text-align: right;
}
</style>
