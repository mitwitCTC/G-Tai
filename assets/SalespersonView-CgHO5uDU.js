import{_ as h,L as w,a as y,b as t,d as o,t as g,w as i,F as v,r as l,o as C,e as V,p as B,f as k}from"./index-_xWReBu9.js";import{B as S}from"./BreadCrumb-O5_Vi-rn.js";import{T as I}from"./TablePaginated-D-PO2dcn.js";const T={components:{BreadCrumb:S,ListBar:w,TablePaginated:I},data(){return{filters:{salesperson:""},selses:[{employee_id:"GF-012",employee_name:"湯惠誠",job_title:"業務",department_code:"C01",department:"業務部"},{employee_id:"GF-010",employee_name:"展億活動整合有限公司",job_title:"業務",department_code:"C02",department:"經銷商"}],currentPage:1,pageSize:10}},computed:{},methods:{viewDetails(e){console.log("View details for:",e),this.$router.push({path:"SelectView",query:{rowType:"6"}})},editItem(e){console.log("Edit item:",e),this.$router.push({path:"UpdateView",query:{rowType:"6"}})},deleteItem(e){console.log("Delete item:",e)}}},x=e=>(B("data-v-b3c096bd"),e=e(),k(),e),D={class:"page-title"},F={class:"table-container"},L={class:"action-icons"},$=["onClick"],j=["onClick"],N=["onClick"],P=x(()=>o("div",{class:"pagination-info"}," Showing 1 to 2 of 2 ",-1));function q(e,n,E,G,r,p){const c=l("ListBar"),_=l("BreadCrumb"),m=l("el-input"),u=l("el-button"),f=l("el-form-item"),s=l("el-table-column"),b=l("el-table");return C(),y(v,null,[t(c),o("div",D,[o("h2",null,g(e.pageTitle),1)]),o("div",null,[t(_,{isSpecialPage:!0})]),t(m,{modelValue:r.filters.salesperson,"onUpdate:modelValue":n[0]||(n[0]=a=>r.filters.salesperson=a),placeholder:"查詢業務姓名",style:{width:"225px"}},null,8,["modelValue"]),t(f,null,{default:i(()=>[t(u,{type:"success",onClick:n[1]||(n[1]=a=>e.dialogVisible=!0)},{default:i(()=>[V("新增")]),_:1})]),_:1}),o("div",F,[t(b,{data:r.selses,style:{width:"100%"}},{default:i(()=>[t(s,{prop:"employee_id",label:"員工編號"}),t(s,{prop:"employee_name",label:"員工姓名"}),t(s,{prop:"job_title",label:"職稱"}),t(s,{prop:"department_code",label:"部門代號"}),t(s,{prop:"department",label:"部門名稱"}),t(s,{label:"操作"},{default:i(a=>[o("div",L,[o("i",{class:"fas fa-eye",onClick:d=>p.viewDetails(a.row)},null,8,$),o("i",{class:"fas fa-edit",onClick:d=>p.editItem(a.row)},null,8,j),o("i",{class:"fa-solid fa-trash-can",onClick:d=>p.deleteItem(a.row)},null,8,N)])]),_:1})]),_:1},8,["data"])]),P],64)}const H=h(T,[["render",q],["__scopeId","data-v-b3c096bd"]]);export{H as default};
