<template>
  <ListBar/>
  <div class="page-title">
  <h2 v-if="this.rowType === '1'">客戶基本資料查詢</h2>
  <h2 v-else-if="this.rowType === '3'">帳單資料查詢</h2>
  <h2 v-else-if="this.rowType === '6'">員工資料查詢</h2>
  <h2 v-else-if="this.rowType === '9'">永豐資料查詢</h2>
</div>
  <div class="page-title">
  <h5 v-if="this.rowType != '1' & this.rowType !== '6' & this.rowType !== '9'">
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
    <el-form-item label="負責業務" v-if="this.salesmenData">
      <el-input :value="getEmployeeName(cus_form.salesmanId)"  readonly></el-input>
    </el-form-item>
    <!-- <el-form-item label="負責業務" v-if="this.salesmenData">
      <el-input :value="cus_form.salesmanId"  readonly></el-input>
    </el-form-item> -->
    <el-form-item label="虛擬帳號">
      <el-input v-model="cus_form.virtual_account" readonly></el-input>
    </el-form-item>
    <el-form-item label="區域">
      <el-input v-model="cus_form.region" :formatter="formatRegion" readonly></el-input>
    </el-form-item>
    <el-form-item label="產業類別">
      <el-input v-model="cus_form.industry" :formatter="formatIndustry" readonly></el-input>
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
      <el-input
      :value="cus_form.transaction_mode == '1' ? '1.儲值' : (cus_form.transaction_mode == '2' ? '2.月結' : '未知')"
      readonly
      ></el-input>
    </el-form-item>
    <el-form-item label="押金">
      <el-input v-model="cus_form.deposit" :value="formatCurrency(cus_form.deposit)" readonly class="right-align-input" ></el-input>
    </el-form-item>
    <el-form-item label="前台密碼(@)">
      <el-input v-model="cus_form.front_pwd" readonly></el-input>
    </el-form-item>
    <el-form-item label="合約日期(起)">
      <el-input v-model="cus_form.contract_start" readonly></el-input>
    </el-form-item>
    <el-form-item label="停油寬限額度" v-if="this.cus_form.transaction_mode==1">
      <el-input v-model="cus_form.fuel_grace_limit" :value="formatCurrency(cus_form.fuel_grace_limit)" readonly></el-input>
    </el-form-item>
    <el-form-item label="公司統編">
      <el-input v-model="cus_form.vat_number" readonly></el-input>
    </el-form-item>
    <el-form-item label="合約日期(迄)">
      <el-input v-model="cus_form.contract_end" readonly></el-input>
    </el-form-item>
    <el-form-item label="低水位通知" v-if="this.cus_form.transaction_mode==1">
      <el-input v-model="cus_form.low_balance_notice":value="formatCurrency(cus_form.low_balance_notice)" readonly></el-input>
    </el-form-item>
    <el-form-item label="公司抬頭">
      <el-input v-model="cus_form.company_title" readonly></el-input>
    </el-form-item>
    <el-form-item label="簽呈日期">
      <el-input v-model="cus_form.submission_date" readonly></el-input>
    </el-form-item>
    <el-form-item label="匯款日期" v-if="this.cus_form.transaction_mode==2">
      <el-input v-model="cus_form.remittance_date" readonly></el-input>
    </el-form-item>
    <el-form-item label="油價簡訊電話">
      <el-input v-model="cus_form.fuel_sms_phone" readonly></el-input>
    </el-form-item> 
     <el-form-item label="油價簡訊選項">
      <el-input v-model="cus_form.fuel_sms_option" readonly></el-input>
    </el-form-item>
    <el-form-item label="餘額不足訊息電話" v-if="this.cus_form.transaction_mode==1">
      <el-input v-model="cus_form.balance_sms_phone" readonly></el-input>
    </el-form-item>
    <el-form-item label="合約狀態">
      <el-input :value="cus_form.contract_status == 'N' ? '未解約' : (cus_form.contract_status == 'Y' ? '解約' : (cus_form.contract_status == 'S' ? '暫停' : '未知'))"
      readonly 
      ></el-input>
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
      <el-input v-model="cus_form.card_fee" readonly class="right-align-input"></el-input>
    </el-form-item>
    <el-form-item label="再製卡費用">
      <el-input v-model="cus_form.reissue_fee" readonly class="right-align-input"></el-input>
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
    <el-form-item label="簽約業務" v-if="this.salesmenData">
      <el-input :value="getEmployeeName(cus_form.contract_sales)"   readonly></el-input>
    </el-form-item>
    <el-form-item label="業務備註" class="large-textbox">
      <el-input v-model="cus_form.sales_notes" type="textarea" readonly></el-input>
    </el-form-item>
  </el-row>

  <!-- 設定方式&備註 -->

    <!-- 設定方式 (多選框) -->
    <!-- <el-form-item label="設定方式">
      <el-checkbox-group v-model="cus_form.config_method" disabled >
        <el-checkbox :value="1">銀行定存</el-checkbox>
        <el-checkbox :value="2">現金</el-checkbox>
        <el-checkbox :value="3">支票</el-checkbox>
        <el-checkbox :value="4">商業本票</el-checkbox>
        <el-checkbox :value="5">銀行保證</el-checkbox>
        <el-checkbox :value="6">無擔保</el-checkbox>
        <el-checkbox :value="7">其他</el-checkbox>
      </el-checkbox-group>
    </el-form-item> -->
    <!-- 設定方式備註 -->
    

  <!-- 信用卡收取手續費 -->
  <el-row style="margin-bottom: 20px">
    <el-form-item label="信用卡手續費收取">
      <el-input v-model="cus_form.card_other_fee" :formatter="formatOtherfee" readonly ></el-input>
    </el-form-item>
    <!-- <el-form-item label="信用卡手續費%數">
      <el-input v-model="cus_form.card_handling" readonly ></el-input>
    </el-form-item> -->
  </el-row>
  <el-row style="margin-bottom: 20px">
    <el-form-item label="當月用油公升">
      <el-input v-model="cus_form.month_gas" readonly></el-input>
    </el-form-item>
    <el-form-item label="當月餘額金額">
      <el-input v-model="cus_form.month_balance" readonly></el-input>
    </el-form-item>
  </el-row>
  <!-- <el-form-item label="設定方式" style="width: 1000px;margin-bottom: 20px;" v-if="cus_form.transaction_mode==2">
      <el-input v-model="cus_form.config_notes" type="textarea"  readonly></el-input>
    </el-form-item> -->
    <el-form-item label="設定方式" class="section-header" v-if="this.cus_form.transaction_mode==2" >
      <el-form-item label="銀行定存" >
          <el-input v-model="cus_form.one" readonly></el-input>
      </el-form-item>
      <el-form-item label="現金" >
          <el-input v-model="cus_form.two" readonly ></el-input>
      </el-form-item>
      <el-form-item label="支票" >
          <el-input v-model="cus_form.three" readonly ></el-input>
      </el-form-item>
      <el-form-item label="商業本票" >
          <el-input v-model="cus_form.four" readonly ></el-input>
      </el-form-item>
      <el-form-item label="銀行保證" >
          <el-input v-model="cus_form.five" readonly ></el-input>
      </el-form-item>
      <el-form-item label="無擔保" >
          <el-input v-model="cus_form.six" readonly ></el-input>
      </el-form-item>
      <el-form-item label="其它" >
          <el-input v-model="cus_form.seven" readonly ></el-input>
      </el-form-item>
    </el-form-item>
  <el-row style="margin-bottom: 20px">
    <el-form-item label="建立時間">
      <el-input v-model="cus_form.createTime" readonly></el-input>
    </el-form-item>
    <el-form-item label="修改時間">
      <el-input v-model="cus_form.updateTime" readonly></el-input>
    </el-form-item>
  </el-row>
  </el-form-item>
  <!--查詢所有list-->
  <!--帳單list-->
  <el-form-item label="帳單資訊" class="section-header" v-if="this.rowType==='1'" >
    <div class="table-container">
        <el-table :data="bills" style="width: 100%; " v-loading="loading" >
          <el-table-column prop="account_sortId" label="帳單編號" width="150" />
          <el-table-column prop="acc_name" label="帳單名稱" width="250" />
          <el-table-column prop="use_number" label="開立統編" width="100" />
          <el-table-column prop="recipient_name" label="收件人姓名" width="300" />
          <el-table-column prop="billing_method" label="寄送方式" :formatter="formatbilling_method"  width="150" />
          <el-table-column prop="address_email" label="收件地址/Mail"width="400" />
        </el-table>
      </div>
    </el-form-item>
    <!--車籍list-->
    <el-form-item label="車籍資訊" class="section-header" v-if="this.rowType==='1'">
    <div class="table-container">
      <el-table :data="currentPageData2" style="width: 100%" v-loading="loading">
        <el-table-column prop="account_sortId" label="帳單名稱" width="300"><template v-slot="scope">{{ formatName(scope.row.account_sortId)}} </template></el-table-column>
        <el-table-column prop="license_plate" label="車牌號碼" width="200" />
        <el-table-column prop="vehicle_type" label="車輛型態" :formatter="formatType" width="300" />
        <el-table-column prop="product_name" label="油品名稱"  width="350" ><template v-slot="scope">{{ formatProduct(scope.row.product_name)}} </template></el-table-column>
        <el-table-column label="操作"  width="200">
          <template v-slot="scope">
            <div class="action-icons">
              <el-button type="warning" @click="onVehicle(scope.row)">車籍卡片</el-button>
            </div>
          </template>
       </el-table-column>
    </el-table>
      </div>
      <div class="pagination-container">
      <div class="pagination-info">
        Showing {{ startItem2 }} to {{ endItem2 }} of {{ vehicles.length }}
      </div>
      <el-pagination
        @current-change="handlePageChange2"
        :current-page="currentPage2"
        :page-size="pageSize"
        :total="vehicles.length"
        layout="prev, pager, next, jumper"
        class="pagination"
      />
    </div>
    </el-form-item>
    <el-form-item label="中油當月資訊" class="section-header" v-if="this.rowType==='1'">
    <div class="table-container">
      <el-table :data="currentPageData" style="width: 100%" v-loading="loading">
      <el-table-column prop="trade_time" label="交易日期時間"  width="200" ></el-table-column>
      <el-table-column prop="license_plate" label="車牌號碼" width="200" />
      <el-table-column prop="fuel_type" label="油品" width="200" />
      <el-table-column prop="station_name" label="加油站名稱"  width="350" />
      <el-table-column prop="fuel_volume" label="油量"  width="200" />
      <el-table-column prop="reference_price" label="參考單價"  width="200" />
    </el-table>
      </div>
      <div class="pagination-container">
      <div class="pagination-info">
        Showing {{ startItem }} to {{ endItem }} of {{ cpc.length }}
      </div>
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="cpc.length"
        layout="prev, pager, next, jumper"
        class="pagination"
      />
    </div>
    </el-form-item>
    
    <el-form-item label="折讓資訊" class="section-header" v-if="this.rowType==='1'">
    <div class="table-container">
      <el-table :data="DiscountData" style="width: 100%" v-loading="loading">
      <el-table-column prop="product_name" label="油品名稱"  width="300" ><template v-slot="scope">{{ formatProduct(scope.row.product_name)}} </template></el-table-column>
      <el-table-column prop="supplier_name" label="廠商名稱" width="500" />
      <el-table-column prop="discount_float" label="折讓" width="250" />
      <el-table-column prop="responsible_person" label="負責業務" :formatter="getListEmployeeName" width="300" />
    </el-table>
      </div>
    </el-form-item>
    <!--聯絡人list-->
    <el-form-item label="聯絡人資訊" class="section-header" v-if="this.rowType==='1'">
      <div class="table-container">
      <el-table :data="contact" style="width: 100%" v-loading="loading">
        <el-table-column prop="job_title" label="職稱" width="150"></el-table-column>
        <el-table-column prop="gender" label="性別" width="100"></el-table-column>
        <el-table-column prop="name" label="姓名" width="250"></el-table-column>
        <el-table-column prop="mobile" label="手機/電話" width="250"></el-table-column>
        <el-table-column prop="mail" label="E-MAIL" width="300"></el-table-column>
        <el-table-column prop="notes" label="備註" width="300"></el-table-column>
      </el-table>
    </div>
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
        <el-input v-model="bills_form.billing_method" :formatter="formatBill" readonly></el-input>
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
        <el-form-item label="地址/E-Mail" style="width: 1000px" >
        <el-input v-model="bills_form.address_email" type="textarea" ></el-input>
      </el-form-item>
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
    <!-- 永豐資料 -->
    <el-form-item label="永豐資料" class="section-header" v-if="this.rowType==='9'" >
      <el-row style="margin-bottom: 20px">
            <el-form-item label="收款單號">
            <el-input v-model="SinopacBank.invoice" readonly ></el-input>
          </el-form-item>
          <el-form-item label="客戶代號">
             <el-input v-model="SinopacBank.customerId" readonly></el-input>
          </el-form-item>
          <el-form-item label="客戶名稱">
            <el-input v-model="SinopacBank.cus_name" readonly ></el-input>
          </el-form-item>
          <el-form-item label="信用卡號">
            <el-input v-model="SinopacBank.account" readonly ></el-input>
          </el-form-item>
          <el-form-item label="刷卡日期">
            <el-input v-model="SinopacBank.account_date" readonly ></el-input>
          </el-form-item>
          <el-form-item label="發卡銀行">
            <el-input v-model="SinopacBank.issuing_bank" readonly ></el-input>
          </el-form-item>
          <el-form-item label="授權碼">
            <el-input v-model="SinopacBank.remark" readonly></el-input>
          </el-form-item>
          <el-form-item label="刷卡金額">
            <el-input v-model="SinopacBank.credit_amount" :value="formatCurrency(SinopacBank.credit_amount)" readonly ></el-input>
          </el-form-item>
          <!-- <el-form-item label="手續費收取">
            <el-input v-model="SinopacBank.card_other_fee" readonly ></el-input>
          </el-form-item> -->
          <el-form-item label="永豐手續費%">
            <el-input v-model="SinopacBank.credit_percent" :value="formatCurrency(SinopacBank.credit_percent)" readonly ></el-input>
          </el-form-item>
          <el-form-item label="永豐手續費">
            <el-input v-model="SinopacBank.handling_fee" :value="formatCurrency(SinopacBank.handling_fee)" readonly ></el-input>
          </el-form-item>
            <el-form-item label="永豐入帳金額">
            <el-input v-model="SinopacBank.bank_amount" :value="formatCurrency(SinopacBank.bank_amount)" readonly ></el-input>
          </el-form-item>
          <el-form-item label="永豐入帳日期">
            <el-input v-model="SinopacBank.credit_card_data" readonly ></el-input>
          </el-form-item>
          <!-- <el-form-item label="系統手續費%">
            <el-input v-model="SinopacBank.card_handling" readonly ></el-input>
          </el-form-item> -->
          <el-form-item label="系統入帳金額">
            <el-input v-model="SinopacBank.amount" :value="formatCurrency(SinopacBank.amount)" readonly ></el-input>
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
import { toRaw } from 'vue'; 
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
    loading:false,
    currentPage2:1,
    currentPage:1,
    pageSize: 10,
    invoice:'',
    salesmenData:[],
    bills:[],
    vehicles:[],
    DiscountData:[],
    contact:[],
    productMap:[],
      productType:{
        "1": "大巴",
        "2": "中巴",
        "3": "自小客",
        "4": "油罐卡",
        "5": "臨時卡"
      },
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
        '1': '1.北、北、基、宜',
        '2': '2.中、彰、投',
        '3': '3.桃、竹、苗',
        '4': '4.雲、嘉、南',
        '5': '5.高、屏、澎',
        '6': '6.花、東'
      } ,// 區域對應的映射
      billMap:{
        '0': '0.不需要',
        '1': '1.MAIL',
        '2': '2.平信',
        '3': '3.官方LINE',
        '4': '4.掛號',
        '5': '5.合併寄'
      },
      Otherfee:{
        '0': '0.不收取',
        '1': '1.另外收取'
      },
    cus_form:{
      //客戶基本資料
        cus_code: '',
        cus_name: '',
        salesmanId: '',
        invoice:'',
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
    },
    SinopacBank:{},
    cpc:[]
    
  };
},
computed: {
 
    // 計算當前頁面顯示的數據
   currentPageData2() {
      const start = (this.currentPage2 - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.vehicles.slice(start, end);
    },
    // 計算當前頁面顯示的起始和結束項目
    startItem2() {
      const start = (this.currentPage2 - 1) * this.pageSize + 1;
      return Math.min(start, this.vehicles.length);
    },
    endItem2() {
      const end = this.currentPage2 * this.pageSize;
      return Math.min(end, this.vehicles.length);
    },
    currentPageData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.cpc.slice(start, end);
    },
    // 計算當前頁面顯示的起始和結束項目
    startItem() {
      const start = (this.currentPage - 1) * this.pageSize + 1;
      return Math.min(start, this.cpc.length);
    },
    endItem() {
      const end = this.currentPage * this.pageSize;
      return Math.min(end, this.cpc.length);
    },
   
  },
mounted() {
    // 發送 API 請求以獲取業務資料
   
  },
async created() {
  this.cus_code = (this.$route.query.cus_code);
  this.cus_name = (this.$route.query.cus_name);
  this.account_sortId  = (this.$route.query.account_sortId );
  this.invoice=(this.$route.query.invoice );
  
  if (this.rowType==='1') {
      const postData = {
        cus_code:this.cus_code,
      };
      axios.post('http://122.116.23.30:3345/main/searchCustomer',postData)
        .then(response => {
          this.cus_form = response.data.data[0];
          console.log("業務"+this.cus_form.salesmanId)
          if(this.cus_form.transaction_mode=='2'){
            const pattern = /銀行定存:\s*([^,]+),\s*現金:\s*([^,]+),\s*支票:\s*([^,]+),\s*商業本票:\s*([^,]+),\s*銀行保證:\s*([^,]+),\s*無擔保:\s*([^,]+),\s*其它:\s*([^,]+)/;
            const matches = this.cus_form.config_notes.match(pattern);
          if (matches && matches.length === 8) {
            this.cus_form.one= matches[1],   // 銀行定存
            this.cus_form.two= matches[2],   // 現金
            this.cus_form.three= matches[3], // 支票
            this.cus_form.four= matches[4],  // 商業本票
            this.cus_form.five= matches[5],  // 銀行保證
            this.cus_form.six= matches[6],   // 無擔保
            this.cus_form.seven= matches[7]  // 其它
          }
        }
          // if (this.cus_form.config_method) {
          //   if (typeof this.cus_form.config_method === 'string') {
          //     // 将 "1,2" 转换为 [1, 2]
          //     this.cus_form.config_method = this.cus_form.config_method.split(',').map(Number);
          //   }
          // } else {
          // // 如果 config_method 是 null 或 undefined，则设置为空数组
          // this.cus_form.config_method = [];
          // }
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
        this.getsalesman();
        this.getcpc();
        this.getbillselectData()
        this.getvehiclesselectData()
        this.getdiscountselectData()
        this.getcontactselectData()
        this.getproduct_name();
        
    }else if(this.rowType==='3'){
      const postData = {
        account_sortId :this.account_sortId,
    };
      axios.post('http://122.116.23.30:3345/main/viewAccount_sort',postData)
        .then(response => {
          this.bills_form = response.data.data[0];
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
    }else if(this.rowType=='6'){
      this.rowData = JSON.parse(this.$route.query.rowData);
    }else if(this.rowType==='9'){
      const postData = {
        customerId :this.cus_code,
        invoice :this.invoice
    };
    const postData2 = {
      cus_code :this.cus_code,
    };
    axios.post('http://122.116.23.30:3345/finance/searchSINOPAC',postData)
        .then(response => {
          this.SinopacBank = response.data.data[0];
          //客戶名稱
          axios.post('http://122.116.23.30:3345/main/searchCustomer',postData2)
        .then(response => {
          this.SinopacBank.cus_name = response.data.data[0].cus_name;
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
    }
  },
  methods:{
    async getsalesman() {
     await axios.get('http://122.116.23.30:3345/main/selectSalesman')
      .then(response => {
        this.salesmenData = response.data.data; // 獲取到數據後將其存儲到 salesmenData
      })
      .catch(error => {
        // 處理錯誤
        console.error('API request failed:', error);
      });
    },
    async getcontactselectData() {
      this.loading = true;  // 開始加載
      const postData = {
      customerId:this.cus_code,
      };
      await axios.post('http://122.116.23.30:3345/main/searchContact',postData)
        .then(response => {
          this.contact = response.data.data;
         
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
  },
    async getdiscountselectData() {
      this.loading = true;  // 開始加載
      const postData = {
      customerId:this.cus_code,
      };
      await axios.post('http://122.116.23.30:3345/main/searchDiscount',postData)
        .then(response => {
          this.DiscountData = response.data.data;
         
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
  },
  async getproduct_name() {
    this.loading = true;  // 開始加載
      await axios.get('http://122.116.23.30:3345/main/selectProduct')
        .then(response => {
          this.productMap = response.data.data;
        
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
    },
    async getcpc() {
    this.loading = true;  // 開始加載
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // 確保月份為兩位數
    const formattedDate = `${year}-${month}`;
    const postdata={
      date:formattedDate,
      customerId:this.cus_code
    }
    console.log("CPC"+JSON.stringify(postdata))
      await axios.post('http://122.116.23.30:3346/main/balanceInquiry',postdata)
        .then(response => {
          this.cpc = response.data.data;
          this.loading = false;  // 請求完成後關閉加載狀態
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
    },
    async getvehiclesselectData() {
      this.loading = true;  // 開始加載
      const postData = {
      customerId:this.cus_code,
      };
      await axios.post('http://122.116.23.30:3345/main/searchVehicle',postData)
        .then(response => {
          this.vehicles = response.data.data;
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
    },
    async getbillselectData() {
      this.loading = true;  // 開始加載
      const postData = {
      customerId:this.cus_code,
      };
      await axios.post('http://122.116.23.30:3345/main/searchAccount_sort',postData)
        .then(response => {
          this.bills = response.data.data;
          
        })
        .catch(error => {
          // 處理錯誤
          console.error('API request failed:', error);
        });
    },
    formatName(account_sortId) {
      // 使用 find 方法找到對應的 employee_name
      const account = this.bills.find(item => item.account_sortId == account_sortId);
      return account == null ? '' : (account ? account.acc_name : '未知名稱');
    },
    formatIndustry(value) {
      return this.industryMap[value] || '未知';
    },
    formatRegion(value) {
      return this.regionMap[value] || '未知';
    },
    formatBill(value) {
      return this.billMap[value] || '未知';
    },
    formatOtherfee(value) {
      return this.Otherfee[value] || '未知';
    },
    getEmployeeName(employeeId) {
      // 如果 salesmenData 仍為空，則返回空或其他提示
      if (!this.salesmenData || this.salesmenData.length === 0) {
        return '正在加載...';
      }
      // 使用 find 方法找到對應的 employee_name
      const employee = this.salesmenData.find(item => item.employee_id === employeeId);
      return employee == null ? '' : (employee ? employee.employee_name : '未知員工');
    },
    formatCurrency(value) {
      if (!value) return '0';
      return Number(value).toLocaleString(); // 使用 toLocaleString 進行千分位格式化
    },
    onVehicle(row) {
      console.log('View details for:', row);
      this.$router.push({ 
        path: 'vehicle',
        query: {
          cus_name:this.cus_name,
          cus_code:this.cus_code,
          license_plate:row.license_plate,
          vehicleId:row.vehicleId
        }
      });
    },
    handlePageChange2(page) {
      this.currentPage2 = page;
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    formatbilling_method(billing_method) {
      const rawproduct = toRaw(billing_method);
      return this.billMap[rawproduct.billing_method] || '未知';
    },
    formatType(vehicle_type) {
      const rawproduct = toRaw(vehicle_type);
      return this.productType[rawproduct.vehicle_type] || '未知';
    },
    formatProduct(product_name) {
      const product = this.productMap.find(item => item.classId == product_name);
      return product == null ? '' : (product ? product.className : '未知名稱');
    },
    getListEmployeeName(responsible_person) {
      // 如果 salesmenData 仍為空，則返回空或其他提示
      if (!this.salesmenData || this.salesmenData.length === 0) {
        return '正在加載...';
      }
      // 使用 find 方法找到對應的 employee_name
      const responsible = toRaw(responsible_person);
      const employee = this.salesmenData.find(item => item.employee_id == responsible.responsible_person);
      return employee == null ? '' : (employee ? employee.employee_name : '未知員工');
    },
    
  }
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
  padding-right: 750px; /* 可选: 添加右边距以与分页控件分开 */
  white-space: nowrap;
}
.pagination {
  flex: 1;
  text-align: right;
}
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
.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}
/deep/ .right-align-input .el-input__inner {
  text-align: right;
}

</style>