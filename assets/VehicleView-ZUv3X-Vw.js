import{_,L as g,a as w,b as e,d as r,t as V,w as c,r as o,o as v,f as y}from"./index-CYAkYwdq.js";import{B as C}from"./BreadCrumb-Dnj3TL7W.js";import{T as P}from"./TablePaginated-R9pAQJxC.js";const T={components:{BreadCrumb:C,ListBar:g,TablePaginated:P},data(){return{filters:{billGroup:"",customerName:""},vehicles:[{vehicleId:"V001",licensePlate:"ABC-123",customerName:"客戶A",billId:"B001",cardNumber:"12345678",cardType:"信用卡",fuelType:"汽油",cardStartDate:"2023-01-01",cardEndDate:"2024-01-01",vehicleType:"轎車"},{vehicleId:"V002",licensePlate:"XYZ-789",customerName:"客戶B",billId:"B002",cardNumber:"87654321",cardType:"加油卡",fuelType:"柴油",cardStartDate:"2023-02-01",cardEndDate:"2024-02-01",vehicleType:"貨車"}],currentPage:1,pageSize:10}},computed:{filteredVehicles(){return this.vehicles.filter(t=>t.customerName.includes(this.filters.customerName)&&(this.filters.billGroup?t.billId.includes(this.filters.billGroup):!0))},paginatedVehicles(){const t=(this.currentPage-1)*this.pageSize,a=t+this.pageSize;return this.filteredVehicles.slice(t,a)}},methods:{handlePageChange(t){this.currentPage=t},viewDetails(t){console.log("View details for:",t),this.$router.push({path:"SelectView",query:{rowType:"5"}})},editItem(t){console.log("Edit item:",t),this.$router.push({path:"UpdateView",query:{rowType:"5",customerName:t.customerName}})},deleteItem(t){console.log("Delete item:",t)}}},N={class:"page-title"},B={class:"filters"},I={class:"action-icons"},S=["onClick"],D=["onClick"],k=["onClick"];function z(t,a,E,G,s,n){const p=o("ListBar"),m=o("BreadCrumb"),d=o("el-input"),h=o("el-button"),l=o("el-table-column"),f=o("el-table"),b=o("TablePaginated");return v(),w("div",null,[e(p),r("div",N,[r("h2",null,V(t.pageTitle),1)]),r("div",null,[e(m,{isSpecialPage:!0})]),r("div",B,[e(d,{modelValue:s.filters.billGroup,"onUpdate:modelValue":a[0]||(a[0]=i=>s.filters.billGroup=i),placeholder:"帳單組別",class:"filter-input"},null,8,["modelValue"]),e(d,{modelValue:s.filters.customerName,"onUpdate:modelValue":a[1]||(a[1]=i=>s.filters.customerName=i),placeholder:"客戶名稱",class:"filter-input"},null,8,["modelValue"])]),e(h,{type:"success",onClick:a[2]||(a[2]=i=>t.dialogVisible=!0)},{default:c(()=>[y("新增車籍")]),_:1}),e(f,{data:n.paginatedVehicles,style:{width:"100%"}},{default:c(()=>[e(l,{prop:"vehicleId",label:"車籍編號",width:"150"}),e(l,{prop:"licensePlate",label:"車牌號碼",width:"150"}),e(l,{prop:"customerName",label:"客戶名稱",width:"150"}),e(l,{prop:"billId",label:"帳單編號",width:"150"}),e(l,{prop:"cardNumber",label:"卡號",width:"150"}),e(l,{prop:"cardType",label:"卡片類別",width:"150"}),e(l,{prop:"fuelType",label:"使用油品",width:"150"}),e(l,{prop:"cardStartDate",label:"到卡日期",width:"150"}),e(l,{prop:"cardEndDate",label:"停卡日期",width:"150"}),e(l,{prop:"vehicleType",label:"車輛型態"}),e(l,{label:"操作"},{default:c(i=>[r("div",I,[r("i",{class:"fas fa-eye",onClick:u=>n.viewDetails(i.row)},null,8,S),r("i",{class:"fas fa-edit",onClick:u=>n.editItem(i.row)},null,8,D),r("i",{class:"fa-solid fa-trash-can",onClick:u=>n.deleteItem(i.row)},null,8,k)])]),_:1})]),_:1},8,["data"]),e(b,{data:n.filteredVehicles,filters:s.filters,currentPage:s.currentPage,pageSize:s.pageSize,onPageChange:n.handlePageChange},null,8,["data","filters","currentPage","pageSize","onPageChange"])])}const q=_(T,[["render",z],["__scopeId","data-v-8617d17b"]]);export{q as default};
