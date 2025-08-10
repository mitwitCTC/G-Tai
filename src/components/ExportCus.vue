<script>
import ExcelJS from "exceljs";
import axios from "axios";

export default {
  name: "ExportCus",
  data() {
    return {
      customers: [],
      salesmenData: [],
    };
  },
  methods: {
    async getselectCUSData() {
      await axios
        .get("/apiServer/main/selectCustomer")
        .then((response) => {
          this.customers = response.data.data;
        })
        .catch((error) => {
          // 處理錯誤
          console.error("API request failed:", error);
        });
    },
    async getsalesman() {
      await axios
        .get("/apiServer/main/selectSalesman")
        .then((response) => {
          this.salesmenData = response.data.data; // 獲取到數據後將其存儲到 salesmenData
        })
        .catch((error) => {
          // 處理錯誤
          console.error("API request failed:", error);
        });
    },
    getEmployeeName(employeeId) {
      // 使用 find 方法找到對應的 employee_name
      const employee = this.salesmenData.find(
        (item) => item.employee_id === employeeId
      );
      return employee == null
        ? ""
        : employee
        ? employee.employee_name
        : "未知員工";
    },

    async exportExcel() {
      console.log("1查詢客戶資料");
      await this.getselectCUSData();
      console.log("1結束");
      console.log("2查詢業務");
      await this.getsalesman();
      console.log("2結束");
      console.log("3 匯出");
      try {
        const statusMap = {
          N: "未解約",
          S: "暫停",
          Y: "解約",
        };
        const industryMap = {
          1: "食品飲料",
          2: "傢飾傢俱家電",
          3: "石油化學",
          4: "五金製造",
          5: "電力機械",
          6: "營建土木工程",
          7: "紙業製造",
          8: "金屬製造",
          9: "大眾運輸",
          10: "橡膠塑膠",
          11: "物流倉儲",
          12: "礦業土石",
          13: "資訊科技",
          14: "文教類",
          15: "傳播類",
          16: "環境衛生",
          17: "生技醫療",
          18: "電子科技",
          19: "綜合工商",
          20: "汽機車買賣維修",
        }; // 產業類別對應的映射
        const regionMap = {
          1: "1.北、北、基、宜",
          2: "2.中、彰、投",
          3: "3.桃、竹、苗",
          4: "4.雲、嘉、南",
          5: "5.高、屏、澎",
          6: "6.花、東",
        }; // 區域對應的映射

        // 確保資料先完成取得
        const workbook = new ExcelJS.Workbook();
        const fr = new FileReader();
        const response = await fetch(
          new URL("@/assets/客戶資料.xlsx", import.meta.url).href
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
        this.customers.forEach((data, index) => {
          const rowIndex = index + 2; // 從 A2 開始
          worksheet.getCell(`A${rowIndex}`).value = data.cus_code || "";
          worksheet.getCell(`B${rowIndex}`).value = data.cus_name || "";
          worksheet.getCell(`C${rowIndex}`).value =
            statusMap[data.contract_status] || "";
          worksheet.getCell(`D${rowIndex}`).value = data.vat_number || "";
          worksheet.getCell(`E${rowIndex}`).value = data.front_pwd || "";
          worksheet.getCell(`F${rowIndex}`).value = data.virtual_account || "";
          worksheet.getCell(`G${rowIndex}`).value = data.submission_date || "";
          worksheet.getCell(`H${rowIndex}`).value = data.contract_start || "";
          worksheet.getCell(`I${rowIndex}`).value = data.contract_end || "";
          worksheet.getCell(`J${rowIndex}`).value =
            data.transaction_mode == "1"
              ? "儲值"
              : data.transaction_mode == "2"
              ? "月結"
              : "未知" || "";
          worksheet.getCell(`K${rowIndex}`).value = data.transaction_mode == "2" ? data.remittance_date :  "";
          
          worksheet.getCell(`L${rowIndex}`).value = data.transaction_mode == "1" ? data.low_balance_notice :  "";
          worksheet.getCell(`M${rowIndex}`).value = data.fuel_grace_limit || "";
          worksheet.getCell(`N${rowIndex}`).value = data.deposit || "";
          worksheet.getCell(`O${rowIndex}`).value =
            data.special_invoice == "0"
              ? "一般開立"
              : data.special_invoice == "1"
              ? "特殊開立"
              : "未知" || "";
          worksheet.getCell(`P${rowIndex}`).value =
            regionMap[data.region] || "";
          worksheet.getCell(`Q${rowIndex}`).value =
            industryMap[data.industry] || "";       
          worksheet.getCell(`R${rowIndex}`).value = data.est_fuel_volume || "";
          worksheet.getCell(`S${rowIndex}`).value =
            data.card_other_fee == 0
              ? "不收取"
              : data.card_other_fee == 1
              ? "另外收取"
              : "未知" || "";
          worksheet.getCell(`T${rowIndex}`).value = data.card_fee || "";
          worksheet.getCell(`U${rowIndex}`).value = data.reissue_fee || "";
          worksheet.getCell(`V${rowIndex}`).value = data.card_fee_notes || "";
          worksheet.getCell(`W${rowIndex}`).value = data.phone || "";
          worksheet.getCell(`X${rowIndex}`).value = data.fax || "";
          worksheet.getCell(`Y${rowIndex}`).value = data.reg_address || "";
          worksheet.getCell(`Z${rowIndex}`).value = data.mail_address || "";
          worksheet.getCell(`AA${rowIndex}`).value = data.invoice_notes || "";
          worksheet.getCell(`AB${rowIndex}`).value = data.con_notes || "";
          worksheet.getCell(`AC${rowIndex}`).value = data.contract_notes || "";
          worksheet.getCell(`AD${rowIndex}`).value =
            this.getEmployeeName(data.contract_sales) || "";
          worksheet.getCell(`AE${rowIndex}`).value =
            this.getEmployeeName(data.salesmanId) || "";
          worksheet.getCell(`AF${rowIndex}`).value = data.sales_notes || "";
          worksheet.getCell(`AG${rowIndex}`).value = data.config_notes || "";
          worksheet.getCell(`AH${rowIndex}`).value = data.month_gas || "";
          worksheet.getCell(`AI${rowIndex}`).value = data.month_balance || "";
          worksheet.getCell(`AJ${rowIndex}`).value = data.createTime || "";
          worksheet.getCell(`AK${rowIndex}`).value = data.updateTime || "";
        });
        worksheet.getColumn(25).width = 60;
        worksheet.getColumn(26).width = 60;
        worksheet.getColumn(33).width = 90;
        // worksheet.getColumn(3).width = 60;
        // worksheet.getColumn(10).width = 28;
        // worksheet.getColumn(11).width = 60;
        // 生成下載鏈接並觸發下載
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `客戶資料.xlsx`; // 設定下載檔案名
        link.click();
        console.log("3結束");
      } catch (error) {
        console.error("Error during export to Excel:", error);
      }
    },
  },
};
</script>
