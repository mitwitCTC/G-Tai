import{_ as D,L as T,b as p,d as e,e as i,j as _,g as r,f as v,w as t,F as M,r as f,o as n,c as y}from"./index-D6ztYVmn.js";const N={components:{ListBar:T},props:{customerName:{type:String,required:!0},rowType:{type:String,required:!0}},data(){return{rowData:{},cus_code:"",cus_name:"",license_plate:"",form:{cus_code:"G2200696",cus_name:this.customerName,salesmanId:"李柏青",virtual_account:"123456789",region:3,industry:19,est_fuel_volume:"5000",phone:"06-266-1349",fax:"02-2503-1200",vat_number:"81155355",company_title:"整樹貨運股份有限公司",front_pwd:"Lw81155355G2200696",contract_start:"",contract_end:"2027/7/31",low_balance_notice:"100000",fuel_grace_limit:"50000",reg_address:"屏東縣內埔鄉振豐村新南路14號1樓",mail_address:"717台南市仁德區中正西路1011巷122號",transaction_mode:1,deposit:"80000",contract_notes:"91083134甫漾物流通運有限公司所屬車籍開91083134甫漾物流通運有限公司",submission_date:"2024/8/1",remittance_date:"2024/8/1",fuel_sms_phone:"0971111222",fuel_sms_option:"Y",balance_sms_phone:"0913-776-083",config_method:[1,2],config_notes:"111/12月製卡費為業務自行吸收(扣抵獎金)",card_fee_notes:"111/12月製卡費為業務自行吸收(扣抵獎金)",con_notes:"每個禮拜一傳負數到LINE群(不要天天傳)",invoice_notes:"LINE包含EXCEL表",contract_status:2,contract_sales:"李柏青",card_fee:"100",reissue_fee:"100",sales_notes:"111/9/1起原業務李蔚生改為魯孝亜。",createTime:"2024/04/10",updateTime:"2024/04/10",job_title1:"承辦",gender1:"女",name1:"謝小姐",mobile1:"0913-776-083",email1:"s-y-1979@hotmail.com",notes1:"有兩支手機",job_title2:"會計",gender2:"女",name2:"陳羽芯",mobile2:"0913-776-083",email2:"annie88022821@gmail.com",notes2:"公司電話#812",use_number:"A12345678",invoice_name:"台灣叮叮巴士股份有限公司",billing_method:4,address_email:"717台南市仁德區中正西路1011巷122號",statement_print:"YES",payment_method:"月結30日",recipient_name:"汪宗毅",statement_notes:"",statement_remarks:"",product_name:"0001 95無鉛汽油",supplier_name:"台灣中油股份有限公司",discount:"1.5",responsible_person:"魯孝亜",license_plate:"ACC-1234",vehicle_type:"中巴",product_name:" 0001 95無鉛汽油",card_number:"#121611200607123495",card_type:"尿素",upload_time:"2023/11/15",upload_reason:"2023/11/15",card_arrival_date:"2023/11/10",card_stop_date:"2023/11/10",notes:"台灣叮叮巴士股份有限公司",vehicle_change_reason:"更換油品",record_id:"123",employee_id:"GF-012",employee_name:"湯惠誠",job_title:"業務",department_code:"C01",department:"業務部",updated:"柏青",created:"柏青"}}},created(){this.rowData=JSON.parse(this.$route.query.rowData),this.cus_code=this.$route.query.cus_code,this.cus_name=this.$route.query.cus_name,this.license_plate=this.$route.query.license_plate}},I={class:"page-title"},L={key:0},C={key:1},E={key:2},j={key:3},B={key:4},q={key:5},S={key:6},A={class:"page-title"},F={key:0},G={class:"page-title"},J={key:0};function O(w,o,X,z,l,H){const g=f("ListBar"),a=f("el-input"),m=f("el-form-item"),d=f("el-option"),s=f("el-select"),U=f("el-date-picker"),V=f("el-row"),b=f("el-checkbox"),x=f("el-checkbox-group"),Y=f("el-button"),k=f("el-form");return n(),p(M,null,[e(g),i("div",I,[this.rowType==="1"?(n(),p("h2",L,"客戶基本資料編輯")):this.rowType==="2"?(n(),p("h2",C,"聯絡人資料編輯")):this.rowType==="3"?(n(),p("h2",E,"帳單資料編輯")):this.rowType==="4"?(n(),p("h2",j,"折讓資料編輯")):this.rowType==="5"?(n(),p("h2",B,"車籍資料編輯")):this.rowType==="6"?(n(),p("h2",q,"員工資料編輯")):this.rowType==="7"?(n(),p("h2",S,"卡片資料編輯")):_("",!0)]),i("div",A,[this.rowType!="1"&this.rowType!=="6"&this.rowType!=="7"?(n(),p("h5",F,[r(" 客戶代號:"),i("h4",null,v(this.cus_code),1),r(" 客戶名稱:"),i("h4",null,v(this.cus_name),1)])):_("",!0)]),i("div",G,[this.rowType==="7"?(n(),p("h5",J,[r(" 客戶代號:"),i("h4",null,v(this.cus_code),1),r(" 客戶名稱:"),i("h4",null,v(this.cus_name),1),r(" 車牌號碼:"),i("h4",null,v(this.license_plate),1)])):_("",!0)]),i("div",null,[e(k,{model:l.form,"label-width":"155px",style:{width:"100%","min-width":"1600px"}},{default:t(()=>[this.rowType==="1"?(n(),y(m,{key:0,label:"客戶基本資料",class:"section-header"},{default:t(()=>[e(V,{style:{"margin-bottom":"20px"}},{default:t(()=>[e(m,{label:"客戶代號"},{default:t(()=>[e(a,{modelValue:l.form.cus_code,"onUpdate:modelValue":o[0]||(o[0]=u=>l.form.cus_code=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"客戶名稱"},{default:t(()=>[e(a,{modelValue:l.form.cus_name,"onUpdate:modelValue":o[1]||(o[1]=u=>l.form.cus_name=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"負責業務"},{default:t(()=>[e(s,{modelValue:l.form.salesmanId,"onUpdate:modelValue":o[2]||(o[2]=u=>l.form.salesmanId=u),placeholder:"選擇業務"},{default:t(()=>[e(d,{label:"李柏青",value:1}),e(d,{label:"陳先生",value:2}),e(d,{label:"林先生",value:3})]),_:1},8,["modelValue"])]),_:1}),e(m,{label:"虛擬帳號"},{default:t(()=>[e(a,{modelValue:l.form.virtual_account,"onUpdate:modelValue":o[3]||(o[3]=u=>l.form.virtual_account=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"區域"},{default:t(()=>[e(s,{modelValue:l.form.region,"onUpdate:modelValue":o[4]||(o[4]=u=>l.form.region=u),placeholder:"選擇區域"},{default:t(()=>[e(d,{label:"1.北、北、基、宜",value:1}),e(d,{label:"2.中、彰、投",value:2}),e(d,{label:"3.桃、竹、苗",value:3}),e(d,{label:"4.雲、嘉、南",value:4}),e(d,{label:"5.高、屏、澎",value:5}),e(d,{label:"6.花、東",value:6})]),_:1},8,["modelValue"])]),_:1}),e(m,{label:"產業類別"},{default:t(()=>[e(s,{modelValue:l.form.industry,"onUpdate:modelValue":o[5]||(o[5]=u=>l.form.industry=u),placeholder:"選擇產業類別"},{default:t(()=>[e(d,{label:"食品飲料",value:1}),e(d,{label:"營建土木工程",value:6}),e(d,{label:"大眾運輸",value:9}),e(d,{label:"物流倉儲",value:11}),e(d,{label:"礦業土石",value:12}),e(d,{label:"資訊科技",value:13}),e(d,{label:"綜合工商",value:19})]),_:1},8,["modelValue"])]),_:1}),e(m,{label:"預估月加油量"},{default:t(()=>[e(a,{modelValue:l.form.est_fuel_volume,"onUpdate:modelValue":o[6]||(o[6]=u=>l.form.est_fuel_volume=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"公司電話"},{default:t(()=>[e(a,{modelValue:l.form.phone,"onUpdate:modelValue":o[7]||(o[7]=u=>l.form.phone=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"傳真號碼"},{default:t(()=>[e(a,{modelValue:l.form.fax,"onUpdate:modelValue":o[8]||(o[8]=u=>l.form.fax=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"交易模式"},{default:t(()=>[e(s,{modelValue:l.form.transaction_mode,"onUpdate:modelValue":o[9]||(o[9]=u=>l.form.transaction_mode=u),placeholder:"選擇交易模式"},{default:t(()=>[e(d,{label:"儲值",value:1}),e(d,{label:"月結",value:2})]),_:1},8,["modelValue"])]),_:1}),e(m,{label:"押金"},{default:t(()=>[e(a,{modelValue:l.form.deposit,"onUpdate:modelValue":o[10]||(o[10]=u=>l.form.deposit=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"前台密碼(@)"},{default:t(()=>[e(a,{modelValue:l.form.front_pwd,"onUpdate:modelValue":o[11]||(o[11]=u=>l.form.front_pwd=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"合約日期(起)"},{default:t(()=>[e(U,{modelValue:l.form.contract_start,"onUpdate:modelValue":o[12]||(o[12]=u=>l.form.contract_start=u),type:"date",format:"YYYY-MM-DD","value-format":"YYYY-MM-DD",placeholder:"選擇日期",style:{width:"300px"}},null,8,["modelValue"])]),_:1}),e(m,{label:"停油寬限額度"},{default:t(()=>[e(a,{modelValue:l.form.fuel_grace_limit,"onUpdate:modelValue":o[13]||(o[13]=u=>l.form.fuel_grace_limit=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"公司統編"},{default:t(()=>[e(a,{modelValue:l.form.vat_number,"onUpdate:modelValue":o[14]||(o[14]=u=>l.form.vat_number=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"合約日期(迄)"},{default:t(()=>[e(U,{modelValue:l.form.contract_end,"onUpdate:modelValue":o[15]||(o[15]=u=>l.form.contract_end=u),type:"date",format:"YYYY-MM-DD","value-format":"YYYY-MM-DD",placeholder:"選擇日期",style:{width:"300px"}},null,8,["modelValue"])]),_:1}),e(m,{label:"低水位通知"},{default:t(()=>[e(a,{modelValue:l.form.low_balance_notice,"onUpdate:modelValue":o[16]||(o[16]=u=>l.form.low_balance_notice=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"公司抬頭"},{default:t(()=>[e(a,{modelValue:l.form.company_title,"onUpdate:modelValue":o[17]||(o[17]=u=>l.form.company_title=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"簽呈日期"},{default:t(()=>[e(U,{modelValue:l.form.submission_date,"onUpdate:modelValue":o[18]||(o[18]=u=>l.form.submission_date=u),type:"date",format:"YYYY-MM-DD","value-format":"YYYY-MM-DD",placeholder:"選擇日期",style:{width:"300px"}},null,8,["modelValue"])]),_:1}),e(m,{label:"匯款日期"},{default:t(()=>[e(U,{modelValue:l.form.remittance_date,"onUpdate:modelValue":o[19]||(o[19]=u=>l.form.remittance_date=u),type:"date",format:"YYYY-MM-DD","value-format":"YYYY-MM-DD",placeholder:"選擇日期",style:{width:"300px"}},null,8,["modelValue"])]),_:1}),e(m,{label:"油價簡訊電話"},{default:t(()=>[e(a,{modelValue:l.form.fuel_sms_phone,"onUpdate:modelValue":o[20]||(o[20]=u=>l.form.fuel_sms_phone=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"油價簡訊選項"},{default:t(()=>[e(s,{modelValue:l.form.fuel_sms_option,"onUpdate:modelValue":o[21]||(o[21]=u=>l.form.fuel_sms_option=u),placeholder:"選擇交易模式"},{default:t(()=>[e(d,{label:"Y",value:w.Y},null,8,["value"]),e(d,{label:"N",value:w.N},null,8,["value"])]),_:1},8,["modelValue"])]),_:1}),e(m,{label:"餘額不足訊息電話"},{default:t(()=>[e(a,{modelValue:l.form.balance_sms_phone,"onUpdate:modelValue":o[22]||(o[22]=u=>l.form.balance_sms_phone=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"合約狀態"},{default:t(()=>[e(s,{modelValue:l.form.contract_status,"onUpdate:modelValue":o[23]||(o[23]=u=>l.form.contract_status=u),placeholder:"選擇合約狀態"},{default:t(()=>[e(d,{label:"啟用",value:1}),e(d,{label:"暫停",value:2}),e(d,{label:"終止",value:3})]),_:1},8,["modelValue"])]),_:1}),e(m,{label:"營登地址"},{default:t(()=>[e(a,{modelValue:l.form.reg_address,"onUpdate:modelValue":o[24]||(o[24]=u=>l.form.reg_address=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"通訊地址"},{default:t(()=>[e(a,{modelValue:l.form.mail_address,"onUpdate:modelValue":o[25]||(o[25]=u=>l.form.mail_address=u)},null,8,["modelValue"])]),_:1})]),_:1}),e(V,{style:{"margin-bottom":"20px"}},{default:t(()=>[e(m,{label:"製卡費用"},{default:t(()=>[e(a,{modelValue:l.form.card_fee,"onUpdate:modelValue":o[26]||(o[26]=u=>l.form.card_fee=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"再製卡費用"},{default:t(()=>[e(a,{modelValue:l.form.reissue_fee,"onUpdate:modelValue":o[27]||(o[27]=u=>l.form.reissue_fee=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"製卡費備註",style:{width:"1000px"}},{default:t(()=>[e(a,{modelValue:l.form.card_fee_notes,"onUpdate:modelValue":o[28]||(o[28]=u=>l.form.card_fee_notes=u),type:"textarea"},null,8,["modelValue"])]),_:1})]),_:1}),e(V,{style:{"margin-bottom":"20px"}},{default:t(()=>[e(m,{label:"對帳單及發票注意事項",style:{width:"1000px"}},{default:t(()=>[e(a,{modelValue:l.form.invoice_notes,"onUpdate:modelValue":o[29]||(o[29]=u=>l.form.invoice_notes=u),type:"textarea"},null,8,["modelValue"])]),_:1}),e(m,{label:"預付及合約注意事項",style:{width:"1000px"}},{default:t(()=>[e(a,{modelValue:l.form.con_notes,"onUpdate:modelValue":o[30]||(o[30]=u=>l.form.con_notes=u),type:"textarea"},null,8,["modelValue"])]),_:1}),e(m,{label:"合約備註",style:{width:"1000px"}},{default:t(()=>[e(a,{modelValue:l.form.contract_notes,"onUpdate:modelValue":o[31]||(o[31]=u=>l.form.contract_notes=u),type:"textarea"},null,8,["modelValue"])]),_:1})]),_:1}),e(V,{style:{"margin-bottom":"20px"}},{default:t(()=>[e(m,{label:"簽約業務"},{default:t(()=>[e(s,{modelValue:l.form.contract_sales,"onUpdate:modelValue":o[32]||(o[32]=u=>l.form.contract_sales=u),placeholder:"選擇業務"},{default:t(()=>[e(d,{label:"李柏青",value:1}),e(d,{label:"陳先生",value:2}),e(d,{label:"林先生",value:3})]),_:1},8,["modelValue"])]),_:1}),e(m,{label:"業務備註",class:"large-textbox"},{default:t(()=>[e(a,{modelValue:l.form.sales_notes,"onUpdate:modelValue":o[33]||(o[33]=u=>l.form.sales_notes=u),type:"textarea"},null,8,["modelValue"])]),_:1})]),_:1}),e(V,{style:{"margin-bottom":"20px"}},{default:t(()=>[e(m,{label:"設定方式"},{default:t(()=>[e(x,{modelValue:l.form.config_method,"onUpdate:modelValue":o[34]||(o[34]=u=>l.form.config_method=u)},{default:t(()=>[e(b,{label:1},{default:t(()=>[r("銀行定存")]),_:1}),e(b,{label:2},{default:t(()=>[r("現金")]),_:1}),e(b,{label:3},{default:t(()=>[r("支票")]),_:1}),e(b,{label:4},{default:t(()=>[r("商業本票")]),_:1}),e(b,{label:5},{default:t(()=>[r("銀行保證")]),_:1}),e(b,{label:6},{default:t(()=>[r("無擔保")]),_:1}),e(b,{label:7},{default:t(()=>[r("其他")]),_:1})]),_:1},8,["modelValue"])]),_:1}),e(m,{label:"設定方式備註",class:"large-textbox"},{default:t(()=>[e(a,{modelValue:l.form.config_notes,"onUpdate:modelValue":o[35]||(o[35]=u=>l.form.config_notes=u),type:"textarea"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})):_("",!0),this.rowType==="2"?(n(),y(m,{key:1,label:"聯絡人",class:"section-header"},{default:t(()=>[e(V,{style:{"margin-bottom":"20px"}},{default:t(()=>[e(m,{label:"職稱"},{default:t(()=>[e(a,{modelValue:l.form.job_title1,"onUpdate:modelValue":o[36]||(o[36]=u=>l.form.job_title1=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"性別"},{default:t(()=>[e(a,{modelValue:l.form.gender1,"onUpdate:modelValue":o[37]||(o[37]=u=>l.form.gender1=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"姓名"},{default:t(()=>[e(a,{modelValue:l.form.name1,"onUpdate:modelValue":o[38]||(o[38]=u=>l.form.name1=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"電話/手機"},{default:t(()=>[e(a,{modelValue:l.form.mobile1,"onUpdate:modelValue":o[39]||(o[39]=u=>l.form.mobile1=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"E-MAIL"},{default:t(()=>[e(a,{modelValue:l.form.email1,"onUpdate:modelValue":o[40]||(o[40]=u=>l.form.email1=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"備註"},{default:t(()=>[e(a,{modelValue:l.form.notes1,"onUpdate:modelValue":o[41]||(o[41]=u=>l.form.notes1=u)},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})):_("",!0),this.rowType==="3"?(n(),y(m,{key:2,label:"帳單資訊",class:"section-header"},{default:t(()=>[e(m,{label:"帳單名稱"},{default:t(()=>[e(a,{modelValue:l.form.account_sortId,"onUpdate:modelValue":o[42]||(o[42]=u=>l.form.account_sortId=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"開立統編"},{default:t(()=>[e(a,{modelValue:l.form.use_number,"onUpdate:modelValue":o[43]||(o[43]=u=>l.form.use_number=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"發票開立人名稱"},{default:t(()=>[e(a,{modelValue:l.form.invoice_name,"onUpdate:modelValue":o[44]||(o[44]=u=>l.form.invoice_name=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"帳單寄送方式"},{default:t(()=>[e(s,{modelValue:l.form.billing_method,"onUpdate:modelValue":o[45]||(o[45]=u=>l.form.billing_method=u),placeholder:"選擇方式"},{default:t(()=>[e(d,{label:"MAIL",value:1}),e(d,{label:"平信",value:2}),e(d,{label:"官方LINE",value:3}),e(d,{label:"掛號",value:4})]),_:1},8,["modelValue"])]),_:1}),e(m,{label:"地址/E-Mail"},{default:t(()=>[e(a,{modelValue:l.form.address_email,"onUpdate:modelValue":o[46]||(o[46]=u=>l.form.address_email=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"對帳單列印"},{default:t(()=>[e(a,{modelValue:l.form.statement_print,"onUpdate:modelValue":o[47]||(o[47]=u=>l.form.statement_print=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"收件人姓名"},{default:t(()=>[e(a,{modelValue:l.form.recipient_name,"onUpdate:modelValue":o[48]||(o[48]=u=>l.form.recipient_name=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"帳單聯絡人"},{default:t(()=>[e(a,{modelValue:l.form.recipient_name,"onUpdate:modelValue":o[49]||(o[49]=u=>l.form.recipient_name=u)},null,8,["modelValue"])]),_:1}),e(V,{style:{"margin-bottom":"20px"}},{default:t(()=>[e(m,{label:"對帳單備註資訊",style:{width:"1000px"}},{default:t(()=>[e(a,{modelValue:l.form.statement_notes,"onUpdate:modelValue":o[50]||(o[50]=u=>l.form.statement_notes=u),type:"textarea"},null,8,["modelValue"])]),_:1}),e(m,{label:"對帳單注意事項",style:{width:"1000px"}},{default:t(()=>[e(a,{modelValue:l.form.statement_remarks,"onUpdate:modelValue":o[51]||(o[51]=u=>l.form.statement_remarks=u),type:"textarea"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})):_("",!0),this.rowType==="4"?(n(),y(m,{key:3,label:"折讓資料",class:"section-header"},{default:t(()=>[e(m,{label:"油品"},{default:t(()=>[e(s,{modelValue:l.form.product_name,"onUpdate:modelValue":o[52]||(o[52]=u=>l.form.product_name=u),placeholder:"選擇油品"},{default:t(()=>[e(d,{label:"95無鉛汽油",value:1}),e(d,{label:"92無鉛汽油",value:2}),e(d,{label:"98無鉛汽油",value:5}),e(d,{label:"超級柴油",value:6}),e(d,{label:"尿素溶液",value:17})]),_:1},8,["modelValue"])]),_:1}),e(m,{label:"廠商名稱"},{default:t(()=>[e(a,{modelValue:l.form.supplier_name,"onUpdate:modelValue":o[53]||(o[53]=u=>l.form.supplier_name=u),readonly:""},null,8,["modelValue"])]),_:1}),e(m,{label:"折讓"},{default:t(()=>[e(a,{modelValue:l.form.discount,"onUpdate:modelValue":o[54]||(o[54]=u=>l.form.discount=u)},null,8,["modelValue"])]),_:1})]),_:1})):_("",!0),this.rowType==="5"?(n(),y(m,{key:4,label:"車籍資料",class:"section-header"},{default:t(()=>[e(m,{label:"車牌號碼"},{default:t(()=>[e(a,{modelValue:l.form.license_plate,"onUpdate:modelValue":o[55]||(o[55]=u=>l.form.license_plate=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"車輛型態"},{default:t(()=>[e(s,{modelValue:l.form.vehicle_type,"onUpdate:modelValue":o[56]||(o[56]=u=>l.form.vehicle_type=u),placeholder:"選擇車輛型態"},{default:t(()=>[e(d,{label:"大巴",value:1}),e(d,{label:"中巴",value:2}),e(d,{label:"自小客",value:3}),e(d,{label:"油罐卡",value:4}),e(d,{label:"臨時卡",value:5})]),_:1},8,["modelValue"])]),_:1}),e(m,{label:"油品名稱"},{default:t(()=>[e(s,{modelValue:l.form.product_name,"onUpdate:modelValue":o[57]||(o[57]=u=>l.form.product_name=u),placeholder:"選擇油品"},{default:t(()=>[e(d,{label:"95無鉛汽油",value:1}),e(d,{label:"92無鉛汽油",value:2}),e(d,{label:"98無鉛汽油",value:5}),e(d,{label:"超級柴油",value:6}),e(d,{label:"尿素溶液",value:17})]),_:1},8,["modelValue"])]),_:1})]),_:1})):_("",!0),this.rowType==="6"?(n(),y(m,{key:5,label:"員工資料",class:"section-header"},{default:t(()=>[e(m,{label:"員工編號"},{default:t(()=>[e(a,{modelValue:l.rowData.employee_id,"onUpdate:modelValue":o[58]||(o[58]=u=>l.rowData.employee_id=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"員工姓名"},{default:t(()=>[e(a,{modelValue:l.rowData.employee_name,"onUpdate:modelValue":o[59]||(o[59]=u=>l.rowData.employee_name=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"職稱"},{default:t(()=>[e(a,{modelValue:l.rowData.job_title,"onUpdate:modelValue":o[60]||(o[60]=u=>l.rowData.job_title=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"部門代號"},{default:t(()=>[e(a,{modelValue:l.rowData.department_code,"onUpdate:modelValue":o[61]||(o[61]=u=>l.rowData.department_code=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"部門名稱"},{default:t(()=>[e(a,{modelValue:l.rowData.department,"onUpdate:modelValue":o[62]||(o[62]=u=>l.rowData.department=u)},null,8,["modelValue"])]),_:1})]),_:1})):_("",!0),this.rowType==="7"?(n(),y(m,{key:6,label:"車籍卡片資料",class:"section-header"},{default:t(()=>[e(m,{label:"卡號"},{default:t(()=>[e(a,{modelValue:l.form.card_number,"onUpdate:modelValue":o[63]||(o[63]=u=>l.form.card_number=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"卡片類別"},{default:t(()=>[e(a,{modelValue:l.form.card_type,"onUpdate:modelValue":o[64]||(o[64]=u=>l.form.card_type=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"上傳中油時間"},{default:t(()=>[e(a,{modelValue:l.form.upload_time,"onUpdate:modelValue":o[65]||(o[65]=u=>l.form.upload_time=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"上傳中油原因"},{default:t(()=>[e(a,{modelValue:l.form.upload_reason,"onUpdate:modelValue":o[66]||(o[66]=u=>l.form.upload_reason=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"到卡日期"},{default:t(()=>[e(a,{modelValue:l.form.card_arrival_date,"onUpdate:modelValue":o[67]||(o[67]=u=>l.form.card_arrival_date=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"停卡日期"},{default:t(()=>[e(a,{modelValue:l.form.card_stop_date,"onUpdate:modelValue":o[68]||(o[68]=u=>l.form.card_stop_date=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"備註"},{default:t(()=>[e(a,{modelValue:l.form.notes,"onUpdate:modelValue":o[69]||(o[69]=u=>l.form.notes=u)},null,8,["modelValue"])]),_:1}),e(m,{label:"車輛異動-因素"},{default:t(()=>[e(a,{modelValue:l.form.vehicle_change_reason,"onUpdate:modelValue":o[70]||(o[70]=u=>l.form.vehicle_change_reason=u)},null,8,["modelValue"])]),_:1})]),_:1})):_("",!0),e(Y,{type:"primary",onClick:w.onConfirmEdit},{default:t(()=>[r("確認修改")]),_:1},8,["onClick"]),e(m,{label:"",class:"section-white"})]),_:1},8,["model"])])],64)}const P=D(N,[["render",O],["__scopeId","data-v-c887ff99"]]);export{P as default};
