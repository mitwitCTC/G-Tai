import{_ as w,L as B,a as C,b as e,d as r,t as N,w as c,r as i,o as V,f as I}from"./index-D9GkMop4.js";import{B as P}from"./BreadCrumb-aRHMB2C_.js";import{T as y}from"./TablePaginated-D0TxJUcp.js";const T={components:{BreadCrumb:P,ListBar:B,TablePaginated:y},data(){return{filters:{area:"",salesperson:"",customerName:""},bills:[{billId:"B001",customerId:"C001",customerName:"客戶A",transactionMode:"現金",taxId:"12345678",recipientName:"張三",recipientTitle:"經理",deliveryMethod:"快遞",deliveryAddress:"台北市中正區"},{billId:"B002",customerId:"C002",customerName:"客戶B",transactionMode:"刷卡",taxId:"87654321",recipientName:"李四",recipientTitle:"主任",deliveryMethod:"郵寄",deliveryAddress:"台中市西屯區"}],currentPage:1,pageSize:10}},computed:{filteredBills(){return this.bills.filter(l=>l.customerName.includes(this.filters.customerName)&&(this.filters.area?l.deliveryAddress.includes(this.filters.area):!0)&&(this.filters.salesperson?l.recipientTitle.includes(this.filters.salesperson):!0))},paginatedBills(){const l=(this.currentPage-1)*this.pageSize,t=l+this.pageSize;return this.filteredBills.slice(l,t)}},methods:{handlePageChange(l){this.currentPage=l},viewDetails(l){console.log("View details for:",l),this.$router.push({path:"SelectView",query:{rowType:"3",customerName:l.customerName}})},editItem(l){console.log("Edit item:",l)},deleteItem(l){console.log("Delete item:",l)}}},k={class:"page-title"},S={class:"filters"},x={class:"table-container"},z={class:"action-icons"},M=["onClick"],A=["onClick"],D=["onClick"];function L(l,t,U,E,o,d){const m=i("ListBar"),_=i("BreadCrumb"),n=i("el-option"),u=i("el-select"),f=i("el-input"),h=i("el-button"),b=i("el-form-item"),s=i("el-table-column"),g=i("el-table"),v=i("TablePaginated");return V(),C("div",null,[e(m),r("div",k,[r("h2",null,N(l.pageTitle),1)]),r("div",null,[e(_,{isSpecialPage:!0})]),r("div",S,[e(u,{modelValue:o.filters.area,"onUpdate:modelValue":t[0]||(t[0]=a=>o.filters.area=a),placeholder:"區域",class:"filter-input"},{default:c(()=>[e(n,{label:"北部",value:"north"}),e(n,{label:"中部",value:"central"}),e(n,{label:"南部",value:"south"}),e(n,{label:"東部",value:"east"})]),_:1},8,["modelValue"]),e(u,{modelValue:o.filters.salesperson,"onUpdate:modelValue":t[1]||(t[1]=a=>o.filters.salesperson=a),placeholder:"負責業務",class:"filter-input"},{default:c(()=>[e(n,{label:"業務1",value:"sales1"}),e(n,{label:"業務2",value:"sales2"}),e(n,{label:"業務3",value:"sales3"})]),_:1},8,["modelValue"]),e(f,{modelValue:o.filters.customerName,"onUpdate:modelValue":t[2]||(t[2]=a=>o.filters.customerName=a),placeholder:"客戶名稱",class:"filter-input"},null,8,["modelValue"])]),e(b,null,{default:c(()=>[e(h,{type:"success",onClick:t[3]||(t[3]=a=>l.dialogVisible=!0)},{default:c(()=>[I("新增帳單")]),_:1})]),_:1}),r("div",x,[e(g,{data:d.paginatedBills,style:{width:"100%"}},{default:c(()=>[e(s,{prop:"billId",label:"帳單編號",width:"150"}),e(s,{prop:"customerId",label:"客戶編號",width:"150"}),e(s,{prop:"customerName",label:"客戶名稱",width:"150"}),e(s,{prop:"transactionMode",label:"交易模式",width:"150"}),e(s,{prop:"taxId",label:"開立統編",width:"150"}),e(s,{prop:"recipientName",label:"收件人姓名",width:"150"}),e(s,{prop:"recipientTitle",label:"收件人抬頭",width:"150"}),e(s,{prop:"deliveryMethod",label:"寄送方式",width:"150"}),e(s,{prop:"deliveryAddress",label:"收件地址"}),e(s,{label:"操作"},{default:c(a=>[r("div",z,[r("i",{class:"fas fa-eye",onClick:p=>d.viewDetails(a.row)},null,8,M),r("i",{class:"fas fa-edit",onClick:p=>d.editItem(a.row)},null,8,A),r("i",{class:"fa-solid fa-trash-can",onClick:p=>d.deleteItem(a.row)},null,8,D)])]),_:1})]),_:1},8,["data"])]),e(v,{data:d.filteredBills,filters:o.filters,currentPage:o.currentPage,pageSize:o.pageSize,onPageChange:d.handlePageChange},null,8,["data","filters","currentPage","pageSize","onPageChange"])])}const G=w(T,[["render",L],["__scopeId","data-v-f82657e3"]]);export{G as default};
