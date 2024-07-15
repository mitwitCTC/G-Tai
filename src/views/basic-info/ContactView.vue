<template>
    <bar/>
    <div class="page-title"><h2>{{ pageTitle }}</h2></div>
    <div>
        <el-input v-model="customerName" placeholder="客戶名稱" class="custom-select" ></el-input>
        <el-form-item>
          <el-button type="success" @click="dialogM = true">發新訊息</el-button>
          <el-button type="success" @click="dialogP = true">新增聯絡人</el-button>
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
      <!-- 新增聯絡人 -->
      <el-dialog title="新增聯絡人" v-model="dialogP" width="50%">
    <el-form :model="form" label-width="120px">
      <el-form-item label="聯絡人姓名">
        <el-input v-model="form.contactName" class="small-input"></el-input>
      </el-form-item>
      <el-form-item label="客戶編號">
        <el-input v-model="form.customerId" class="small-input"></el-input>
      </el-form-item>
      <el-form-item label="客戶名稱">
        <el-input v-model="form.customerName" class="small-input"></el-input>
      </el-form-item>
      <el-form-item label="聯絡人抬頭">
        <el-input v-model="form.contactTitle" class="small-input"></el-input>
      </el-form-item>
      <el-form-item label="聯絡人職稱">
        <el-input v-model="form.contactPosition" class="small-input"></el-input>
      </el-form-item>
      <el-form-item label="聯絡人電話">
        <el-input v-model="form.contactPhone" class="small-input"></el-input>
      </el-form-item>
      <el-form-item label="通知方式">
        <el-select v-model="form.notificationMethod" placeholder="請選擇通知方式" class="small-input">
          <el-option label="Email" value="Email"></el-option>
          <el-option label="電話" value="Phone"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通知資訊">
        <el-input v-model="form.notificationInfo"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogP = false">取消</el-button>
      <el-button type="primary" @click="saveContact">送出</el-button>
    </div>
  </el-dialog>
  <!-- 發新訊息 -->
  <el-dialog title="發送新訊息" v-model="dialogM" :width="dialogWidth">
    <el-form :model="form" label-width="120px">
      <el-form-item label="聯絡人姓名">
        <el-select v-model="form.contacts" multiple placeholder="請選擇聯絡人">
          <el-option v-for="contact in contacts" :key="contact.contactId" :label="contact.contactName" :value="contact.contactName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="訊息主旨">
        <el-input v-model="form.subject"></el-input>
      </el-form-item>
      <el-form-item label="訊息內容">
        <el-input type="textarea" v-model="form.content"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogM = false">取消</el-button>
      <el-button type="primary" @click="sendMessage">送出</el-button>
    </div>
  </el-dialog>
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
      dialogP:false,
      dialogM:false,
      customerName: '',
      form: {
        contactName: '',
        customerId: '',
        customerName: '',
        contactTitle: '',
        contactPosition: '',
        contactPhone: '',
        notificationMethod: '',
        notificationInfo: ''
      },
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
 .small-input {
  width: 200px; /* 调整宽度 */
}

</style>