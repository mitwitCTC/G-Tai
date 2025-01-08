<script>
import ExcelJS from "exceljs";
import axios from "axios";

export default {
  name: "ExportContact",
  data() {
    return {
      customers: [],
      // contact: [],
      Salesman: [],
      Allexport: [],
    };
  },
  methods: {
    async getselectCUSData() {
      try {
        // 發送 GET 請求到指定的 API
        const response = await axios.get(
          "http://122.116.23.30:3347/main/selectCustomer"
        );
        const customerData = response.data.data;
        // 將資料放入 customers 陣列中
        this.customers = customerData;
        this.customers.push(
          ...customerData.filter((customer) => customer.cus_code !== "G1308719")
        );
        this.customers.sort((a, b) => {
          // 字串排序（假設 customerId 是字串，根據字典順序）
          return a.cus_code.localeCompare(b.cus_code);
        });
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    // async getselectCUSData() {
    //   try {
    //     // 發送 GET 請求到指定的 API
    //     const response = await axios.get(
    //       "http://122.116.23.30:3347/main/selectCustomer"
    //     );
    //     const customerData = response.data.data;
    //     // 將資料放入 customers 陣列中
    //     this.customers = customerData;
    //     this.customers.sort((a, b) => {
    //       // 字串排序（假設 customerId 是字串，根據字典順序）
    //       return a.cus_code.localeCompare(b.cus_code);
    //     });
    //   } catch (error) {
    //     console.error("Error fetching customer data:", error);
    //   }
    // },
    // async getselectCONData() {
    //   try {
    //     // 發送 GET 請求到指定的 API
    //     const response = await axios.get(
    //       "http://122.116.23.30:3347/main/selectContact"
    //     );
    //     const contactData = response.data.data;
    //     // 將資料放入 customers 陣列中
    //     this.contact = contactData.filter(
    //       (contact) => contact.billNotify === "1"
    //     );
    //     this.contact.sort((a, b) => {
    //       // 字串排序（假設 customerId 是字串，根據字典順序）
    //       return a.customerId.localeCompare(b.customerId);
    //     });
    //     console.log(this.contact.length)
    //   } catch (error) {
    //     console.error("Error fetching customer data:", error);
    //   }
    // },
    async getselectSalData() {
      try {
        // 發送 GET 請求到指定的 API
        const response = await axios.get(
          "http://122.116.23.30:3347/main/selectSalesman"
        );
        this.Salesman = response.data.data;
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    async doData() {
      this.Allexport = this.customers.map((contact) => {
        // 2. 找到對應的銷售人員名稱
        const salesman = this.Salesman.find(
          (s) => s.employee_id === contact.salesmanId
        );

        // 3. 將資料組合起來，並新增 salesman 屬性
        return {
          ...contact,
          salesman: salesman ? salesman.employee_name : null, // 如果找不到則為 null
        };
      });
    },
    // async doData() {
    //   this.Allexport = this.contact.map((contact) => {
    //     // 1. 找到對應的客戶資料
    //     const customer = this.customers.find(
    //       (c) => c.cus_code === contact.customerId
    //     );
    //     const cus_code = customer ? customer.cus_code : "";
    //     const cus_name = customer ? customer.cus_name : "";
    //     const salesmanId = customer ? customer.salesmanId : "";
    //     const mail_address = customer ? customer.mail_address : "";

    //     // 2. 找到對應的銷售人員資料
    //     const salesman = this.Salesman.find(
    //       (s) => s.employee_id === salesmanId
    //     );
    //     const employee_name = salesman ? salesman.employee_name : "";

    //     // 3. 將資料組合起來
    //     return {
    //       ...contact,
    //       cus_code,
    //       cus_name,
    //       salesmanId,
    //       mail_address,
    //       employee_name,
    //     };
    //   });
    // },
    async exportExcel() {
      console.log("1查詢客戶資料");
      await this.getselectCUSData();
      console.log("1結束");
      // console.log("2查詢聯絡人資料");
      // await this.getselectCONData();
      // console.log("2結束");
      console.log("3查詢業務資料");
      await this.getselectSalData();
      console.log("3結束");
      console.log("4組成資料");
      await this.doData();
      console.log("4結束");
      console.log("5 匯出");
      try {
        // 確保資料先完成取得
        const workbook = new ExcelJS.Workbook();
        const fr = new FileReader();
        const response = await fetch(
          new URL("@/assets/郵寄明細報表.xlsx", import.meta.url).href
        );
        const data = await response.blob(); // 轉為 Blob

        // 等待 FileReader onload 完成
        const arrayBuffer = await new Promise((resolve, reject) => {
          const fr = new FileReader();
          fr.onload = (ev) => resolve(ev.target.result); // 當完成時，resolve 結果
          fr.onerror = (err) => reject(err); // 發生錯誤時，reject 錯誤
          fr.readAsArrayBuffer(data);
        });

        // 使用 arrayBuffer 讀取 Excel
        await workbook.xlsx.load(arrayBuffer);
        const worksheet = workbook.worksheets[0]; // 取得第一個工作表

        // 開始填充資料
        this.Allexport.forEach((contact, index) => {
          const rowIndex = index + 2; // 從 A2 開始
          worksheet.getCell(`A${rowIndex}`).value = contact.cus_code || ""; // 插入 customerId
          worksheet.getCell(`B${rowIndex}`).value = contact.cus_name || "";
          worksheet.getCell(`C${rowIndex}`).value = contact.mail_address || "";
          worksheet.getCell(`D${rowIndex}`).value = contact.salesman || "";
        });
        worksheet.getColumn(2).width = 50;
        worksheet.getColumn(3).width = 60;

        // 生成下載鏈接並觸發下載
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `郵寄明細報表.xlsx`; // 設定下載檔案名
        link.click();

        console.log("5結束");
      } catch (error) {
        console.error("Error during export to Excel:", error);
      }
    },
  },
};
</script>
