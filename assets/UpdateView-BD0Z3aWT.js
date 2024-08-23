import{_ as w,L as k,a as T,b as e,d as b,t as I,w as u,F as L,r as a,o as f,c as i,e as s,h as _}from"./index-_xWReBu9.js";const C={components:{ListBar:k},props:{customerName:{type:String,required:!0},rowType:{type:String,required:!0}},data(){return{form:{cus_code:"G2200696",cus_name:this.customerName,salesmanId:"李柏青",virtual_account:"123456789",region:3,industry:19,est_fuel_volume:"5000",phone:"06-266-1349",fax:"02-2503-1200",vat_number:"81155355",company_title:"整樹貨運股份有限公司",front_pwd:"Lw81155355G2200696",contract_start:"2024/8/1",contract_end:"2027/7/31",low_balance_notice:"100000",fuel_grace_limit:"50000",reg_address:"屏東縣內埔鄉振豐村新南路14號1樓",mail_address:"717台南市仁德區中正西路1011巷122號",transaction_mode:1,deposit:"80000",contract_notes:"91083134甫漾物流通運有限公司所屬車籍開91083134甫漾物流通運有限公司",submission_date:"2024/8/1",remittance_date:"2024/8/1",fuel_sms_phone:"0971111222",fuel_sms_option:"Y",balance_sms_phone:"0913-776-083",config_method:[1,2],config_notes:"111/12月製卡費為業務自行吸收(扣抵獎金)",card_fee_notes:"111/12月製卡費為業務自行吸收(扣抵獎金)",con_notes:"每個禮拜一傳負數到LINE群(不要天天傳)",invoice_notes:"LINE包含EXCEL表",contract_status:2,contract_sales:"李柏青",card_fee:"100",reissue_fee:"100",sales_notes:"111/9/1起原業務李蔚生改為魯孝亜。",createTime:"2024/04/10",updateTime:"2024/04/10",job_title1:"承辦",gender1:"女",name1:"謝小姐",mobile1:"0913-776-083",email1:"s-y-1979@hotmail.com",notes1:"有兩支手機",job_title2:"會計",gender2:"女",name2:"陳羽芯",mobile2:"0913-776-083",email2:"annie88022821@gmail.com",notes2:"公司電話#812",use_number:"A12345678",invoice_name:"台灣叮叮巴士股份有限公司",billing_method:4,address_email:"717台南市仁德區中正西路1011巷122號",statement_print:"YES",payment_method:"月結30日",recipient_name:"汪宗毅",statement_notes:"",statement_remarks:"",product_name:"0001 95無鉛汽油",supplier_name:"台灣中油股份有限公司",discount:"1.5",responsible_person:"魯孝亜",license_plate:"ACC-1234",vehicle_type:"中巴",product_name:" 0001 95無鉛汽油",card_number:"#121611200607123495",card_type:"尿素",upload_time:"2023/11/15",upload_reason:"2023/11/15",card_arrival_date:"2023/11/10",card_stop_date:"2023/11/10",notes:"台灣叮叮巴士股份有限公司",vehicle_change_reason:"更換油品",record_id:"123",employee_id:"GF-012",employee_name:"湯惠誠",job_title:"業務",department_code:"C01",department:"業務部",updated:"2024-04-09",created:"2024-04-09"}}}},E={class:"page-title"};function N(U,o,j,B,l,A){const v=a("ListBar"),d=a("el-input"),t=a("el-form-item"),n=a("el-option"),r=a("el-select"),V=a("el-row"),p=a("el-checkbox"),y=a("el-checkbox-group"),g=a("el-button"),x=a("el-form");return f(),T(L,null,[e(v),b("div",E,[b("h2",null,I(U.pageTitle),1)]),b("div",null,[e(x,{model:l.form,"label-width":"155px",style:{width:"100%","min-width":"1600px"}},{default:u(()=>[this.rowType==="1"?(f(),i(t,{key:0,label:"客戶基本資料",class:"section-header"},{default:u(()=>[e(V,{style:{"margin-bottom":"20px"}},{default:u(()=>[e(t,{label:"客戶代號"},{default:u(()=>[e(d,{modelValue:l.form.cus_code,"onUpdate:modelValue":o[0]||(o[0]=m=>l.form.cus_code=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"客戶名稱"},{default:u(()=>[e(d,{modelValue:l.form.cus_name,"onUpdate:modelValue":o[1]||(o[1]=m=>l.form.cus_name=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"負責業務"},{default:u(()=>[e(d,{modelValue:l.form.salesmanId,"onUpdate:modelValue":o[2]||(o[2]=m=>l.form.salesmanId=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"虛擬帳號"},{default:u(()=>[e(d,{modelValue:l.form.virtual_account,"onUpdate:modelValue":o[3]||(o[3]=m=>l.form.virtual_account=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"區域"},{default:u(()=>[e(r,{modelValue:l.form.region,"onUpdate:modelValue":o[4]||(o[4]=m=>l.form.region=m),placeholder:"選擇區域"},{default:u(()=>[e(n,{label:"北、北、基、宜",value:1}),e(n,{label:"桃、竹、苗",value:2}),e(n,{label:"中、彰、投",value:3}),e(n,{label:"雲、嘉、南",value:4}),e(n,{label:"高、屏、澎",value:5}),e(n,{label:"花、東",value:6})]),_:1},8,["modelValue"])]),_:1}),e(t,{label:"產業類別"},{default:u(()=>[e(r,{modelValue:l.form.industry,"onUpdate:modelValue":o[5]||(o[5]=m=>l.form.industry=m),placeholder:"選擇產業類別"},{default:u(()=>[e(n,{label:"食品飲料",value:1}),e(n,{label:"營建土木工程",value:6}),e(n,{label:"大眾運輸",value:9}),e(n,{label:"物流倉儲",value:11}),e(n,{label:"礦業土石",value:12}),e(n,{label:"資訊科技",value:13}),e(n,{label:"綜合工商",value:19})]),_:1},8,["modelValue"])]),_:1}),e(t,{label:"預估月加油量"},{default:u(()=>[e(d,{modelValue:l.form.est_fuel_volume,"onUpdate:modelValue":o[6]||(o[6]=m=>l.form.est_fuel_volume=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"公司電話"},{default:u(()=>[e(d,{modelValue:l.form.phone,"onUpdate:modelValue":o[7]||(o[7]=m=>l.form.phone=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"傳真號碼"},{default:u(()=>[e(d,{modelValue:l.form.fax,"onUpdate:modelValue":o[8]||(o[8]=m=>l.form.fax=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"交易模式"},{default:u(()=>[e(r,{modelValue:l.form.transaction_mode,"onUpdate:modelValue":o[9]||(o[9]=m=>l.form.transaction_mode=m),placeholder:"選擇交易模式"},{default:u(()=>[e(n,{label:"儲值",value:1}),e(n,{label:"月結",value:2})]),_:1},8,["modelValue"])]),_:1}),e(t,{label:"押金"},{default:u(()=>[e(d,{modelValue:l.form.deposit,"onUpdate:modelValue":o[10]||(o[10]=m=>l.form.deposit=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"前台密碼(@)"},{default:u(()=>[e(d,{modelValue:l.form.front_pwd,"onUpdate:modelValue":o[11]||(o[11]=m=>l.form.front_pwd=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"合約日期(起)"},{default:u(()=>[e(d,{modelValue:l.form.contract_start,"onUpdate:modelValue":o[12]||(o[12]=m=>l.form.contract_start=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"停油寬限額度"},{default:u(()=>[e(d,{modelValue:l.form.fuel_grace_limit,"onUpdate:modelValue":o[13]||(o[13]=m=>l.form.fuel_grace_limit=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"公司統編"},{default:u(()=>[e(d,{modelValue:l.form.vat_number,"onUpdate:modelValue":o[14]||(o[14]=m=>l.form.vat_number=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"合約日期(迄)"},{default:u(()=>[e(d,{modelValue:l.form.contract_end,"onUpdate:modelValue":o[15]||(o[15]=m=>l.form.contract_end=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"低水位通知"},{default:u(()=>[e(d,{modelValue:l.form.low_balance_notice,"onUpdate:modelValue":o[16]||(o[16]=m=>l.form.low_balance_notice=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"公司抬頭"},{default:u(()=>[e(d,{modelValue:l.form.company_title,"onUpdate:modelValue":o[17]||(o[17]=m=>l.form.company_title=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"簽呈日期"},{default:u(()=>[e(d,{modelValue:l.form.submission_date,"onUpdate:modelValue":o[18]||(o[18]=m=>l.form.submission_date=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"匯款日期"},{default:u(()=>[e(d,{modelValue:l.form.remittance_date,"onUpdate:modelValue":o[19]||(o[19]=m=>l.form.remittance_date=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"油價簡訊電話"},{default:u(()=>[e(d,{modelValue:l.form.fuel_sms_phone,"onUpdate:modelValue":o[20]||(o[20]=m=>l.form.fuel_sms_phone=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"油價簡訊選項"},{default:u(()=>[e(d,{modelValue:l.form.fuel_sms_option,"onUpdate:modelValue":o[21]||(o[21]=m=>l.form.fuel_sms_option=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"餘額不足訊息電話"},{default:u(()=>[e(d,{modelValue:l.form.balance_sms_phone,"onUpdate:modelValue":o[22]||(o[22]=m=>l.form.balance_sms_phone=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"合約狀態"},{default:u(()=>[e(r,{modelValue:l.form.contract_status,"onUpdate:modelValue":o[23]||(o[23]=m=>l.form.contract_status=m),placeholder:"選擇合約狀態"},{default:u(()=>[e(n,{label:"啟用",value:1}),e(n,{label:"暫停",value:2}),e(n,{label:"終止",value:3})]),_:1},8,["modelValue"])]),_:1}),e(t,{label:"建立時間"},{default:u(()=>[e(d,{modelValue:l.form.createTime,"onUpdate:modelValue":o[24]||(o[24]=m=>l.form.createTime=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"修改時間"},{default:u(()=>[e(d,{modelValue:l.form.updateTime,"onUpdate:modelValue":o[25]||(o[25]=m=>l.form.updateTime=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"營登地址"},{default:u(()=>[e(d,{modelValue:l.form.reg_address,"onUpdate:modelValue":o[26]||(o[26]=m=>l.form.reg_address=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"通訊地址"},{default:u(()=>[e(d,{modelValue:l.form.mail_address,"onUpdate:modelValue":o[27]||(o[27]=m=>l.form.mail_address=m)},null,8,["modelValue"])]),_:1})]),_:1}),e(V,{style:{"margin-bottom":"20px"}},{default:u(()=>[e(t,{label:"製卡費用"},{default:u(()=>[e(d,{modelValue:l.form.card_fee,"onUpdate:modelValue":o[28]||(o[28]=m=>l.form.card_fee=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"再製卡費用"},{default:u(()=>[e(d,{modelValue:l.form.reissue_fee,"onUpdate:modelValue":o[29]||(o[29]=m=>l.form.reissue_fee=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"製卡費備註",style:{width:"1000px"}},{default:u(()=>[e(d,{modelValue:l.form.card_fee_notes,"onUpdate:modelValue":o[30]||(o[30]=m=>l.form.card_fee_notes=m),type:"textarea"},null,8,["modelValue"])]),_:1})]),_:1}),e(V,{style:{"margin-bottom":"20px"}},{default:u(()=>[e(t,{label:"對帳單及發票注意事項",style:{width:"1000px"}},{default:u(()=>[e(d,{modelValue:l.form.invoice_notes,"onUpdate:modelValue":o[31]||(o[31]=m=>l.form.invoice_notes=m),type:"textarea"},null,8,["modelValue"])]),_:1}),e(t,{label:"預付及合約注意事項",style:{width:"1000px"}},{default:u(()=>[e(d,{modelValue:l.form.con_notes,"onUpdate:modelValue":o[32]||(o[32]=m=>l.form.con_notes=m),type:"textarea"},null,8,["modelValue"])]),_:1}),e(t,{label:"合約備註",style:{width:"1000px"}},{default:u(()=>[e(d,{modelValue:l.form.contract_notes,"onUpdate:modelValue":o[33]||(o[33]=m=>l.form.contract_notes=m),type:"textarea"},null,8,["modelValue"])]),_:1})]),_:1}),e(V,{style:{"margin-bottom":"20px"}},{default:u(()=>[e(t,{label:"簽約業務"},{default:u(()=>[e(d,{modelValue:l.form.contract_sales,"onUpdate:modelValue":o[34]||(o[34]=m=>l.form.contract_sales=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"業務備註",class:"large-textbox"},{default:u(()=>[e(d,{modelValue:l.form.sales_notes,"onUpdate:modelValue":o[35]||(o[35]=m=>l.form.sales_notes=m),type:"textarea"},null,8,["modelValue"])]),_:1})]),_:1}),e(V,{style:{"margin-bottom":"20px"}},{default:u(()=>[e(t,{label:"設定方式"},{default:u(()=>[e(y,{modelValue:l.form.config_method,"onUpdate:modelValue":o[36]||(o[36]=m=>l.form.config_method=m)},{default:u(()=>[e(p,{label:1},{default:u(()=>[s("銀行定存")]),_:1}),e(p,{label:2},{default:u(()=>[s("現金")]),_:1}),e(p,{label:3},{default:u(()=>[s("支票")]),_:1}),e(p,{label:4},{default:u(()=>[s("商業本票")]),_:1}),e(p,{label:5},{default:u(()=>[s("銀行保證")]),_:1}),e(p,{label:6},{default:u(()=>[s("無擔保")]),_:1}),e(p,{label:7},{default:u(()=>[s("其他")]),_:1})]),_:1},8,["modelValue"])]),_:1}),e(t,{label:"設定方式備註",class:"large-textbox"},{default:u(()=>[e(d,{modelValue:l.form.config_notes,"onUpdate:modelValue":o[37]||(o[37]=m=>l.form.config_notes=m),type:"textarea"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})):_("",!0),this.rowType==="2"?(f(),i(t,{key:1,label:"聯絡人",class:"section-header"},{default:u(()=>[e(V,{style:{"margin-bottom":"20px"}},{default:u(()=>[e(t,{label:"職稱"},{default:u(()=>[e(d,{modelValue:l.form.job_title1,"onUpdate:modelValue":o[38]||(o[38]=m=>l.form.job_title1=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"性別"},{default:u(()=>[e(d,{modelValue:l.form.gender1,"onUpdate:modelValue":o[39]||(o[39]=m=>l.form.gender1=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"姓名"},{default:u(()=>[e(d,{modelValue:l.form.name1,"onUpdate:modelValue":o[40]||(o[40]=m=>l.form.name1=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"電話/手機"},{default:u(()=>[e(d,{modelValue:l.form.mobile1,"onUpdate:modelValue":o[41]||(o[41]=m=>l.form.mobile1=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"E-MAIL"},{default:u(()=>[e(d,{modelValue:l.form.email1,"onUpdate:modelValue":o[42]||(o[42]=m=>l.form.email1=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"備註"},{default:u(()=>[e(d,{modelValue:l.form.notes1,"onUpdate:modelValue":o[43]||(o[43]=m=>l.form.notes1=m)},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})):_("",!0),this.rowType==="3"?(f(),i(t,{key:2,label:"帳單資訊",class:"section-header"},{default:u(()=>[e(t,{label:"帳單名稱"},{default:u(()=>[e(d,{modelValue:l.form.account_sortId,"onUpdate:modelValue":o[44]||(o[44]=m=>l.form.account_sortId=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"開立統編"},{default:u(()=>[e(d,{modelValue:l.form.use_number,"onUpdate:modelValue":o[45]||(o[45]=m=>l.form.use_number=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"發票開立人名稱"},{default:u(()=>[e(d,{modelValue:l.form.invoice_name,"onUpdate:modelValue":o[46]||(o[46]=m=>l.form.invoice_name=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"帳單寄送方式"},{default:u(()=>[e(r,{modelValue:l.form.billing_method,"onUpdate:modelValue":o[47]||(o[47]=m=>l.form.billing_method=m),placeholder:"選擇方式"},{default:u(()=>[e(n,{label:"MAIL",value:1}),e(n,{label:"平信",value:2}),e(n,{label:"官方LINE",value:3}),e(n,{label:"掛號",value:4})]),_:1},8,["modelValue"])]),_:1}),e(t,{label:"地址/E-Mail"},{default:u(()=>[e(d,{modelValue:l.form.address_email,"onUpdate:modelValue":o[48]||(o[48]=m=>l.form.address_email=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"對帳單列印"},{default:u(()=>[e(d,{modelValue:l.form.statement_print,"onUpdate:modelValue":o[49]||(o[49]=m=>l.form.statement_print=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"收件人姓名"},{default:u(()=>[e(d,{modelValue:l.form.recipient_name,"onUpdate:modelValue":o[50]||(o[50]=m=>l.form.recipient_name=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"帳單聯絡人"},{default:u(()=>[e(d,{modelValue:l.form.recipient_name,"onUpdate:modelValue":o[51]||(o[51]=m=>l.form.recipient_name=m)},null,8,["modelValue"])]),_:1}),e(V,{style:{"margin-bottom":"20px"}},{default:u(()=>[e(t,{label:"對帳單備註資訊",style:{width:"1000px"}},{default:u(()=>[e(d,{modelValue:l.form.statement_notes,"onUpdate:modelValue":o[52]||(o[52]=m=>l.form.statement_notes=m),type:"textarea"},null,8,["modelValue"])]),_:1}),e(t,{label:"對帳單注意事項",style:{width:"1000px"}},{default:u(()=>[e(d,{modelValue:l.form.statement_remarks,"onUpdate:modelValue":o[53]||(o[53]=m=>l.form.statement_remarks=m),type:"textarea"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})):_("",!0),this.rowType==="4"?(f(),i(t,{key:3,label:"折讓資料",class:"section-header"},{default:u(()=>[e(t,{label:"油品"},{default:u(()=>[e(r,{modelValue:l.form.product_name,"onUpdate:modelValue":o[54]||(o[54]=m=>l.form.product_name=m),placeholder:"選擇油品"},{default:u(()=>[e(n,{label:"95無鉛汽油",value:1}),e(n,{label:"92無鉛汽油",value:2}),e(n,{label:"98無鉛汽油",value:5}),e(n,{label:"超級柴油",value:6}),e(n,{label:"尿素溶液",value:17})]),_:1},8,["modelValue"])]),_:1}),e(t,{label:"廠商名稱"},{default:u(()=>[e(d,{modelValue:l.form.supplier_name,"onUpdate:modelValue":o[55]||(o[55]=m=>l.form.supplier_name=m),readonly:""},null,8,["modelValue"])]),_:1}),e(t,{label:"折讓"},{default:u(()=>[e(d,{modelValue:l.form.discount,"onUpdate:modelValue":o[56]||(o[56]=m=>l.form.discount=m)},null,8,["modelValue"])]),_:1})]),_:1})):_("",!0),this.rowType==="5"?(f(),i(t,{key:4,label:"車籍資料",class:"section-header"},{default:u(()=>[e(t,{label:"車牌號碼"},{default:u(()=>[e(d,{modelValue:l.form.license_plate,"onUpdate:modelValue":o[57]||(o[57]=m=>l.form.license_plate=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"車輛型態"},{default:u(()=>[e(r,{modelValue:l.form.vehicle_type,"onUpdate:modelValue":o[58]||(o[58]=m=>l.form.vehicle_type=m),placeholder:"選擇車輛型態"},{default:u(()=>[e(n,{label:"大巴",value:1}),e(n,{label:"中巴",value:2}),e(n,{label:"自小客",value:3}),e(n,{label:"油罐卡",value:4}),e(n,{label:"臨時卡",value:5})]),_:1},8,["modelValue"])]),_:1}),e(t,{label:"油品名稱"},{default:u(()=>[e(r,{modelValue:l.form.product_name,"onUpdate:modelValue":o[59]||(o[59]=m=>l.form.product_name=m),placeholder:"選擇油品"},{default:u(()=>[e(n,{label:"95無鉛汽油",value:1}),e(n,{label:"92無鉛汽油",value:2}),e(n,{label:"98無鉛汽油",value:5}),e(n,{label:"超級柴油",value:6}),e(n,{label:"尿素溶液",value:17})]),_:1},8,["modelValue"])]),_:1})]),_:1})):_("",!0),this.rowType==="6"?(f(),i(t,{key:5,label:"業務員資料",class:"section-header"},{default:u(()=>[e(t,{label:"記錄號碼"},{default:u(()=>[e(d,{modelValue:l.form.record_id,"onUpdate:modelValue":o[60]||(o[60]=m=>l.form.record_id=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"員工編號"},{default:u(()=>[e(d,{modelValue:l.form.employee_id,"onUpdate:modelValue":o[61]||(o[61]=m=>l.form.employee_id=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"員工姓名"},{default:u(()=>[e(d,{modelValue:l.form.employee_name,"onUpdate:modelValue":o[62]||(o[62]=m=>l.form.employee_name=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"職稱"},{default:u(()=>[e(d,{modelValue:l.form.job_title,"onUpdate:modelValue":o[63]||(o[63]=m=>l.form.job_title=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"部門代號"},{default:u(()=>[e(d,{modelValue:l.form.department_code,"onUpdate:modelValue":o[64]||(o[64]=m=>l.form.department_code=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"部門名稱"},{default:u(()=>[e(d,{modelValue:l.form.department,"onUpdate:modelValue":o[65]||(o[65]=m=>l.form.department=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"更新者"},{default:u(()=>[e(d,{modelValue:l.form.updated,"onUpdate:modelValue":o[66]||(o[66]=m=>l.form.updated=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"建立者"},{default:u(()=>[e(d,{modelValue:l.form.created,"onUpdate:modelValue":o[67]||(o[67]=m=>l.form.created=m)},null,8,["modelValue"])]),_:1})]),_:1})):_("",!0),this.rowType==="7"?(f(),i(t,{key:6,label:"車籍卡片資料",class:"section-header"},{default:u(()=>[e(t,{label:"卡號"},{default:u(()=>[e(d,{modelValue:l.form.card_number,"onUpdate:modelValue":o[68]||(o[68]=m=>l.form.card_number=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"卡片類別"},{default:u(()=>[e(d,{modelValue:l.form.card_type,"onUpdate:modelValue":o[69]||(o[69]=m=>l.form.card_type=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"上傳中油時間"},{default:u(()=>[e(d,{modelValue:l.form.upload_time,"onUpdate:modelValue":o[70]||(o[70]=m=>l.form.upload_time=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"上傳中油原因"},{default:u(()=>[e(d,{modelValue:l.form.upload_reason,"onUpdate:modelValue":o[71]||(o[71]=m=>l.form.upload_reason=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"到卡日期"},{default:u(()=>[e(d,{modelValue:l.form.card_arrival_date,"onUpdate:modelValue":o[72]||(o[72]=m=>l.form.card_arrival_date=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"停卡日期"},{default:u(()=>[e(d,{modelValue:l.form.card_stop_date,"onUpdate:modelValue":o[73]||(o[73]=m=>l.form.card_stop_date=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"備註"},{default:u(()=>[e(d,{modelValue:l.form.notes,"onUpdate:modelValue":o[74]||(o[74]=m=>l.form.notes=m)},null,8,["modelValue"])]),_:1}),e(t,{label:"車輛異動-因素"},{default:u(()=>[e(d,{modelValue:l.form.vehicle_change_reason,"onUpdate:modelValue":o[75]||(o[75]=m=>l.form.vehicle_change_reason=m)},null,8,["modelValue"])]),_:1})]),_:1})):_("",!0),e(g,{type:"primary",onClick:U.onConfirmEdit},{default:u(()=>[s("確認修改")]),_:1},8,["onClick"]),e(t,{label:"",class:"section-white"})]),_:1},8,["model"])])],64)}const F=w(C,[["render",N],["__scopeId","data-v-52821335"]]);export{F as default};
