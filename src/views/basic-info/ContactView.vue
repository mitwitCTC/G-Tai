<template>
    <bar/>
    <div class="page-title"><h2>{{ pageTitle }}</h2></div>
    <div>
        <el-input v-model="customerName" placeholder="客戶名稱" class="custom-select" ></el-input>
        <el-form-item>
          <el-button type="success" @click="dialogVisible = true">發新訊息</el-button>
          <el-button type="success" @click="dialogVisible = true">新增聯絡人</el-button>
        </el-form-item>
        <el-table :data="filteredContacts" style="width: 100%">
          <el-table-column prop="contactId" label="聯絡人編號" width="150" />
          <el-table-column prop="contactName" label="聯絡人姓名" width="150" />
          <el-table-column prop="customerId" label="客戶編號" width="150" />
          <el-table-column prop="customerName" label="客戶名稱" width="150" />
          <el-table-column prop="contactTitle" label="聯絡人抬頭" width="150" />
          <el-table-column prop="contactNickname" label="聯絡人暱稱" width="150" />
          <el-table-column prop="contactPhone" label="聯絡電話" width="150" />
          <el-table-column prop="notificationMethod" label="通知方式" width="150" />
          <el-table-column prop="contactInfo" label="聯絡資訊"  />
      </el-table>
  </div>
</template>
 
 <script>
import bar from '@/components/bar.vue'
export default {
  components: {
    bar
  },
  data() {
    return {
        customerName: '',
      contacts: [
        {
          contactId: '001',
          contactName: '張三',
          customerId: 'A001',
          customerName: '客戶A',
          contactTitle: '經理',
          contactNickname: '小張',
          contactPhone: '12345678',
          notificationMethod: 'Email',
          contactInfo: 'email@example.com'
        },
        {
          contactId: '002',
          contactName: '李四',
          customerId: 'A002',
          customerName: '客戶B',
          contactTitle: '主任',
          contactNickname: '小李',
          contactPhone: '87654321',
          notificationMethod: 'Phone',
          contactInfo: '87654321'
        }
      ],
    };
  },
  computed: {
      filteredContacts() {
        return this.contacts.filter(contact => {
          return contact.customerName.includes(this.customerName);
        });
      }
    }
};
</script>

<style scoped>
.page-title {
    margin-top: 30px; 
    margin-bottom: 30px; 
 }
.custom-select {
  width: 200px; /* 調整寬度 */
  height: 40px; /* 調整高度 */
  margin-bottom: 20px;
 }

</style>