<script>
import ExcelJS from "exceljs";

export default {
  name: "Export_Data",
  data() {
    return {};
  },
  methods: {
    async Export_Data(type, postdata, res) {
      const excelConfig = {
        1: {
          headers: ["業務員", "客戶代號", "公司名稱", "簽呈日期"],
          keys: ["employee_name", "customerId", "cus_name", "submission_date"],
        },
        2: {
          headers: ["業務員", "客戶代號", "公司名稱", "停油日期", "本月用油金額", "目前餘額", "當月停油次數"],
          keys: ["employee_name", "customerId", "cus_name", "group_concat(a.salesDate)", "sum(a.salesAmount)", "month_balance", "sum(a.notify_lock)"],
        },
        3: {
          headers: ["業務員", "客戶代號", "公司名稱", "車輛數", "去年同期用油", "去年同期日均", "上個月用油", "上月日均", "本月用油", "本月日均", "下滑百分比"],
          keys: ["employee_name", "cus_code", "cus_name", "qu_preyear", "fu_preyear", "a.fu_preyear/30", "qu_preMonth", "fu_preMonth", "b.fu_preMonth/30", "qu_Month", "fu_Month", "c.fu_Month/30"],
        },
        4: {
          headers: ["業務員", "客戶代號", "公司名稱", "車輛數", "簽呈日期"],
          keys: ["employee_name", "customerId", "cus_name", "count(c.license_plate)", "submission_date"],
        },
        5: {
          headers: ["業務員", "總申請車輛數", "柴油車", "汽油車", "柴油油桶卡", "汽油油桶卡"],
          keys: ["employee_name", "sum_count", "柴油總數", "汽油總數", "柴油桶數", "汽油桶數"],
        },
        6: {
          headers: ["業務員", "客戶代號", "公司名稱", "擔保品押金", "備註", "款項繳費期限(日)", "本期用油", "已付款金額"],
          keys: ["employee_name", "cus_code", "cus_name", "config_notes", "contract_notes","remittance_date", "本期用油", "已付款金額"],
        },
        7: {
          headers: ["業務員", "客戶代號", "公司名稱", "國光尿素量", "諾瓦尿素量"],
          keys: ["employee_name", "cus_code", "cus_name", "fuel_volume_CPC", "fuel_volume"],
        },
        8: {
          headers: ["業務員", "客戶代號", "公司名稱", "車號"],
          keys: ["employee_name", "customerId", "cus_name", "license_plate"],
        },
        9: {
          headers: ["業務員", "汽油量", "柴油量", "國光尿素量", "諾瓦尿素量"],
          keys: ["employee_name", "汽油量", "柴油量", "國光尿素量", "諾瓦尿素量"],
        },
        10: {
          headers: ["加油站站名", "汽油量", "柴油量", "國光尿素量", "諾瓦尿素量"],
          keys: ["station_name", "汽油量", "柴油量", "國光尿素量", "諾瓦尿素量"],
        },
      };
      try {
        const workbook = new ExcelJS.Workbook();
        const fr = new FileReader();
        const response = await fetch(
          new URL("@/assets/匯出報表.xlsx", import.meta.url).href
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

        const config = excelConfig[type]; // type 是你選的 type
        config.headers.forEach((header, i) => {
          const col = String.fromCharCode(65 + i); // A,B,C...
          worksheet.getCell(`${col}1`).value = header;
        });
        res.data.forEach((data, index) => {
          const rowIndex = index + 2; // 從第 2 列開始
          config.keys.forEach((key, i) => {
            const col = String.fromCharCode(65 + i);

            // 特殊欄位轉換，例如 contract_status
            let value = data[key];
            if (key === "contract_status") {
              value = statusMap[value] || "";
            }

            worksheet.getCell(`${col}${rowIndex}`).value = value || "";
          });
        });

        // worksheet.getColumn(3).width = 60;
        // worksheet.getColumn(10).width = 28;
        // worksheet.getColumn(11).width = 60;
        // 生成下載鏈接並觸發下載
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${res.message}.xlsx`; // 設定下載檔案名
        link.click();
      } catch (error) {
        console.error("Error during export to Excel:", error);
      }
    },
  },
};
</script>
