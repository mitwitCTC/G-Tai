<template>
  <h1>{{ text }}</h1>
  <routerLink to="basic-info/customer">客戶資料維護</routerLink>
  <routerLink to="basic-info/contact">聯絡人資料維護</routerLink>
  <routerLink to="basic-info/bill">帳單資料維護</routerLink>
  <routerLink to="basic-info/vehicle">車籍資料維護</routerLink>
  <routerLink to="basic-info/communication-records">通訊記錄維護</routerLink>
  <routerLink to="basic-info/salesperson">業務員資料維護</routerLink>
  <routerLink to="basic-info/supplier">供應商資料維護</routerLink>
</template>

<script>
export default {
  data() {
    return {
      text: "test",
    };
  },
};
</script>
