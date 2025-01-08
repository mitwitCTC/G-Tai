<template>
  <ListBar />
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
    <h5
      v-if="
        (this.rowType != '1') &
        (this.rowType !== '6') &
        (this.rowType !== '7') &
        (this.rowType !== '9') &
        (this.rowType !== '5')
      "
    >
      客戶代號:
      <h4>{{ this.cus_code }}</h4>
      客戶名稱:
      <h4>{{ this.cus_name }}</h4>
    </h5>
  </div>
  <div class="page-title">
    <h5 v-if="this.rowType === '7' || this.rowType === '5'">
      客戶代號:
      <h4>{{ this.cus_code }}</h4>
      客戶名稱:
      <h4>{{ this.cus_name }}</h4>
      車牌號碼:
      <h4>{{ this.rowData.license_plate }}</h4>
    </h5>
  </div>
  <div>
    <h6>*為必填欄位</h6>
    <el-form
      :model="form"
      label-width="155px"
      style="width: 100%; min-width: 1600px"
    >
      <!-- 客戶基本資料 -->
      <el-form-item
        label="客戶基本資料"
        class="section-header"
        v-if="this.rowType === '1'"
      >
        <el-row style="margin-bottom: 20px">
          <el-form-item>
            <template #label>
              <span style="color: red">*客戶代號</span>
            </template>
            <el-input v-model="cus_form.cus_code" readonly></el-input>
          </el-form-item>
          <el-form-item>
            <template #label>
              <span style="color: red">*客戶名稱</span>
            </template>
            <el-input v-model="cus_form.cus_name"></el-input>
          </el-form-item>
          <el-form-item label="合約狀態">
            <el-select
              v-model="cus_form.contract_status"
              placeholder="選擇合約狀態"
            >
              <el-option label="未解約" :value="'N'"></el-option>
              <el-option label="暫停" :value="'S'"></el-option>
              <el-option label="解約" :value="'Y'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <template #label>
              <span style="color: red">*公司統編</span>
            </template>
            <el-input v-model="cus_form.vat_number"></el-input>
          </el-form-item>
          <el-form-item label="前台密碼(@)">
            <el-input v-model="cus_form.front_pwd"></el-input>
          </el-form-item>
          <el-form-item label="虛擬帳號">
            <el-input v-model="cus_form.virtual_account"></el-input>
          </el-form-item>
          <el-form-item label="簽呈日期">
            <el-date-picker
              v-model="cus_form.submission_date"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              placeholder="選擇日期"
              style="width: 300px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="合約日期(起)">
            <el-date-picker
              v-model="cus_form.contract_start"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              placeholder="選擇日期"
              style="width: 300px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="合約日期(迄)">
            <el-date-picker
              v-model="cus_form.contract_end"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              placeholder="選擇日期"
              style="width: 300px"
            >
            </el-date-picker>
          </el-form-item>
        </el-row>

        <el-row style="margin-bottom: 20px">
          <el-form-item label="交易模式">
            <el-select
              v-model="cus_form.transaction_mode"
              placeholder="選擇交易模式"
            >
              <el-option label="1.儲值" :value="'1'"></el-option>
              <el-option label="2.月結" :value="'2'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="低水位通知"
            v-if="this.cus_form.transaction_mode == 1"
          >
            <el-input v-model="cus_form.low_balance_notice"></el-input>
          </el-form-item>
          <el-form-item
            label="停油寬限額度"
            v-if="this.cus_form.transaction_mode == 1"
          >
            <el-input
              v-model="cus_form.fuel_grace_limit"
              @input="validateFuelGraceLimit"
              placeholder="請輸入小於或等於 0 的數值"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="款項繳費期限(日)"
            v-if="this.cus_form.transaction_mode == 2"
          >
            <el-input v-model="cus_form.remittance_date"></el-input>
          </el-form-item>
          <el-form-item label="押金">
            <el-input v-model="cus_form.deposit"></el-input>
          </el-form-item>
          <el-form-item label="需特殊開立">
            <el-select v-model="cus_form.special_invoice" placeholder="選擇">
              <el-option label="一般" :value="'0'"></el-option>
              <el-option label="特殊" :value="'1'"></el-option>
            </el-select>
          </el-form-item>
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
              <el-option label="2.傢飾傢俱家電" :value="2"></el-option>
              <el-option label="3.石油化學" :value="3"></el-option>
              <el-option label="4.五金製造" :value="4"></el-option>
              <el-option label="5.電力機械" :value="5"></el-option>
              <el-option label="6.營建土木工程" :value="6"></el-option>
              <el-option label="7.紙業製造" :value="7"></el-option>
              <el-option label="8.金屬製造" :value="8"></el-option>
              <el-option label="9.大眾運輸" :value="9"></el-option>
              <el-option label="10.橡膠塑膠" :value="10"></el-option>
              <el-option label="11.物流倉儲" :value="11"></el-option>
              <el-option label="12.礦業土石" :value="12"></el-option>
              <el-option label="13.資訊科技" :value="13"></el-option>
              <el-option label="14.文教類" :value="14"></el-option>
              <el-option label="15.傳播類" :value="15"></el-option>
              <el-option label="16.環境衛生" :value="16"></el-option>
              <el-option label="17.生技醫療" :value="17"></el-option>
              <el-option label="18.電子科技" :value="18"></el-option>
              <el-option label="19.綜合工商" :value="19"></el-option>
              <el-option label="20.汽機車買賣維修" :value="20"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="預估月加油量">
            <el-input v-model="cus_form.est_fuel_volume"></el-input>
          </el-form-item>
          <el-form-item label="信用卡手續費收取">
            <el-select
              v-model="cus_form.card_other_fee"
              placeholder="選擇是否收取"
            >
              <el-option label="0.不收取" :value="'0'"></el-option>
              <el-option label="1.另外收取" :value="'1'"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-form-item label="製卡費用">
            <el-input
              v-model="cus_form.card_fee"
              class="right-align-input"
            ></el-input>
          </el-form-item>
          <el-form-item label="再製卡費用">
            <el-input
              v-model="cus_form.reissue_fee"
              class="right-align-input"
            ></el-input>
          </el-form-item>
          <el-form-item label="製卡費備註">
            <el-input v-model="cus_form.card_fee_notes"></el-input>
          </el-form-item>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-form-item label="公司電話">
            <el-input v-model="cus_form.phone"></el-input>
          </el-form-item>
          <el-form-item label="傳真號碼">
            <el-input v-model="cus_form.fax"></el-input>
          </el-form-item>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-form-item label="營登地址">
            <el-input v-model="cus_form.reg_address"></el-input>
          </el-form-item>
          <el-form-item label="通訊地址">
            <el-input v-model="cus_form.mail_address"></el-input>
          </el-form-item>
        </el-row>
        <!-- 備註 -->
        <el-row style="margin-bottom: 20px">
          <el-form-item label="對帳單及發票注意事項" style="width: 1000px">
            <el-input
              v-model="cus_form.invoice_notes"
              type="textarea"
            ></el-input>
          </el-form-item>
          <el-form-item label="預付及合約注意事項" style="width: 1000px">
            <el-input v-model="cus_form.con_notes" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="合約備註" style="width: 1000px">
            <el-input
              v-model="cus_form.contract_notes"
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-row>
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
          <el-form-item label="業務備註">
            <el-input v-model="cus_form.sales_notes"></el-input>
          </el-form-item>
        </el-row>
        <el-form-item
          label="設定方式"
          class="section-header"
          v-if="this.cus_form.transaction_mode == 2"
        >
          <el-form-item label="銀行定存">
            <el-input v-model="cus_form.one"></el-input>
          </el-form-item>
          <el-form-item label="現金">
            <el-input v-model="cus_form.two"></el-input>
          </el-form-item>
          <el-form-item label="支票">
            <el-input v-model="cus_form.three"></el-input>
          </el-form-item>
          <el-form-item label="商業本票">
            <el-input v-model="cus_form.four"></el-input>
          </el-form-item>
          <el-form-item label="銀行保證">
            <el-input v-model="cus_form.five"></el-input>
          </el-form-item>
          <el-form-item label="無擔保">
            <el-input v-model="cus_form.six"></el-input>
          </el-form-item>
          <el-form-item label="其它">
            <el-input v-model="cus_form.seven"></el-input>
          </el-form-item>
        </el-form-item>

        <!-- <el-form-item label="公司抬頭">
            <el-input v-model="cus_form.company_title"></el-input>
          </el-form-item> -->

        <!-- <el-form-item label="匯款日期" v-if="this.cus_form.transaction_mode==2">
        <el-date-picker
          v-model="cus_form.remittance_date"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="選擇日期"
          style="width: 300px;">
        </el-date-picker>
      </el-form-item> -->

        <!-- <el-form-item label="油價簡訊電話">
            <el-input v-model="cus_form.fuel_sms_phone"></el-input>
          </el-form-item> -->
        <!-- <el-form-item label="餘額不足簡訊方式" v-if="this.cus_form.transaction_mode==1">
          <el-select v-model="cus_form.fuel_sms_option" placeholder="選擇模式">
            <el-option label="Y" :value="'Y'"></el-option>
            <el-option label="N" :value="'N'"></el-option> 
            <el-option label="1:手機簡訊" :value="'1'"></el-option>
            <el-option label="2:官Line" :value="'2'"></el-option>
            <el-option label="3:手機簡訊+官Line" :value="'3'"></el-option>
            <el-option label="4:私line" :value="'4'"></el-option>
            <el-option label="5:其他" :value="'5'"></el-option>
          </el-select>
        </el-form-item>
      <el-form-item label="餘額不足訊息電話" v-if="this.cus_form.transaction_mode==1">
        <el-input v-model="cus_form.balance_sms_phone"></el-input>
      </el-form-item> -->

        <!-- <el-row style="margin-bottom: 20px"> -->
        <!-- 設定方式 (多選框) -->
        <!-- <el-form-item label="設定方式">
        <el-checkbox-group v-model="cus_form.config_method">
          <el-checkbox :label="1">銀行定存</el-checkbox>
          <el-checkbox :label="2">現金</el-checkbox>
          <el-checkbox :label="3">支票</el-checkbox>
          <el-checkbox :label="4">商業本票</el-checkbox>
          <el-checkbox :label="5">銀行保證</el-checkbox>
          <el-checkbox :label="6">無擔保</el-checkbox>
          <el-checkbox :label="7">其他</el-checkbox>
        </el-checkbox-group>
      </el-form-item> -->
        <!-- 設定方式備註 -->
        <!-- <el-form-item label="設定方式備註" class="large-textbox">
        <el-input v-model="cus_form.config_notes" type="textarea"></el-input>
      </el-form-item> 
    </el-row> -->
        <!-- 信用卡收取手續費 -->

        <!-- <el-form-item label="信用卡手續費%數">
      <el-input v-model="cus_form.card_handling" ></el-input>
    </el-form-item> -->
        <!-- <el-row style="margin-bottom: 20px">
          <el-form-item label="當月用油公升">
            <el-input v-model="cus_form.month_gas"></el-input>
          </el-form-item>
          <el-form-item label="當月餘額金額">
            <el-input v-model="cus_form.month_balance"></el-input>
          </el-form-item>
        </el-row> -->
        <!-- <el-form-item label="設定方式備註" style="width: 1000px;margin-bottom: 20px;" v-if="cus_form.transaction_mode==2">
      <el-input v-model="cus_form.config_notes" type="textarea"  readonly></el-input>
    </el-form-item> -->
      </el-form-item>

      <!-- 聯絡人 -->
      <el-form-item
        label="聯絡人"
        class="section-header"
        v-if="this.rowType === '2'"
      >
        <el-row style="margin-bottom: 20px">
          <el-form-item label="職稱">
            <el-select v-model="rowData.job_title" placeholder="選擇職稱">
              <el-option label="承辦" :value="'承辦'"></el-option>
              <el-option label="會計" :value="'會計'"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="職稱">
            <el-input v-model="rowData.job_title"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="性別">
          <el-select v-model="rowData.gender" placeholder="選擇性別">
          <el-option label="男" :value="'男'"></el-option>
          <el-option label="女" :value="'女'"></el-option>
        </el-select>
        </el-form-item> -->
          <el-form-item label="姓名">
            <el-input v-model="rowData.name"></el-input>
          </el-form-item>
          <el-form-item label="電話/手機">
            <el-input
              v-model="rowData.mobile"
              @input="validatePhone"
              maxlength="10"
            ></el-input>
          </el-form-item>
          <el-form-item label="E-MAIL">
            <el-input v-model="rowData.mail"></el-input>
          </el-form-item>
          <el-form-item label="備註">
            <el-input v-model="rowData.notes"></el-input>
          </el-form-item>
        </el-row>

        <el-row style="margin-bottom: 20px; width: 1000px">
          <el-form-item label="訊息通知">
            <el-select v-model="rowData.messageNotify" placeholder="選擇">
              <el-option label="無" :value="'0'"></el-option>
              <el-option label="手機" :value="'1'"></el-option>
              <el-option label="line" :value="'2'"></el-option>
              <el-option label="Mail" :value="'3'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="帳單通知">
            <el-select v-model="rowData.billNotify" placeholder="選擇">
              <el-option label="無" :value="'0'"></el-option>
              <el-option label="寄送" :value="'1'"></el-option>
              <el-option label="line" :value="'2'"></el-option>
              <el-option label="Mail" :value="'3'"></el-option>
            </el-select>
          </el-form-item>
        </el-row>

        <el-row style="margin-bottom: 20px">
          <el-form-item label="訊息通知Mail" v-if="rowData.messageNotify == 3">
            <el-input v-model="rowData.messageMail"></el-input>
          </el-form-item>
          <el-form-item
            label="帳務地址/Mail"
            v-if="rowData.billNotify == 1 || rowData.billNotify == 3"
          >
            <el-input v-model="rowData.billMail"></el-input>
          </el-form-item>
        </el-row>
      </el-form-item>

      <!-- 帳單資訊 -->
      <el-form-item
        label="帳單資訊"
        class="section-header"
        v-if="this.rowType === '3'"
      >
        <el-form-item label="帳單名稱">
          <el-input v-model="bills_form.acc_name"></el-input>
        </el-form-item>
        <el-form-item label="開立統編">
          <el-input v-model="bills_form.use_number"></el-input>
        </el-form-item>
        <el-form-item label="發票開立人名稱">
          <el-input v-model="bills_form.invoice_name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="帳單寄送方式">
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
          <el-select
            v-model="bills_form.statement_print"
            placeholder="選擇方式"
          >
            <el-option label="YES" :value="'YES'"></el-option>
            <el-option label="NO" :value="'NO'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收件人姓名">
          <el-input v-model="bills_form.recipient_name"></el-input>
        </el-form-item>
        <el-form-item label="帳單聯絡人">
          <el-input v-model="bills_form.acc_contact"></el-input>
        </el-form-item>
        <el-row style="margin-bottom: 20px">
          <el-form-item label="地址/E-Mail" style="width: 1000px">
            <el-input
              v-model="bills_form.address_email"
              type="textarea"
            ></el-input>
          </el-form-item>
          <el-form-item label="對帳單備註資訊" style="width: 1000px">
            <el-input
              v-model="bills_form.statement_notes"
              type="textarea"
            ></el-input>
          </el-form-item>
          <el-form-item label="對帳單注意事項" style="width: 1000px">
            <el-input
              v-model="bills_form.statement_remarks"
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-row> -->
      </el-form-item>

      <!-- 折讓資料 -->
      <el-form-item
        label="折讓資料"
        class="section-header"
        v-if="this.rowType === '4'"
      >
        <el-form-item label="產品名稱">
          <el-select v-model="rowData.product_name" placeholder="選擇油品">
            <el-option
              v-for="id in productMap"
              :key="id.id"
              :label="id.className"
              :value="id.classId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="折讓">
          <el-input v-model="rowData.discount_float"></el-input>
        </el-form-item>
      </el-form-item>

      <!-- 車籍資料 -->
      <el-form-item
        label="車籍資料"
        class="section-header"
        v-if="this.rowType === '5'"
      >
        <el-form-item label="帳單編號">
          <el-select
            v-model="rowData.account_sortId"
            placeholder="選擇帳單編號"
          >
            <el-option
              v-for="id in bills_form"
              :key="id.account_sortId"
              :label="id.acc_name"
              :value="id.account_sortId"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="車牌號碼">
          <el-input v-model="rowData.license_plate" maxlength="9" ></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="車輛型態">
          <el-select v-model="rowData.vehicle_type" placeholder="選擇車輛型態">
            <el-option label="大巴" :value="'1'"></el-option>
            <el-option label="中巴" :value="'2'"></el-option>
            <el-option label="自小客" :value="'3'"></el-option>
            <el-option label="油罐卡" :value="'4'"></el-option>
            <el-option label="臨時卡" :value="'5'"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="產品名稱">
          <el-select v-model="rowData.product_name" placeholder="選擇油品">
            <el-option
              v-for="id in productMap"
              :key="id.id"
              :label="id.className"
              :value="id.classId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>

      <!-- 員工資料 -->
      <el-form-item
        label="員工資料"
        class="section-header"
        v-if="this.rowType === '6'"
      >
        <el-form-item label="員工編號">
          <el-input v-model="rowData.employee_id"></el-input>
        </el-form-item>
        <el-form-item label="員工姓名">
          <el-input v-model="rowData.employee_name"></el-input>
        </el-form-item>
        <el-form-item label="職稱">
          <el-input v-model="rowData.job_title"></el-input>
        </el-form-item>
        <el-form-item label="部門代號">
          <el-input v-model="rowData.department_code"></el-input>
        </el-form-item>
        <el-form-item label="部門名稱">
          <el-input v-model="rowData.department"></el-input>
        </el-form-item>
      </el-form-item>
      <!-- 卡片資料 -->
      <el-form-item
        label="車籍卡片資料"
        class="section-header"
        v-if="this.rowType === '7'"
      >
        <el-form-item label="卡片類別">
          <el-select v-model="rowData.card_type" placeholder="選擇卡片類別">
            <el-option label="1.尿素" :value="'1'"></el-option>
            <el-option label="2.柴油" :value="'2'"></el-option>
            <el-option label="3.汽油" :value="'3'"></el-option>
            <el-option label="4.諾瓦尿素" :value="'4'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上傳中油原因">
          <el-input v-model="rowData.upload_reason"></el-input>
        </el-form-item>
        <el-form-item label="備註">
          <el-input v-model="rowData.notes"></el-input>
        </el-form-item>
        <el-form-item label="車輛異動-因素">
          <el-input v-model="rowData.vehicle_change_reason"></el-input>
        </el-form-item>
      </el-form-item>
      <!-- 永豐資料 -->
      <el-form-item
        label="永豐資料"
        class="section-header"
        v-if="this.rowType === '9'"
      >
        <el-row style="margin-bottom: 20px">
          <el-form-item label="收款單號">
            <el-input v-model="SinopacBank.invoice" readonly></el-input>
          </el-form-item>
          <el-form-item label="客戶代號">
            <el-input v-model="this.cus_code" readonly></el-input>
          </el-form-item>
          <el-form-item label="客戶名稱">
            <el-input v-model="SinopacBank.cus_name" readonly></el-input>
          </el-form-item>
          <el-form-item label="刷卡日期">
            <el-date-picker
              v-model="SinopacBank.credit_card_data"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              placeholder="選擇日期"
              style="width: 300px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="發卡銀行">
            <el-input v-model="SinopacBank.issuing_bank"></el-input>
          </el-form-item>
          <el-form-item label="授權碼">
            <el-input v-model="SinopacBank.remark"></el-input>
          </el-form-item>
          <el-form-item label="刷卡金額">
            <el-input v-model="SinopacBank.credit_amount"></el-input>
          </el-form-item>
          <!-- <el-form-item label="手續費收取">
            <el-input v-model="SinopacBank.card_other_fee" readonly ></el-input>
          </el-form-item> -->
          <el-form-item label="永豐手續費%">
            <el-input v-model="SinopacBank.credit_percent" readonly></el-input>
          </el-form-item>
          <el-form-item label="永豐手續費">
            <el-input v-model="SinopacBank.handling_fee" readonly></el-input>
          </el-form-item>
          <el-form-item label="永豐入帳金額">
            <el-input v-model="SinopacBank.bank_amount"></el-input>
          </el-form-item>
          <el-form-item label="永豐入帳日期">
            <el-date-picker
              v-model="SinopacBank.account_date"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              placeholder="選擇日期"
              style="width: 300px"
            >
            </el-date-picker>
          </el-form-item>
          <!--           
          <el-form-item label="系統手續費%">
            <el-input v-model="SinopacBank.card_handling" readonly ></el-input>
          </el-form-item> -->
          <el-form-item label="系統入帳金額">
            <el-input v-model="SinopacBank.amount" readonly></el-input>
          </el-form-item>
        </el-row>
      </el-form-item>
      <el-button type="primary" @click="onConfirmEdit()">確認修改</el-button>
      <el-form-item label="" class="section-white"> </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ListBar from "@/components/ListBar.vue";
import axios from "axios";

export default {
  components: {
    ListBar,
  },
  props: {
    customerName: {
      type: String,
      required: true,
    },
    rowType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      cus_code: "",
      cus_name: "",
      license_plate: "",
      licens: [],
      productMap: [],
      rowData: {
        updateTime: "",
      },
      cus_form: {
        config_method: [0],
      },
      SinopacBank: {},
      bills_form: {},
      salesmenData: [],
      discount_form: [],
      bills: [],
    };
  },
  mounted() {
    // // 在頁面加載時發送 API 請求
    // axios.get('http://122.116.23.30:3347/main/selectSalesman')
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
    this.cus_code = this.$route.query.cus_code;
    this.cus_name = this.$route.query.cus_name;
    this.account_sortId = this.$route.query.account_sortId;
    if (this.rowType === "1") {
      axios
        .get("http://122.116.23.30:3347/main/selectSalesman")
        .then((response) => {
          this.salesmenData = response.data.data;
        })
        .catch((error) => {
          console.error("API request failed:", error);
        });
      const postData = {
        cus_code: this.cus_code,
      };
      axios
        .post("http://122.116.23.30:3347/main/searchCustomer", postData)
        .then((response) => {
          this.cus_form = response.data.data[0];
          //   const pattern = /銀行定存:\s*([^,]+),\s*現金:\s*([^,]+),\s*支票:\s*([^,]+),\s*商業本票:\s*([^,]+),\s*銀行保證:\s*([^,]+),\s*無擔保:\s*([^,]+),\s*其它:\s*([^,]+)/;
          //   const matches = this.cus_form.config_notes.match(pattern);
          //   if (matches && matches.length === 8) {
          //     this.cus_form.one= matches[1],   // 銀行定存
          //     this.cus_form.two= matches[2],   // 現金
          //     this.cus_form.three= matches[3], // 支票
          //     this.cus_form.four= matches[4],  // 商業本票
          //     this.cus_form.five= matches[5],  // 銀行保證
          //     this.cus_form.six= matches[6],   // 無擔保
          //     this.cus_form.seven= matches[7]  // 其它
          // }
          this.cus_form.config_notes = this.cus_form.config_notes.replace(
            /(\d),(\d)/g,
            "$1|$2"
          );

          const pattern =
            /銀行定存:\s*([^,]+),\s*現金:\s*([^,]+),\s*支票:\s*([^,]+),\s*商業本票:\s*([^,]+),\s*銀行保證:\s*([^,]+),\s*無擔保:\s*([^,]+),\s*其它:\s*([^,]+)/;

          const match = this.cus_form.config_notes.match(pattern);

          if (match) {
            // 將 "|" 換回逗號
            const processedValues = match
              .slice(1)
              .map((value) => value.replace(/\|/g, ","));
            (this.cus_form.one = processedValues[0]), // 銀行定存
              (this.cus_form.two = processedValues[1]), // 現金
              (this.cus_form.three = processedValues[2]), // 支票
              (this.cus_form.four = processedValues[3]), // 商業本票
              (this.cus_form.five = processedValues[4]), // 銀行保證
              (this.cus_form.six = processedValues[5]), // 無擔保
              (this.cus_form.seven = processedValues[6]); // 其它
          }
          // console.log(JSON.stringify(this.cus_form.config_notes))
          //   if (this.cus_form.config_method) {
          //   if (typeof this.cus_form.config_method === 'string') {
          //     // 将 "1,2" 转换为 [1, 2]
          //     this.cus_form.config_method = this.cus_form.config_method.split(',').map(Number);
          //   }
          // } else {
          // // 如果 config_method 是 null 或 undefined，则设置为空数组
          // this.cus_form.config_method = [];
          // }
        })
        .catch((error) => {
          // 處理錯誤
          console.error("API request failed:", error);
        });
    } else if (this.rowType === "3") {
      const postData = {
        account_sortId: this.account_sortId,
      };
      axios
        .post("http://122.116.23.30:3347/main/viewAccount_sort", postData)
        .then((response) => {
          this.bills_form = response.data.data[0];
        })
        .catch((error) => {
          // 處理錯誤
          console.error("API request failed:", error);
        });
    } else if (this.rowType === "4") {
      this.getproduct_name();
      axios
        .get("http://122.116.23.30:3347/main/selectSalesman")
        .then((response) => {
          this.salesmenData = response.data.data;
        })
        .catch((error) => {
          console.error("API request failed:", error);
        });
      this.rowData = JSON.parse(this.$route.query.rowData);
    } else if (this.rowType == "5") {
      this.getproduct_name();
      const postData = {
        customerId: this.cus_code,
      };
      axios
        .post("http://122.116.23.30:3347/main/searchAccount_sort", postData)
        .then((response) => {
          this.bills_form = response.data.data;
          this.rowData = JSON.parse(this.$route.query.rowData);
        })
        .catch((error) => {
          // 處理錯誤
          console.error("API request failed:", error);
        });
    } else if (this.rowType == "2" || this.rowType == "6") {
      this.rowData = JSON.parse(this.$route.query.rowData);
    } else if (this.rowType == "7") {
      this.license_plate = this.$route.query.license_plate;
      this.rowData = JSON.parse(this.$route.query.rowData);
    }
  },
  methods: {
    validateFuelGraceLimit(value) {
      // 確保輸入值小於或等於 0
      if (value > 0) {
        this.cus_form.fuel_grace_limit = 0; // 超出範圍時自動設置為 0
      } else {
        this.cus_form.fuel_grace_limit = value;
      }
    },
    validatePhone(value) {
      // 僅保留數字，限制最大長度 10
      this.rowData.mobile = value.replace(/\D/g, "").slice(0, 10);
    },
    handleSalesmanChange(newValue) {
      // Check if the new value is different from the old one
      if (newValue == "") {
        // If no value selected, delete salesmanId
        delete this.cus_form.salesmanId;
      }
    },
    getEmployeeName(employeeId) {
      // 如果 salesmenData 仍為空，則返回空或其他提示
      if (!this.salesmenData || this.salesmenData.length === 0) {
        return "正在加載...";
      }
      // 使用 find 方法找到對應的 employee_name
      const employee = this.salesmenData.find(
        (item) => item.employee_id === employeeId
      );
      return employee ? employee.employee_name : "未知員工"; // 找到返回名字，找不到返回 "未知員工"
    },

    async onConfirmEdit() {
      if (this.rowType === "1") {
        this.cus_form.updateTime = "";
        if (this.cus_form.transaction_mode == "2") {
          this.cus_form.config_notes = `銀行定存: ${
            this.cus_form.one ? this.cus_form.one : "0"
          }, 現金: ${this.cus_form.two ? this.cus_form.two : "0"}, 支票: ${
            this.cus_form.three ? this.cus_form.three : "0"
          }, 商業本票: ${
            this.cus_form.four ? this.cus_form.four : "0"
          }, 銀行保證: ${
            this.cus_form.five ? this.cus_form.five : "0"
          }, 無擔保: ${this.cus_form.six ? this.cus_form.six : "0"}, 其它: ${
            this.cus_form.seven ? this.cus_form.seven : "0"
          }`;
        } else {
          this.cus_form.config_notes = "";
        }
        this.cus_form.virtual_account = this.cus_form.virtual_account.trim();
        if (this.cus_form.virtual_account.length != 14) {
          this.$message({
            message: "確認虛擬帳戶為14碼",
            type: "error",
          });
          return;
        }
        this.cus_form.config_method = [0];
        const req = this.cus_form;
        axios
          .post("http://122.116.23.30:3347/main/updateCustomer", req)
          .then((response) => {
            if (response.status === 200 && response.data.returnCode == 0) {
              // 成功提示
              this.$message({
                message: "更新成功",
                type: "success",
              });
              // 刷新數據
              setTimeout(() => {
                window.location.reload();
              }, 2000); // 3000 毫秒 = 3 秒
            } else {
              // 處理非 0 成功代碼
              this.$message({
                message: "更新失敗",
                type: "error",
              });
            }
          })
          .catch((error) => {
            // 發生錯誤時，顯示錯誤提示
            this.$message({
              message: " 更新失敗，伺服器錯誤",
              type: "error",
            });
            console.error("Error:", error);
          });
      } else if (this.rowType === "3") {
        await this.getbillselectData();
        this.bills_form.updateTime = "";
        if (
          this.bills.some((bill) => bill.acc_name === this.bills_form.acc_name)
        ) {
          this.$message({
            message: "帳單名稱不能重複",
            type: "warning",
          });
          return;
        }
        const req = this.bills_form;
        axios
          .post("http://122.116.23.30:3347/main/updateAccount_sort", req)
          .then((response) => {
            if (response.status === 200 && response.data.returnCode == 0) {
              // 成功提示
              this.$message({
                message: "更新成功",
                type: "success",
              });
              // 刷新數據
              setTimeout(() => {
                window.history.back();
              }, 2000); // 3000 毫秒 = 3 秒
            } else {
              // 處理非 0 成功代碼
              this.$message({
                message: "更新失敗",
                type: "error",
              });
            }
          })
          .catch((error) => {
            // 發生錯誤時，顯示錯誤提示
            this.$message({
              message: " 更新失敗，伺服器錯誤",
              type: "error",
            });
            console.error("Error:", error);
          });
      } else if (this.rowType === "4") {
        const req = this.rowData;
        axios
          .post("http://122.116.23.30:3347/main/updateDiscount", req)
          .then((response) => {
            if (response.status === 200 && response.data.returnCode == 0) {
              // 成功提示
              this.$message({
                message: "更新成功",
                type: "success",
              });
              // 刷新數據
              setTimeout(() => {
                window.history.back();
              }, 2000); // 3000 毫秒 = 3 秒
            } else {
              // 處理非 0 成功代碼
              this.$message({
                message: "更新失敗",
                type: "error",
              });
            }
          })
          .catch((error) => {
            // 發生錯誤時，顯示錯誤提示
            this.$message({
              message: " 更新失敗，伺服器錯誤",
              type: "error",
            });
            console.error("Error:", error);
          });
      } else if (this.rowType === "5") {
        // await this.getVehicle();
        // console.log("發送客戶車籍API")
        // this.rowData.license_plate = this.rowData.license_plate.trim();
        // if (this.licens.includes(this.rowData.license_plate)) {
        //   this.$message({
        //         message: '此車牌已登入',
        //         type: 'error'
        //       });
        //       return
        // }
        const req = this.rowData;
        axios
          .post("http://122.116.23.30:3347/main/updateVehicle", req)
          .then((response) => {
            if (response.status === 200 && response.data.returnCode == 0) {
              // 成功提示
              this.$message({
                message: "更新成功",
                type: "success",
              });
              // 刷新數據
              setTimeout(() => {
                window.history.back();
              }, 2000); // 3000 毫秒 = 3 秒
            } else {
              // 處理非 0 成功代碼
              this.$message({
                message: "更新失敗",
                type: "error",
              });
            }
          })
          .catch((error) => {
            // 發生錯誤時，顯示錯誤提示
            this.$message({
              message: " 更新失敗，伺服器錯誤",
              type: "error",
            });
            console.error("Error:", error);
          });
      } else if (this.rowType === "7") {
        const req = this.rowData;
        axios
          .post("http://122.116.23.30:3347/main/updateCard", req)
          .then((response) => {
            if (response.status === 200 && response.data.returnCode == 0) {
              // 成功提示
              this.$message({
                message: "更新成功",
                type: "success",
              });
              // 刷新數據
              setTimeout(() => {
                window.history.back();
              }, 2000); // 3000 毫秒 = 3 秒
            } else {
              // 處理非 0 成功代碼
              this.$message({
                message: "更新失敗",
                type: "error",
              });
            }
          })
          .catch((error) => {
            // 發生錯誤時，顯示錯誤提示
            this.$message({
              message: " 更新失敗，伺服器錯誤",
              type: "error",
            });
            console.error("Error:", error);
          });
      } else if (this.rowType === "2") {
        if (this.rowData.messageNotify != 3) {
          this.rowData.messageMail = "";
        }
        if (this.rowData.billNotify != 1 && this.rowData.billNotify != 3) {
          this.rowData.billMail = "";
        }
        const req = this.rowData;
        if (req.isLine != "1" && req.billNotify == "2") {
          this.$message({
            message: "帳單通知Line方式 只限定綁定Line客戶使用",
            type: "error",
          });
          return;
        }
        if (req.isLine != "1" && req.messageNotify == "2") {
          this.$message({
            message: "帳單通知Line方式 只限定綁定Line客戶使用",
            type: "error",
          });
          return;
        }
        if (req.messageNotify == 1 && !req.mobile) {
          this.$message({
            message: "簡訊方式通知 手機欄位不可為空",
            type: "warning",
          });
          return;
        }
        if (req.messageNotify == 3 && !req.messageMail) {
          this.$message({
            message: "Mail方式通知 訊息通知E-MAIL欄位不可為空",
            type: "warning",
          });
          return;
        }
        if ((req.billNotify == 1 || req.billNotify == 3) && !req.billMail) {
          this.$message({
            message: "寄送/Mail方式通知 帳單地址/Mail欄位不可為空",
            type: "warning",
          });
          return;
        }
        axios
          .post("http://122.116.23.30:3347/main/updateContact", req)
          .then((response) => {
            if (response.status === 200 && response.data.returnCode == 0) {
              // 成功提示
              this.$message({
                message: "更新成功",
                type: "success",
              });
              // 刷新數據
              setTimeout(() => {
                window.history.back();
              }, 2000); // 3000 毫秒 = 3 秒
            } else {
              // 處理非 0 成功代碼
              this.$message({
                message: "更新失敗",
                type: "error",
              });
            }
          })
          .catch((error) => {
            // 發生錯誤時，顯示錯誤提示
            this.$message({
              message: " 更新失敗，伺服器錯誤",
              type: "error",
            });
            console.error("Error:", error);
          });
      } else if (this.rowType === "6") {
        const req = this.rowData;
        axios
          .post("http://122.116.23.30:3347/main/updateSalesman", req)
          .then((response) => {
            if (response.status === 200 && response.data.returnCode == 0) {
              // 成功提示
              this.$message({
                message: "更新成功",
                type: "success",
              });
              // 刷新數據
              setTimeout(() => {
                window.history.back();
              }, 2000); // 3000 毫秒 = 3 秒
            } else {
              // 處理非 0 成功代碼
              this.$message({
                message: "更新失敗",
                type: "error",
              });
            }
          })
          .catch((error) => {
            // 發生錯誤時，顯示錯誤提示
            this.$message({
              message: " 更新失敗，伺服器錯誤",
              type: "error",
            });
            console.error("Error:", error);
          });
      }
    },
    async getVehicle() {
      await axios
        .get("http://122.116.23.30:3347/main/selectVehicle")
        .then((response) => {
          this.licens = response.data.data.map((item) => item.license_plate);
        })
        .catch((error) => {
          // 處理錯誤
          console.error("API request failed:", error);
        });
    },
    async getproduct_name() {
      await axios
        .get("http://122.116.23.30:3347/main/selectProduct")
        .then((response) => {
          this.productMap = response.data.data;
        })
        .catch((error) => {
          // 處理錯誤
          console.error("API request failed:", error);
        });
    },
    async getbillselectData() {
      const postData = {
        customerId: this.cus_code,
      };
      await axios
        .post("http://122.116.23.30:3347/main/searchAccount_sort", postData)
        .then((response) => {
          this.bills = response.data.data;
          this.bills = response.data.data.sort((a, b) => {
            return a.acc_name.localeCompare(b.acc_name, "zh-Hans-TW-u-kn-true");
          });
        })
        .catch((error) => {
          // 處理錯誤
          console.error("API request failed:", error);
        });
    },
  },
};
</script>

<style scoped>
.el-input {
  width: 300px;
}
.el-select {
  width: 300px;
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
  width: 600px;
}
.page-title {
  margin-top: 30px;
  margin-bottom: 30px;
}
.page-title h4 {
  color: #f5bd04;
}
h6 {
  color: rgb(255, 0, 0);
  margin-left: 20px;
}
/deep/ .right-align-input .el-input__inner {
  text-align: right;
}
</style>
