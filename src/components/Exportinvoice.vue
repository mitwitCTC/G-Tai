<script>
import ExcelJS from "exceljs";

export default {
  name: "Exportinvoice",
  data() {
    return {};
  },
  methods: {
    async exportExcel(startdate,enddate,invoicedata) {
      try {
        // 確保資料先完成取得
        const workbook = new ExcelJS.Workbook();
        const fr = new FileReader();
        const response = await fetch(
          new URL("@/assets/發票匯出.xlsx", import.meta.url).href
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
        invoicedata.forEach((contact, index) => {
          const rowIndex = index + 2; // 從 A2 開始
          
            worksheet.getCell(`A${rowIndex}`).value =
              contact.mode === "1"
                ? "開立"
                : contact.mode === "2"
                ? "作廢"
                : "";

            worksheet.getCell(`B${rowIndex}`).value = `${
              contact.word_track || ""
            } ${contact.number || ""}`.trim();
            worksheet.getCell(`C${rowIndex}`).value = contact.customerId || "";
            worksheet.getCell(`D${rowIndex}`).value = contact.cus_name || "";
            worksheet.getCell(`E${rowIndex}`).value = contact.acc_name || "";
            worksheet.getCell(`F${rowIndex}`).value = contact.invoiceDate || "";
            worksheet.getCell(`G${rowIndex}`).value =
              Number(contact.Amount) || "";
            worksheet.getCell(`H${rowIndex}`).value = contact.Bidentifier || "";
            worksheet.getCell(`I${rowIndex}`).value = contact.BName || "";
            worksheet.getCell(`J${rowIndex}`).value = contact.InvoiceIdCount || "";
            worksheet.getCell(`K${rowIndex}`).value = contact.QuantitySum || "";
            
          
        });
        // worksheet.getColumn(2).width = 50;
        // worksheet.getColumn(3).width = 60;

        // 生成下載鏈接並觸發下載
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${startdate}~${enddate}開立發票.xlsx`; // 設定下載檔案名
        link.click();
      } catch (error) {
        console.error("Error during export to Excel:", error);
      }
    },
  },
};
</script>
