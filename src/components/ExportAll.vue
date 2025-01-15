<script>
import ExcelJS from "exceljs";
import axios from "axios";

export default {
  name: "ExportAll",
  data() {
    return {
      id: "", //傳票號碼
      accDate: "", //傳票日期
      debitmessage: "", //主摘要
      customerId: "", //客戶代號
      cus_name: "", //客戶名稱
      amount: "", //總金額
      debit: [], //借方
      credit: [], //貸方
      debitsubject: [], //借方全部項目
      creditsubject: [], //貸方全部項目
    };
  },
  methods: {
    async debitAccount() {
      try {
        // 發送 GET 請求到指定的 API
        const response = await axios.get(
          "http://122.116.23.30:3347/finance/debitAccount"
        );
        this.debitsubject = response.data.data;
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    async creditAccount() {
      try {
        // 發送 GET 請求到指定的 API
        const response = await axios.get(
          "http://122.116.23.30:3347/finance/creditAccount"
        );
        this.creditsubject = response.data.data;
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    async dodata(data) {
      this.debit = []; //借方清空
      this.credit = []; //貸方清空
      this.debit = data.filter((alltype) => alltype.type === "1");
      const debitsubjectMap = {};
      this.debitsubject.forEach((item) => {
        debitsubjectMap[item.Subjects] = item.SubjectsName;
      });
      // 遍歷 debit，將對應的 SubjectsName 添加到每筆資料
      this.debit.forEach((item) => {
        item.SubjectsName = debitsubjectMap[item.Subjects] || null; // 如果找不到，設為 null
      });

      this.credit = data.filter((alltype) => alltype.type === "2");
      const creditsubjectMap = {};
      this.creditsubject.forEach((item) => {
        creditsubjectMap[item.Subjects] = item.SubjectsName;
      });

      // 遍歷 debit，將對應的 SubjectsName 添加到每筆資料
      this.credit.forEach((item) => {
        item.SubjectsName = creditsubjectMap[item.Subjects] || null; // 如果找不到，設為 null
      });
    },
    async exportExcel(Alldata) {
      const AAA = [
        {
          id: "AO20250102100020655_1",
          parkId: 1,
          trade_name: "系統台企轉預收",
          amount: 50000,
          accDate: "2025-01-01",
          accFarewell: "2025-01",
          creatTime: "2025-01-02 10:00:20",
          deleteTime: "0",
          debitmessage: "",
          creditmessage: "",
          customerId: "G2200710",
          cus_name: "余志琦",
          detail: [
            {
              id: 1193,
              accTradeID: "AO20250102100020655",
              Subjects: "111201",
              amount: 50000,
              type: "1",
              WriteOffId: 0,
              debitmessage: null,
              creditmessage: null,
              SubjectsName: "銀行存款-台企松江",
            },
            {
              id: 1194,
              accTradeID: "AO20250102100020655",
              Subjects: "215101",
              amount: 50000,
              type: "2",
              WriteOffId: 0,
              debitmessage: null,
              creditmessage: null,
              SubjectsName: "預收款項-油品",
            },
          ],
        },
        {
          id: "AO20250102100020655",
          parkId: 1,
          trade_name: "系統台企轉預收",
          amount: 50000,
          accDate: "2025-01-01",
          accFarewell: "2025-01",
          creatTime: "2025-01-02 10:00:20",
          deleteTime: "0",
          debitmessage: "",
          creditmessage: "",
          customerId: "G2200710",
          cus_name: "余志琦2",
          detail: [
            {
              id: 1193,
              accTradeID: "AO20250102100020655",
              Subjects: "111201",
              amount: 50000,
              type: "1",
              WriteOffId: 0,
              debitmessage: null,
              creditmessage: null,
              SubjectsName: "銀行存款-台企松江",
            },
            {
              id: 1194,
              accTradeID: "AO20250102100020655",
              Subjects: "215101",
              amount: 50000,
              type: "2",
              WriteOffId: 0,
              debitmessage: null,
              creditmessage: null,
              SubjectsName: "預收款項-油品",
            },
          ],
        },
      ];
      const rows = Alldata;
      // const data =row.detail
      console.log("查詢科目名稱");
      await this.debitAccount();
      await this.creditAccount();
      console.log("查詢結束");
      console.log("匯出");
      try {
        // 確保資料先完成取得
        const workbook = new ExcelJS.Workbook();
        const fr = new FileReader();
        const response = await fetch(
          new URL("@/assets/傳票範本_多筆.xlsx", import.meta.url).href
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

        // 重新命名所有工作表
        workbook.worksheets.forEach((sheet, index) => {
          sheet.name = String(index); // 將工作表名稱設為 0, 1, 2...
        });

        // 遍歷所有工作表，刪除多餘的工作表
        while (workbook.worksheets.length > rows.length) {
          const extraSheet =
            workbook.worksheets[workbook.worksheets.length - 1]; // 獲取最後一個工作表
          workbook.removeWorksheet(extraSheet.id); // 刪除該工作表
        }
        let index = 0; // 初始化索引
        for (const row of rows) {
          console.log("分借貸方");
          await this.dodata(row.detail);
          console.log("分類結束");
          // 若有足夠的工作表，則選擇並填寫資料，否則創建新工作表
          let worksheet;
          if (workbook.worksheets[index]) {
            worksheet = workbook.worksheets[index];
          }
          worksheet.getCell(`B4`).value = row.id || "";
          worksheet.getCell(`B5`).value = row.accDate || "";
          worksheet.getCell(`B6`).value = row.debitmessage || "";
          worksheet.getCell(`F4`).value = row.customerId || "";
          worksheet.getCell(`F5`).value = row.cus_name || "";
          // 開始填充資料
          this.debit.forEach((data, index) => {
            const rowIndex = index * 2 + 10;
            worksheet.getCell(`A${rowIndex}`).value = data.Subjects || "";
            worksheet.getCell(`B${rowIndex}`).value = "借";
            worksheet.getCell(`C${rowIndex}`).value = data.SubjectsName || "";
            worksheet.mergeCells(`D${rowIndex}:F${rowIndex + 1}`);
            worksheet.getCell(`D${rowIndex}`).value = data.debitmessage || "";
            // 設置 D 欄靠上對齊
            worksheet.getCell(`D${rowIndex}`).alignment = {
              vertical: "top", // 垂直靠上
              horizontal: "left", // 水平靠左（可根據需求調整）
              wrapText: true, // 自動換行
            };
            worksheet.getCell(`G${rowIndex}`).value = parseFloat(data.amount); // 轉數值
            worksheet.getCell(`G${rowIndex}`).numFmt = "#,##0"; // 千分位格式
          });
          let lastRowNumber = 0;
          worksheet.eachRow((row, rowNumber) => {
            if (row.hasValues) {
              lastRowNumber = rowNumber;
            }
          });
          this.credit.forEach((data, index) => {
            const rowIndex = index * 2 + lastRowNumber + 1;
            worksheet.getCell(`A${rowIndex}`).value = data.Subjects || "";
            worksheet.getCell(`B${rowIndex}`).value = "貸";
            // 設定 B 行單元格樣式
            const cellB = worksheet.getCell(`B${rowIndex}`);
            cellB.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFF00" }, // 設定黃色背景色 (ARGB)
            };
            worksheet.getCell(`C${rowIndex}`).value =
              `　${data.SubjectsName}` || "";
            worksheet.mergeCells(`D${rowIndex}:F${rowIndex + 1}`);
            worksheet.getCell(`D${rowIndex}`).value = data.creditmessage || "";
            // 設置 D 欄靠上對齊
            worksheet.getCell(`D${rowIndex}`).alignment = {
              vertical: "top", // 垂直靠上
              horizontal: "left", // 水平靠左（可根據需求調整）
              wrapText: true, // 自動換行
            };
            worksheet.getCell(`H${rowIndex}`).value = parseFloat(data.amount); // 轉數值
            worksheet.getCell(`H${rowIndex}`).numFmt = "#,##0"; // 千分位格式
          });
          //合計
          let totalAmountRow = lastRowNumber + this.credit.length * 3 + 3;
          worksheet.getCell(`F${totalAmountRow}`).value = "合計：";
          const cell = worksheet.getCell(`F${totalAmountRow}`);
          cell.alignment = { horizontal: "center", vertical: "middle" }; // 水平居中，垂直居中
          worksheet.getCell(`G${totalAmountRow}`).value = parseFloat(
            row.amount
          ); // 轉數值
          worksheet.getCell(`G${totalAmountRow}`).numFmt = "#,##0"; // 千分位格式
          worksheet.getCell(`H${totalAmountRow}`).value = parseFloat(
            row.amount
          ); // 轉數值
          worksheet.getCell(`H${totalAmountRow}`).numFmt = "#,##0"; // 千分位格式
          const range = [
            `A${totalAmountRow}`,
            `B${totalAmountRow}`,
            `C${totalAmountRow}`,
            `D${totalAmountRow}`,
            `E${totalAmountRow}`,
            `F${totalAmountRow}`,
            `G${totalAmountRow}`,
            `H${totalAmountRow}`,
          ];
          range.forEach((cellAddress) => {
            const cell = worksheet.getCell(cellAddress);
            cell.border = {
              top: { style: "medium" }, // 上粗框線
              bottom: { style: "medium" }, // 下粗框線
              left: cell.border?.left || undefined, // 保留原左框線
              right: cell.border?.right || undefined, // 保留原右框線
            };
          });
          worksheet.getRow(totalAmountRow).height = 25; // 高度設為 25
          let lastRow = totalAmountRow + 3;
          worksheet.getCell(`A${lastRow}`).value = "總經理：";
          worksheet.getCell(`C${lastRow}`).value = "執行長：";
          worksheet.getCell(`E${lastRow}`).value = "覆核：";
          worksheet.getCell(`G${lastRow}`).value = "製表：";
          const cells = [`C${lastRow}`, `G${lastRow}`];
          cells.forEach((cellAddress) => {
            const cell = worksheet.getCell(cellAddress);
            cell.alignment = { horizontal: "center", vertical: "middle" }; // 水平居中，垂直居中
          });
          worksheet.getCell(`C${lastRow}`).alignment = {
            horizontal: "right",
            vertical: "middle",
          };
          worksheet.getColumn(1).width = 12;
          worksheet.getColumn(3).width = 32;
          worksheet.getColumn(4).width = 37;
          worksheet.getColumn(7).width = 16;
          worksheet.getColumn(7).width = 14;
          worksheet.getColumn(8).width = 14;
          worksheet.getRow(10).height = 25; // 高度設為 25

          // 重新命名工作表為 ${id}_傳票
          worksheet.name = `${row.id}_傳票`;
          console.log(`做完${row.id}_傳票`);
          index++; // 增加索引
        }
        // rows.forEach((row, index) => {});

        // 生成下載鏈接並觸發下載
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `傳票.xlsx`; // 設定下載檔案名
        link.click();
        console.log("結束");
      } catch (error) {
        console.error("Error during export to Excel:", error);
      }
    },
  },
};
</script>
