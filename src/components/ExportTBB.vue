<script>
import ExcelJS from "exceljs";
import axios from "axios";

export default {
  name: "ExportTBB",
  data() {
    return {};
  },
  methods: {
    async exportExcel(Alldata) {
      const rows = Alldata;
      console.log("匯出");
      try {
        // 確保資料先完成取得
        const workbook = new ExcelJS.Workbook();
        const fr = new FileReader();
        const response = await fetch(
          new URL("@/assets/銀行匯出.xlsx", import.meta.url).href
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
        rows.forEach((contact, index) => {
          const rowIndex = index + 2; // 從 A2 開始
          worksheet.getCell(`A${rowIndex}`).value = contact.id || "";
          worksheet.getCell(`B${rowIndex}`).value = contact.customerId || "";
          worksheet.getCell(`C${rowIndex}`).value = contact.cus_name || "";
          worksheet.getCell(`D${rowIndex}`).value = contact.bank || "";
          worksheet.getCell(`E${rowIndex}`).value = contact.account_time || "";
          worksheet.getCell(`F${rowIndex}`).value = contact.taxId || "";
          worksheet.getCell(`G${rowIndex}`).value = contact.remark || "";
          worksheet.getCell(`H${rowIndex}`).value = contact.checkoutTime || "";
          worksheet.getCell(`I${rowIndex}`).value = contact.acc_trade || "";
          worksheet.getCell(`J${rowIndex}`).value = parseFloat(contact.amount); // 轉數值
          worksheet.getCell(`J${rowIndex}}`).numFmt = "#,##0"; // 千分位格式
        });
        worksheet.getColumn(3).width = 60;
        // 生成下載鏈接並觸發下載
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `銀行交易匯出.xlsx`; // 設定下載檔案名
        link.click();
        console.log("結束");
      } catch (error) {
        console.error("Error during export to Excel:", error);
      }
    },
  },
};
</script>
