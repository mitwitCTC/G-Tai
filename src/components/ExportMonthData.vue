<script>
import ExcelJS from "exceljs";
import axios from "axios";

export default {
  name: "ExportMonthData",
  data() {
    return {};
  },
  methods: {
    async exportExcel(month, mergedData) {
      try {
        // 確保資料先完成取得
        const workbook = new ExcelJS.Workbook();
        const fr = new FileReader();
        const response = await fetch(
          new URL("@/assets/月結匯出.xlsx", import.meta.url).href
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
        mergedData.forEach((contact, index) => {
          const rowIndex = index + 2; // 從 A2 開始
          if (contact.isSummary == false) {
            worksheet.getCell(`A${rowIndex}`).value = contact.customerId || ""; // 插入 customerId
            worksheet.getCell(`B${rowIndex}`).value = contact.acc_name || "";
            worksheet.getCell(`C${rowIndex}`).value =
              contact.record_count || "";
            worksheet.getCell(`D${rowIndex}`).value = contact.className || "";
            worksheet.getCell(`E${rowIndex}`).value =
              Number(contact.fuel_volume) || "";
            worksheet.getCell(`F${rowIndex}`).value =
              Number(contact.amount) || "";
            worksheet.getCell(`G${rowIndex}`).value = contact.use_number || "";
            worksheet.getCell(`H${rowIndex}`).value =
              contact.invoice_name || "";
          } else if (contact.isSummary == true) {
            // worksheet.getCell(`A${rowIndex}`).value = contact.customerId || ""; // 插入 customerId
            worksheet.getCell(`B${rowIndex}`).value = "小計";
            worksheet.getCell(`B${rowIndex}`).font = { bold: true }; // 設定粗體
            worksheet.getCell(`C${rowIndex}`).value =
              contact.record_count || "";
            worksheet.getCell(`E${rowIndex}`).value =
              Number(contact.fuel_volume) || "";
            worksheet.getCell(`F${rowIndex}`).value =
              Number(contact.amount) || "";
            // 設定 A-H 欄框線
            ["A", "B", "C", "D", "E", "F", "G", "H"].forEach((col) => {
              worksheet.getCell(`${col}${rowIndex}`).border = {
                top: { style: "thin" },
              };
            });
          }
        });
        // worksheet.getColumn(2).width = 50;
        // worksheet.getColumn(3).width = 60;

        // 生成下載鏈接並觸發下載
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${month}_月結資料.xlsx`; // 設定下載檔案名
        link.click();
      } catch (error) {
        console.error("Error during export to Excel:", error);
      }
    },
  },
};
</script>
