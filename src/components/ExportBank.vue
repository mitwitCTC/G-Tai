<script>
import ExcelJS from "exceljs";
import axios from "axios";

export default {
  name: "ExportCus",
  data() {
    return {
    };
  },
  methods: {
    async exportExcel(allexport) {
      try {
        console.log("匯出");
        // 確保資料先完成取得
        const workbook = new ExcelJS.Workbook();
        const fr = new FileReader();
        const response = await fetch(
          new URL("@/assets/刷卡帳務.xlsx", import.meta.url).href
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
        allexport.forEach((data, index) => {
          const rowIndex = index + 2; // 從 A2 開始
          worksheet.getCell(`A${rowIndex}`).value = data.customerId || "";
          worksheet.getCell(`B${rowIndex}`).value = data.cus_name || "";
          worksheet.getCell(`C${rowIndex}`).value = data.account || "";
          // worksheet.getCell(`C${rowIndex}`).value =
          //   statusMap[data.contract_status] || "";
          worksheet.getCell(`D${rowIndex}`).value = data.account_date || "";
          worksheet.getCell(`E${rowIndex}`).value = data.issuing_bank || "";
          worksheet.getCell(`F${rowIndex}`).value = data.remark || "";
          worksheet.getCell(`G${rowIndex}`).value = Number(data.credit_amount) || "";
          worksheet.getCell(`H${rowIndex}`).value = data.credit_percent || "";
          worksheet.getCell(`I${rowIndex}`).value = Number(data.handling_fee) || "";
          worksheet.getCell(`J${rowIndex}`).value = Number(data.bank_amount) || "";
          worksheet.getCell(`K${rowIndex}`).value = data.credit_card_data || "";
          worksheet.getCell(`L${rowIndex}`).value = Number(data.amount) || "";
        });
        // worksheet.getColumn(2).width = 50;
        // worksheet.getColumn(3).width = 60;
        // worksheet.getColumn(10).width = 28;
        // worksheet.getColumn(11).width = 60;
        // 生成下載鏈接並觸發下載
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `刷卡帳務.xlsx`; // 設定下載檔案名
        link.click();
        console.log("結束");
      } catch (error) {
        console.error("Error during export to Excel:", error);
      }
    },
  },
};
</script>
