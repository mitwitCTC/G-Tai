import{_ as f,b as g,a as _,d as e,e as o,t as V,w as d,r as i,o as P,g as T}from"./index-DNJi1kpX.js";import{B as v}from"./Breadcrumb-_9Oi8sHb.js";import{T as N}from"./TablePaginated-BLO8FNLw.js";const w={components:{Breadcrumb:v,bar:g,TablePaginated:N},data(){return{filters:{billGroup:"",customerName:""},vehicles:[{vehicleId:"V001",licensePlate:"ABC-123",customerName:"客戶A",billId:"B001",cardNumber:"12345678",cardType:"信用卡",fuelType:"汽油",cardStartDate:"2023-01-01",cardEndDate:"2024-01-01",vehicleType:"轎車"},{vehicleId:"V002",licensePlate:"XYZ-789",customerName:"客戶B",billId:"B002",cardNumber:"87654321",cardType:"加油卡",fuelType:"柴油",cardStartDate:"2023-02-01",cardEndDate:"2024-02-01",vehicleType:"貨車"}],currentPage:1,pageSize:10}},computed:{filteredVehicles(){return this.vehicles.filter(l=>l.customerName.includes(this.filters.customerName)&&(this.filters.billGroup?l.billId.includes(this.filters.billGroup):!0))},paginatedVehicles(){const l=(this.currentPage-1)*this.pageSize,a=l+this.pageSize;return this.filteredVehicles.slice(l,a)}},methods:{handlePageChange(l){this.currentPage=l}}},y={class:"page-title"},B={class:"filters"};function S(l,a,C,I,r,n){const p=i("bar"),u=i("Breadcrumb"),c=i("el-input"),m=i("el-button"),t=i("el-table-column"),h=i("el-table"),b=i("TablePaginated");return P(),_("div",null,[e(p),o("div",y,[o("h2",null,V(l.pageTitle),1)]),o("div",null,[e(u,{isSpecialPage:!0})]),o("div",B,[e(c,{modelValue:r.filters.billGroup,"onUpdate:modelValue":a[0]||(a[0]=s=>r.filters.billGroup=s),placeholder:"帳單組別",class:"filter-input"},null,8,["modelValue"]),e(c,{modelValue:r.filters.customerName,"onUpdate:modelValue":a[1]||(a[1]=s=>r.filters.customerName=s),placeholder:"客戶名稱",class:"filter-input"},null,8,["modelValue"])]),e(m,{type:"success",onClick:a[2]||(a[2]=s=>l.dialogVisible=!0)},{default:d(()=>[T("新增車籍")]),_:1}),e(h,{data:n.paginatedVehicles,style:{width:"100%"}},{default:d(()=>[e(t,{prop:"vehicleId",label:"車籍編號",width:"150"}),e(t,{prop:"licensePlate",label:"車牌號碼",width:"150"}),e(t,{prop:"customerName",label:"客戶名稱",width:"150"}),e(t,{prop:"billId",label:"帳單編號",width:"150"}),e(t,{prop:"cardNumber",label:"卡號",width:"150"}),e(t,{prop:"cardType",label:"卡片類別",width:"150"}),e(t,{prop:"fuelType",label:"使用油品",width:"150"}),e(t,{prop:"cardStartDate",label:"到卡日期",width:"150"}),e(t,{prop:"cardEndDate",label:"停卡日期",width:"150"}),e(t,{prop:"vehicleType",label:"車輛型態"})]),_:1},8,["data"]),e(b,{data:n.filteredVehicles,filters:r.filters,currentPage:r.currentPage,pageSize:r.pageSize,onPageChange:n.handlePageChange},null,8,["data","filters","currentPage","pageSize","onPageChange"])])}const E=f(w,[["render",S],["__scopeId","data-v-e4f6da1e"]]);export{E as default};
