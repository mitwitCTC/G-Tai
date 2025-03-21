<script>
import ExcelJS from "exceljs";

export default {
  name: "ExportSelCard",
  data() {
    return {
    };
  },
  methods: {
    async exportExcel(cus_code, cus_name, carddata) {
      this.cus_code = cus_code;
      this.cus_name = cus_name;
      try {
        // 確保資料先完成取得
        const workbook = new ExcelJS.Workbook();
        const fr = new FileReader();
        const response = await fetch(
          new URL("@/assets/車籍資料表.xlsx", import.meta.url).href
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
        carddata.forEach((data, index) => {
          const rowIndex = index + 2; // 從 A2 開始
          worksheet.getCell(`A${rowIndex}`).value = data.customerId || "";
          worksheet.getCell(`B${rowIndex}`).value = data.cus_name || "";
          worksheet.getCell(`C${rowIndex}`).value = data.acc_name || "";
          worksheet.getCell(`D${rowIndex}`).value = data.use_number || "";
          worksheet.getCell(`E${rowIndex}`).value = data.license_plate || "";
          worksheet.getCell(`F${rowIndex}`).value =
            data.card_type === "1"
              ? "尿素"
              : data.card_type === "2"
              ? "柴油"
              : data.card_type === "3"
              ? "汽油"
              : data.card_type === "4"
              ? "諾瓦尿素"
              : data.card_type || "";
          worksheet.getCell(`G${rowIndex}`).value = data.card_number || "";
          worksheet.getCell(`H${rowIndex}`).value = data.upload_reason || "";
          worksheet.getCell(`I${rowIndex}`).value =
            data.card_arrival_date || "";
          worksheet.getCell(`J${rowIndex}`).value = data.card_stop_date || "";
          worksheet.getCell(`K${rowIndex}`).value = data.del || "";
          worksheet.getCell(`L${rowIndex}`).value = data.notes || "";
        });
        worksheet.getColumn(2).width = 50;
        worksheet.getColumn(3).width = 60;
        worksheet.getColumn(12).width = 80;
        // 生成下載鏈接並觸發下載
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${this.cus_code}_${this.cus_name}_車籍資料表.xlsx`; // 設定下載檔案名
        link.click();
      } catch (error) {
        console.error("Error during export to Excel:", error);
      }
    },
  },
};
</script>
