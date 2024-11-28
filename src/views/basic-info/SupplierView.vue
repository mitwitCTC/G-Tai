<template>
  <div>
    <ListBar />
    <div class="page-title">
      <h2>{{ pageTitle }}</h2>
    </div>
    <div>
      <BreadCrumb :isSpecialPage="true" />
    </div>
    <el-form-item label="帳單期別">
      <div style="display: flex; align-items: center">
        <!-- 帳單期別的日期選擇器 -->
        <el-date-picker
          v-model="search_month"
          type="month"
          format="YYYY-MM"
          value-format="YYYY-MM"
          placeholder="請選擇帳單期別"
          style="margin-right: 10px"
        />
        <!-- 發送方式的下拉框 -->
        <el-select
          v-model="selectedSendMode"
          placeholder="請選擇發送方式"
          style="width: 150px; margin-right: 10px"
        >
          <el-option label="寄送" value="1" />
          <el-option label="Line" value="2" />
          <el-option label="mail" value="3" />
        </el-select>
        <el-select
          v-model="select"
          placeholder="請選擇匯出項目"
          style="width: 150px; margin-right: 10px"
          v-if="this.selectedSendMode == '1'"
        >
          <el-option label="總表" value="1" />
          <el-option label="明細" value="2" />
        </el-select>
        <el-button type="success" @click="exportAll">匯出</el-button>
      </div>
    </el-form-item>
    <el-form-item label="需列印客戶" class="section-header">
      <div class="table-container">
        <el-table :data="cus_message" style="width: 100%">
          <el-table-column prop="account_sortId" label="帳單編號" width="150" />
          <el-table-column prop="customerId" label="客戶代號" width="150" />
          <el-table-column prop="cusName" label="客戶名稱" width="300" />
          <el-table-column
            prop="transaction_mode"
            label="交易模式"
            width="100"
          />
          <el-table-column prop="invoice_name" label="發票抬頭" width="300" />
          <el-table-column prop="acc_name" label="帳單組別" width="250" />
        </el-table>
      </div>
    </el-form-item>
  </div>
  <el-dialog
    v-model="isLoading"
    width="15%"
    title="請稍後..."
    :close-on-click-modal="false"
  />
</template>

<script>
import ListBar from "@/components/ListBar.vue";
import BreadCrumb from "@/components/BreadCrumb.vue";
import ExcelJS from "exceljs";
import axios from "axios";
export default {
  components: {
    BreadCrumb,
    ListBar,
  },
  data() {
    return {
      isLoading: false,
      select: "",
      search_month: "",
      selectedSendMode: "",
      cus_message: [
        {
          account_sortId: "658",
          customerId: "G2200060",
          cusName: "世發通運有限公司",
          transaction_mode: "1", //交易模式
          invoice_name: "世發通運有限公司", //發票抬頭
          acc_name: "世發通運有限公司", //帳單名稱
        },
        {
          account_sortId: "14",
          customerId: "G2200701",
          cusName: "詮瑞福物流股份有限公司",
          transaction_mode: "2", //交易模式
          invoice_name: "詮瑞福物流股份有限公司", //發票抬頭
          acc_name: "詮瑞福物流股份有限公司", //帳單名稱
        },
        {
          account_sortId: "1057",
          customerId: "G2200766",
          cusName: "仁暉砂石級配料場",
          transaction_mode: "1", //交易模式
          invoice_name: "仁暉砂石級配料場", //發票抬頭
          acc_name: "仁暉砂石級配料場", //帳單名稱
        },
      ],
      response: [],
      Balance: [],
      collateral: [],
      Details: [],
    };
  },
  methods: {
    insertSummaryRow(worksheet, rowNum, summaryData) {
      // 插入相關欄位的數據
      worksheet.getCell(`D${rowNum}`).value = summaryData.product_name || ""; // 插入產品名稱
      worksheet.getCell(`F${rowNum}`).value = summaryData.quantity || 0; // 插入數量
      worksheet.getCell(`H${rowNum}`).value =
        summaryData.list_price_subtotal || 0; // 插入數量
      worksheet.getCell(`I${rowNum}`).value = summaryData.subtotal || 0; // 插入原價小計
      worksheet.getCell(`J${rowNum}`).value = summaryData.mileage || 0; // 插入實際小計
    },
    // 根據油品名稱分組
    groupByProduct(data) {
      const products = [...new Set(data.map((item) => item.fuel_type))];
      return products.map((product) => ({
        fuel_type: product,
        data: data.filter((item) => item.fuel_type === product),
      }));
    },
    // 根據車牌和油品分組，並插入小計行
    groupDataByPlateAndProduct() {
      const grouped = [];
      const plates = [
        ...new Set(this.Details.map((item) => item.license_plate)),
      ];

      plates.forEach((plate) => {
        const filteredData = this.Details.filter(
          (item) => item.license_plate === plate
        );
        const productGroups = this.groupByProduct(filteredData);

        // 將數據插入
        productGroups.forEach((group) => {
          grouped.push(...group.data);

          // 計算小計
          const subtotal = group.data.reduce(
            (acc, item) => ({
              fuel_type: item.fuel_type, // 顯示油品名稱
              fuel_volume: acc.fuel_volume + Number(item.fuel_volume),
              reference_amount:
                acc.reference_amount + Number(item.reference_amount),
              salesAmount: acc.salesAmount + Number(item.salesAmount),
            }),
            {
              fuel_type: "",
              fuel_volume: 0,
              reference_amount: 0,
              salesAmount: 0,
              mileage: 0,
            }
          );

          // 計算該組別的里程數差值
          const mileageDifference =
            group.data[group.data.length - 1].mileage - group.data[0].mileage;
          // 插入小計行
          grouped.push({
            license_plate: "小計",
            trade_time: "",
            station_name: "",
            fuel_type: subtotal.fuel_type, // 油品名稱
            reference_price: "", // 不顯示單價
            fuel_volume: subtotal.fuel_volume, // 顯示油量的總計
            discount: "", // 折讓不顯示
            reference_amount: subtotal.reference_amount, // 牌價金額總計
            salesAmount: subtotal.salesAmount, // 售價小計總計
            mileage: mileageDifference, // 里程數差額
            isSummary: true, // 標記為小計行
          });
        });
      });

      this.Details = grouped;
    },
    getProductName(fuelType) {
      let productName = fuelType.split(" ")[1] || fuelType;
      const fuelTypes = ["92無鉛", "95無鉛", "98無鉛"];

      if (fuelTypes.some((type) => productName.startsWith(type))) {
        productName += "汽油";
      }

      return productName;
    },

    async exportAll() {
      if (!this.select || !this.search_month || !this.selectedSendMode) {
        this.$message({
          message: "必填欄位不可為空",
          type: "error",
        });
        return;
      }
      try {
        if (!this.cus_message || this.cus_message.length === 0) {
          this.$message({
            message: "沒有資料可匯出",
            type: "warning",
          });
          return;
        }

        this.isLoading = true;
        for (const message of this.cus_message) {
          const {
            customerId,
            account_sortId,
            cusName,
            transaction_mode,
            invoice_name,
            acc_name,
          } = message;

          // 检查必要字段是否存在
          if (!customerId || !account_sortId) {
            this.$message({
              message: `${customerId}資料缺少必要欄位，無法匯出`,
              type: "error",
            });
            continue;
          }
          try {
            await this.expor(
              customerId,
              account_sortId,
              cusName,
              transaction_mode,
              invoice_name,
              acc_name
            ); // 呼叫匯出方法
          } catch (error) {
            // 如果某筆資料處理出錯，顯示錯誤訊息
            this.$message({
              message: `${cusName} 在匯出時發生錯誤`,
              type: "error",
            });
            continue; // 繼續處理下一筆資料
          }
        }

        this.isLoading = false;
      } catch (error) {
        console.error("Error during exportAll:", error);
        this.$message({
          message: "匯出時發生錯誤",
          type: "error",
        });
      }
    },
    async monthlyBalance(customerId) {
      const postData = {
        date: this.search_month,
        customerId: customerId,
      };
      await axios
        .post("http://122.116.23.30:3346/main/monthlyBalance ", postData)
        .then((response) => {
          this.Balance = response.data.data[0];
        })
        .catch((error) => {
          // 處理錯誤
          console.error("API request failed:", error);
        });
    },
    async collateralInfo(customerId) {
      const postData = {
        cus_code: customerId,
      };
      await axios
        .post("http://122.116.23.30:3346/main/collateralInfo", postData)
        .then((response) => {
          this.collateral = response.data.data[0];
        })
        .catch((error) => {
          // 處理錯誤
          console.error("API request failed:", error);
        });
    },
    async expor(
      customerId,
      account_sortId,
      cusName,
      transaction_mode,
      invoice_name,
      acc_name
    ) {
      // 準備 postData
      const postData = {
        date: this.search_month,
        customerId: customerId,
        account_sortId: account_sortId,
      };
      if (this.select == 1) {
        console.log("總表");

        // 發送 API 請求獲取帳單資料
        try {
          const response = await axios.post(
            "http://122.116.23.30:3346/main/accountStatement",
            postData
          );
          this.response = response.data.data;
        } catch (error) {
          console.error("API request failed:", error);
          this.$message({
            message: `${cusName}_${this.search_month} 匯出失敗（帳單資料獲取錯誤）`,
            type: "error",
          });
          return; // 停止執行
        }

        // 根據交易模式執行相應操作
        try {
          if (transaction_mode == 1) {
            await this.monthlyBalance(customerId);
          } else if (transaction_mode == 2) {
            await this.collateralInfo(customerId);
          }
        } catch (error) {
          console.error("API request failed:", error);
          this.$message({
            message: `${cusName}_${this.search_month} 匯出失敗（${
              transaction_mode == 1 ? "月結餘額" : "擔保品資料"
            }獲取錯誤）`,
            type: "error",
          });
          return; // 停止執行
        }
      } else if (this.select == 2) {
        console.log("明細");
        // 發送 API 請求獲取帳單資料
        try {
          const response = await axios.post(
            "http://122.116.23.30:3346/main/accountDetails",
            postData
          );
          this.Details = response.data.data;
          this.groupDataByPlateAndProduct();
        } catch (error) {
          console.error("API request failed:", error);
          this.$message({
            message: `${cusName}_${this.search_month} 匯出失敗（帳單資料獲取錯誤）`,
            type: "error",
          });
          return; // 停止執行
        }
      }
      // 在這裡調用匯出Excel的功能
      try {
        await this.exportToExcel(
          cusName,
          transaction_mode,
          invoice_name,
          acc_name,
          this.select
        );
      } catch (error) {
        console.error("匯出Excel失敗:", error);
        this.$message({
          message: `${cusName} 在匯出時發生錯誤`,
          type: "error",
        });
        return; // 停止執行
      }
      // 顯示成功訊息
      this.$message({
        message: `${cusName} ${this.search_month} 匯出成功`,
        type: "success",
      });
    },
    async exportToExcel(
      cusName,
      transaction_mode,
      invoice_name,
      acc_name,
      select
    ) {
      try {
        // 確保資料先完成取得
        const workbook = new ExcelJS.Workbook();
        const fr = new FileReader();
        const formattedMonth = this.search_month.replace(
          /(\d{4})-(\d{2})/,
          (match, year, month) => {
            const rocYear = year - 1911; // 转换为民国年
            return `${rocYear}/${month}`;
          }
        );
        let response;
        if (transaction_mode == 1 && select == 1) {
          response = await fetch(
            new URL("@/assets/儲值對帳單總表.xlsx", import.meta.url).href
          ); // 從 URL 載入模板儲值檔案
        } else if (transaction_mode == 2 && select == 1) {
          response = await fetch(
            new URL("@/assets/月結對帳單總表.xlsx", import.meta.url).href
          ); // 從 URL 載入模板月結檔案
        } else if (select == 2) {
          response = await fetch(
            new URL("@/assets/對帳單明細.xlsx", import.meta.url).href
          );
        }
        const data = await response.blob(); // 轉為 Blob
        fr.readAsArrayBuffer(data);

        // 當 FileReader 完成後，讀取 Excel 並進行修改
        fr.onload = async (ev) => {
          await workbook.xlsx.load(ev.target.result);
          const worksheet = workbook.worksheets[0]; // 取得第一個工作表
          let newFileName;
          let buffer;
          if (select == 1) {
            const last_month_balance = this.Balance.overage; //前期餘額
            const current_month_remittance_amount = Number(
              this.Balance.creditAmount
            ); //本期匯入
            const current_month_fuel_total = Number(this.Balance.salesAmount); //本期使用
            const current_month_balance = this.Balance.thisMonthOverage; //本期餘額
            const payment_deadline = `每月${this.collateral.remittance_date}日`; //月結繳款期限

            const data4 = this.response.product;
            const summary_data = this.response.details.map((row) => [
              formattedMonth,
              row.license_plate,
              row.product_name,
              Number(row.fuel_volume),
              Number(row.reference_amount),
              Number(row.amount),
              Number(row.mileage),
              Number(row.fuel_consumption),
            ]);
            //公司資訊
            let rowstitle = [
              [`期別：${this.search_month}`],
              [`公司名稱：${cusName}`],
              [`發票抬頭：${invoice_name}`],
              [`帳單組別：${acc_name}`],
            ];
            rowstitle.forEach((row, index) => {
              worksheet.getCell(`B${1 + index}`).value = row[0]; // 將每一行的第一列資料放入指定儲存格
            });
            if (transaction_mode == 1) {
              // 儲值
              worksheet.getCell("A7").value = formattedMonth;
              worksheet.getCell("B7").value = last_month_balance;
              worksheet.getCell("C7").value = current_month_remittance_amount;
              worksheet.getCell("E7").value = current_month_fuel_total;
              worksheet.getCell("G7").value = current_month_balance;
            } else if (transaction_mode == 2) {
              const total = summary_data.reduce((sum, row) => {
                if (Array.isArray(row) && row.length > 5) {
                  return sum + (row[5] || 0);
                }
                return sum; // 略過不符合條件的行
              }, 0);
              const data = [
                `${summary_data[0][0]}`,
                `${last_month_balance}`,
                `${payment_deadline}`,
                `${total}`,
              ];
              worksheet.getCell("E7").value = data[2];
              worksheet.getCell("G7").value = data[3];
              worksheet.getCell("G7").value = parseFloat(data[3]); // 轉數值
              worksheet.getCell("G7").numFmt = "#,##0"; // 千分位格式
            }
            //主資料
            const startRow = 10; // 表格起始行
            const endRow = startRow + summary_data.length - 1; // 結束行
            const startCol = "A"; // 起始列
            const endCol = String.fromCharCode(startCol.charCodeAt(0) + 7); // 結束列

            summary_data.forEach((rowData, rowIndex) => {
              rowData.forEach((cellData, colIndex) => {
                const colLetter = String.fromCharCode(65 + colIndex); // 計算列字母，A = 65 ASCII
                const cellRef = `${colLetter}${startRow + rowIndex}`; // 定位儲存格位置
                worksheet.getCell(cellRef).value = cellData; // 填入數據
              });
            });
            //千分位
            for (let row = startRow; row <= endRow; row++) {
              for (
                let col = startCol.charCodeAt(0);
                col <= endCol.charCodeAt(0);
                col++
              ) {
                const cell = worksheet.getCell(
                  `${String.fromCharCode(col)}${row}`
                );
                cell.numFmt = "#,##0";
              }
            }
            // 居中對齊
            for (let row = startRow; row <= endRow; row++) {
              for (let col = startCol.charCodeAt(0); col <= 67; col++) {
                const cell = worksheet.getCell(
                  `${String.fromCharCode(col)}${row}`
                );
                cell.alignment = { horizontal: "center" };
              }
            }
            let lastRowNumber = 0;
            worksheet.eachRow((row, rowNumber) => {
              if (row.hasValues) {
                lastRowNumber = rowNumber;
              }
            });
            const header2 = ["品項", "公升數總計", "牌價總計", "售價總計"];
            const lastRowNum = lastRowNumber + 1;
            // 使用 String.fromCharCode() 將列編號轉成字母
            const endRow2 = lastRowNum + data4.length + 1; // 結束行+標題

            for (let row = lastRowNum + 1; row <= endRow2; row++) {
              for (let col = startCol.charCodeAt(0); col <= 71; col++) {
                const cell = worksheet.getCell(
                  `${String.fromCharCode(col)}${row}`
                );
                if (col % 2 == 1) {
                  worksheet.mergeCells(
                    `${String.fromCharCode(col)}${row}:${String.fromCharCode(
                      col + 1
                    )}${row}`
                  );
                }
                cell.numFmt = "#,##0";
              }
            }

            // 插入表頭
            for (let x = 0; x <= 3; x++) {
              const column = String.fromCharCode(65 + x * 2); // 65 是 'A' 的 ASCII 代碼
              const tableStartRef = `${column}${lastRowNum + 1}`;
              const cell = worksheet.getCell(tableStartRef);
              cell.value = header2[x];
              cell.alignment = { horizontal: "center" };
              cell.font = { bold: true }; // 設置為粗體
              cell.fill = {
                // 設置背景顏色為淺灰色
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "f2f2f2" }, // 使用十六進制顏色代碼
              };
            }
            //品項
            for (let x = 0; x <= data4.length - 1; x++) {
              const tableStartRef = `A${lastRowNum + 2 + x}`;
              const cell = worksheet.getCell(tableStartRef);
              cell.value = data4[x].product_name;
              cell.alignment = { horizontal: "center" };
            }
            //公升數
            for (let x = 0; x <= data4.length - 1; x++) {
              const tableStartRef = `C${lastRowNum + 2 + x}`;
              const cell = worksheet.getCell(tableStartRef);
              cell.value = parseFloat(data4[x].fuel_volume);
              cell.alignment = { horizontal: "right" };
            }
            //牌價
            for (let x = 0; x <= data4.length - 1; x++) {
              const tableStartRef = `E${lastRowNum + 2 + x}`;
              worksheet.getCell(tableStartRef).value = parseFloat(
                data4[x].reference_amount
              );
            }
            //售價
            for (let x = 0; x <= data4.length - 1; x++) {
              const tableStartRef = `G${lastRowNum + 2 + x}`;
              worksheet.getCell(tableStartRef).value = parseFloat(
                data4[x].amount
              );
            }
            // 合計
            const totalAmount = data4.reduce((sum, item) => {
              // 這裡會加總每個 item 的 amount
              return sum + parseFloat(item.amount); // 確保 amount 是數字
            }, 0); // 初始總和是 0
            const lastrow = endRow2 + 1;
            worksheet.mergeCells(`A${lastrow}:F${lastrow}`);
            worksheet.mergeCells(`G${lastrow}:H${lastrow}`);
            worksheet.getCell(`A${lastrow}`).value = "合計";
            worksheet.getCell(`G${lastrow}`).value = parseFloat(totalAmount);
            worksheet.getCell(`A${lastrow}`).font = { bold: true };
            worksheet.getCell(`G${lastrow}`).font = { bold: true };
            worksheet.getCell(`A${lastrow}`).alignment = {
              horizontal: "right",
            };
            worksheet.getCell(`G${lastrow}`).numFmt = "#,##0";
            worksheet.getCell(`A${lastrow}`).border = {
              top: { style: "thin", color: { argb: "C0C0C0" } },
              left: { style: "thin", color: { argb: "C0C0C0" } },
              bottom: { style: "thin", color: { argb: "C0C0C0" } },
              right: { style: "thin", color: { argb: "C0C0C0" } },
            };
            worksheet.getCell(`G${lastrow}`).border = {
              top: { style: "thin", color: { argb: "C0C0C0" } },
              left: { style: "thin", color: { argb: "C0C0C0" } },
              bottom: { style: "thin", color: { argb: "C0C0C0" } },
              right: { style: "thin", color: { argb: "C0C0C0" } },
            };
            // 字型
            worksheet.eachRow((row) => {
              row.eachCell((cell) => {
                // 取得當前儲存格的字型設定
                const currentFont = cell.font || {};

                // 設定字型大小為 12，字型為 "Times New Roman" 或 "新細明體"，並保留原有的粗體等屬性
                cell.font = {
                  ...currentFont,
                  size: 12,
                  name: "Times New Roman", // 如果想要新細明體，設為 "PMingLiU"
                };
                cell.border = {
                  top: { style: "thin", color: { argb: "C0C0C0" } },
                  left: { style: "thin", color: { argb: "C0C0C0" } },
                  bottom: { style: "thin", color: { argb: "C0C0C0" } },
                  right: { style: "thin", color: { argb: "C0C0C0" } },
                };
              });
            });
            const rowToClear = 8; // 要清除框線的行
            const rowToAddTopBorder = 9; // 要添加上框線的行
            const start = "A"; // 起始列
            const end = "G"; // 結束列

            // 刪除 A8-G8 的所有框線
            for (
              let col = start.charCodeAt(0);
              col <= end.charCodeAt(0);
              col++
            ) {
              const cell = worksheet.getCell(
                `${String.fromCharCode(col)}${rowToClear}`
              );
              cell.border = undefined; // 清除框線
            }
            // 添加 A9-G9 的上框線
            for (
              let col = start.charCodeAt(0);
              col <= end.charCodeAt(0);
              col++
            ) {
              const cell = worksheet.getCell(
                `${String.fromCharCode(col)}${rowToAddTopBorder}`
              );
              cell.border = {
                top: { style: "thin", color: { argb: "C0C0C0" } }, // 添加銀色細邊框
                left: { style: "thin", color: { argb: "C0C0C0" } }, // 添加銀色細邊框
                right: { style: "thin", color: { argb: "C0C0C0" } }, // 添加銀色細邊框
              };
            }
            // 保存到新的文件
            newFileName = `${cusName}_${this.search_month}對帳單總表.xlsx`;
            buffer = await workbook.xlsx.writeBuffer();
          } else if (select == 2) {
            //公司資訊
            let rowstitle = [
              [this.search_month],
              [cusName],
              [invoice_name],
              [acc_name],
            ];
            rowstitle.forEach((row, index) => {
              worksheet.getCell(`B${1 + index}`).value = row[0]; // 將每一行的第一列資料放入指定儲存格
            });

            const data = this.Details.map((row) => [
              row.license_plate,
              row.trade_time,
              row.station_name,
              this.getProductName(row.fuel_type),
              Number(row.reference_price),
              Number(row.fuel_volume),
              Number(row.discount),
              Number(row.reference_amount),
              Number(row.salesAmount),
              Number(row.mileage),
              row.isSummary,
            ]);
            // 起始行
            let startRow = 7;
            const summaryRows = []; // 用來記錄小計行的行號
            data.forEach((rowData, rowIndex) => {
              // 如果是 summary row，插入小計
              const currentRowNum = startRow + rowIndex;
              if (rowData[10]) {
                this.insertSummaryRow(worksheet, currentRowNum, {
                  product_name: rowData[3],
                  quantity: rowData[5],
                  list_price_subtotal: rowData[7],
                  subtotal: rowData[8],
                  mileage: rowData[9],
                });
                summaryRows.push(currentRowNum);
              } else {
                // 普通資料行
                rowData.forEach((cellData, colIndex) => {
                  const cellAddress = `${String.fromCharCode(65 + colIndex)}${
                    startRow + rowIndex
                  }`;
                  const cell = worksheet.getCell(cellAddress);
                  cell.value = cellData; // 將數據插入單元格
                });
              }
            });
            summaryRows.forEach((rowNum) => {
              // 合併儲存格 A-C 並設定框線
              worksheet.mergeCells(`A${rowNum}:C${rowNum}`);
              const mergedCell = worksheet.getCell(`A${rowNum}`);
              mergedCell.value = "小計"; // 插入 "小計"
              mergedCell.alignment = {
                horizontal: "center",
                vertical: "middle",
              }; // 居中對齊
              mergedCell.font = { bold: true }; // 粗體（可選）

              // 設定合併儲存格的框線樣式
              mergedCell.border = {
                top: { style: "thin" }, // 細線
                bottom: { style: "medium" }, // 正常下框線
              };

              // 設定 A-J 所有欄位的框線樣式
              const startCol = "A"; // 開始列
              const endCol = "J"; // 結束列

              for (
                let col = startCol.charCodeAt(0);
                col <= endCol.charCodeAt(0);
                col++
              ) {
                const cellAddress = `${String.fromCharCode(col)}${rowNum}`;
                const cell = worksheet.getCell(cellAddress);
                cell.border = {
                  top: { style: "thin" }, // 細線
                  bottom: { style: "medium" }, // 正常下框線
                };
              }
            });
            // 保存到新的文件
            newFileName = `${cusName}_${this.search_month}對帳單明細.xlsx`;
            buffer = await workbook.xlsx.writeBuffer();
          }

          // 生成下載鏈接並觸發下載
          const blob = new Blob([buffer], { type: "application/octet-stream" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = newFileName;
          link.click();
        };
      } catch (error) {
        console.error("Error during export to Excel:", error);
      }
    },
    // 匯出 Excel
    async exportToExcel2() {
      try {
        // 確保資料先完成取得
        const workbook = new ExcelJS.Workbook();
        const fr = new FileReader();
        const response = await fetch(
          new URL("@/assets/對帳單明細.xlsx", import.meta.url).href
        ); // 從 URL 載入模板檔案
        const data = await response.blob(); // 轉為 Blob
        fr.readAsArrayBuffer(data);

        // 當 FileReader 完成後，讀取 Excel 並進行修改
        fr.onload = async (ev) => {
          await workbook.xlsx.load(ev.target.result);
          const worksheet = workbook.worksheets[0]; // 取得第一個工作表

          //公司資訊
          let rowstitle = [
            ["10"],
            ["公司名稱：樂客遊覽車股份有限公司"],
            ["發票抬頭：樂客遊覽車股份有限公司"],
            ["帳單組別：樂客遊覽車股份有限公司"],
          ];
          rowstitle.forEach((row, index) => {
            worksheet.getCell(`A${1 + index}`).value = row[0]; // 將每一行的第一列資料放入指定儲存格
          });

          // 儲值
          // const data = ['113/11', '35000', '50000', '120000','120000'];
          // worksheet.getCell('A7').value = data[0];
          // worksheet.getCell('B7').value = data[1];
          // worksheet.getCell('C7').value = data[2];
          // worksheet.getCell('E7').value = data[3];
          // worksheet.getCell('G7').value = data[4];
          // worksheet.getCell('B7').value = parseFloat(data[1]); // 千分位格式
          // worksheet.getCell('C7').value = parseFloat(data[3]); // 千分位格式
          // worksheet.getCell('E7').value = parseFloat(data[1]); // 千分位格式
          // worksheet.getCell('G7').value = parseFloat(data[3]); // 千分位格式
          // worksheet.getCell('B7').numFmt = '#,##0'; // 千分位格式
          // worksheet.getCell('C7').numFmt = '#,##0'; // 千分位格式
          // worksheet.getCell('E7').numFmt = '#,##0'; // 千分位格式
          // worksheet.getCell('G7').numFmt = '#,##0'; // 千分位格式

          // 月結
          const data = ["嗨", "35000", "50000", "120000"];
          worksheet.getCell("A7").value = data[0];
          worksheet.getCell("C7").value = data[1];
          worksheet.getCell("E7").value = data[2];
          worksheet.getCell("G7").value = data[3];
          worksheet.getCell("C7").value = parseFloat(data[3]); // 千分位格式
          worksheet.getCell("E7").value = parseFloat(data[1]); // 千分位格式
          worksheet.getCell("G7").value = parseFloat(data[3]); // 千分位格式
          worksheet.getCell("C7").numFmt = "#,##0"; // 千分位格式
          worksheet.getCell("E7").numFmt = "#,##0"; // 千分位格式
          worksheet.getCell("G7").numFmt = "#,##0"; // 千分位格式

          const data2 = [
            ["113/09", "ALT-8729", "超級柴油", 27314, 2222, 7, 212, 555555],
            ["113/09", "ALT-8729", "超級柴油", 27314, 66666, 7, 212, 66666],
            ["113/09", "ALT-8729", "超級柴油", 27314, 7777777, 7, 212, 0],
            ["113/09", "ALT-8729", "超級柴油", 27314, 8888, 7, 212, 0],
            ["113/09", "ALT-8729", "超級柴油", 27314, 99999, 7, 212, 0],
            ["113/09", "ALT-8729", "超級柴油", 27314, 0, 7, 212, 0],
            ["113/09", "ALT-8729", "超級柴油", 27314, 0, 7, 212, 0],
          ];

          const startRow = 10; // 表格起始行
          const endRow = startRow + data2.length - 1; // 結束行
          const startCol = "A"; // 起始列
          const endCol = String.fromCharCode(startCol.charCodeAt(0) + 7); // 結束列

          data2.forEach((rowData, rowIndex) => {
            rowData.forEach((cellData, colIndex) => {
              const colLetter = String.fromCharCode(65 + colIndex); // 計算列字母，A = 65 ASCII
              const cellRef = `${colLetter}${startRow + rowIndex}`; // 定位儲存格位置，例如 A10, B10
              worksheet.getCell(cellRef).value = cellData; // 填入數據
            });
          });
          // 設定邊框
          for (let row = startRow; row <= endRow; row++) {
            for (
              let col = startCol.charCodeAt(0);
              col <= endCol.charCodeAt(0);
              col++
            ) {
              const cell = worksheet.getCell(
                `${String.fromCharCode(col)}${row}`
              );
              cell.numFmt = "#,##0";
            }
          }

          // 設定邊框並設置居中對齊
          for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol.charCodeAt(0); col <= 67; col++) {
              const cell = worksheet.getCell(
                `${String.fromCharCode(col)}${row}`
              );
              cell.alignment = { horizontal: "center" };
            }
          }

          let lastRowNumber = 0;
          worksheet.eachRow((row, rowNumber) => {
            if (row.hasValues) {
              lastRowNumber = rowNumber;
            }
          });
          const header2 = ["品項", "公升數總計", "牌價總計", "售價總計"];
          const lastRowNum = lastRowNumber + 1;
          // 使用 String.fromCharCode() 將列編號轉成字母
          const data4 = [
            ["超級柴油", 1000, 34410, 344],
            ["無鉛汽油", 2000, 3, 344666],
            ["尿素溶液", 3000.561, 555, 444],
            ["諾瓦尿素", 4000.561, 123131, 123131231],
          ];
          const endRow2 = lastRowNum + data4.length + 1; // 結束行+標題

          for (let row = lastRowNum + 1; row <= endRow2; row++) {
            for (let col = startCol.charCodeAt(0); col <= 71; col++) {
              const cell = worksheet.getCell(
                `${String.fromCharCode(col)}${row}`
              );
              if (col % 2 == 1) {
                worksheet.mergeCells(
                  `${String.fromCharCode(col)}${row}:${String.fromCharCode(
                    col + 1
                  )}${row}`
                );
              }
              cell.numFmt = "#,##0";
            }
          }

          // 插入表頭
          for (let x = 0; x <= 3; x++) {
            const column = String.fromCharCode(65 + x * 2); // 65 是 'A' 的 ASCII 代碼
            const tableStartRef = `${column}${lastRowNum + 1}`;
            const cell = worksheet.getCell(tableStartRef);
            cell.value = header2[x];
            cell.alignment = { horizontal: "center" };
            cell.font = { bold: true }; // 設置為粗體
            cell.fill = {
              // 設置背景顏色為淺灰色
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "f2f2f2" }, // 使用十六進制顏色代碼
            };
          }
          //品項
          for (let x = 0; x <= 3; x++) {
            const tableStartRef = `A${lastRowNum + 2 + x}`;
            const cell = worksheet.getCell(tableStartRef);
            cell.value = data4[x][0];
            cell.alignment = { horizontal: "center" };
          }
          //公升數
          for (let x = 0; x <= 3; x++) {
            const tableStartRef = `C${lastRowNum + 2 + x}`;
            const cell = worksheet.getCell(tableStartRef);
            cell.value = data4[x][1];
            cell.alignment = { horizontal: "right" };
          }
          //牌價
          for (let x = 0; x <= 3; x++) {
            const tableStartRef = `E${lastRowNum + 2 + x}`;
            worksheet.getCell(tableStartRef).value = data4[x][2];
          }
          //售價
          for (let x = 0; x <= 3; x++) {
            const tableStartRef = `G${lastRowNum + 2 + x}`;
            worksheet.getCell(tableStartRef).value = data4[x][3];
          }

          // 合計
          const lastrow = endRow2 + 1;
          worksheet.mergeCells(`A${lastrow}:F${lastrow}`);
          worksheet.mergeCells(`G${lastrow}:H${lastrow}`);
          worksheet.getCell(`A${lastrow}`).value = "合計";
          worksheet.getCell(`G${lastrow}`).value = 8888888;
          worksheet.getCell(`A${lastrow}`).font = { bold: true };
          worksheet.getCell(`G${lastrow}`).font = { bold: true };
          worksheet.getCell(`A${lastrow}`).alignment = { horizontal: "right" };
          worksheet.getCell(`G${lastrow}`).numFmt = "#,##0";
          worksheet.getCell(`A${lastrow}`).border = {
            top: { style: "thin", color: { argb: "C0C0C0" } },
            left: { style: "thin", color: { argb: "C0C0C0" } },
            bottom: { style: "thin", color: { argb: "C0C0C0" } },
            right: { style: "thin", color: { argb: "C0C0C0" } },
          };
          worksheet.getCell(`G${lastrow}`).border = {
            top: { style: "thin", color: { argb: "C0C0C0" } },
            left: { style: "thin", color: { argb: "C0C0C0" } },
            bottom: { style: "thin", color: { argb: "C0C0C0" } },
            right: { style: "thin", color: { argb: "C0C0C0" } },
          };
          //製卡資料

          const thelastrow = lastrow + 2;
          const header3 = [
            "製作日期",
            "車牌號碼",
            "車隊卡卡號",
            "製卡類別",
            "製卡費用",
          ];
          // 使用 String.fromCharCode() 將列編號轉成字母
          const data5 = [
            [
              "2024/10/24",
              "KAA-370",
              "#12161120060714473",
              "尿素-新增製卡",
              8888,
            ],
            [
              "2024/10/25",
              "KAA-3770",
              "#121611200607144731",
              "尿素-新增製卡",
              0,
            ],
            ["2024/10/26", "KAA-3771", "#12", "尿素-新增製卡1", 0],
            ["2024/10/27", "KAA-3772", "#12161121", "尿素-新增製卡2", 0],
          ];
          const endRow3 = thelastrow + data5.length; // 結束行+標題

          for (let row = thelastrow; row <= endRow3; row++) {
            for (let col = startCol.charCodeAt(0); col <= 71; col++) {
              const cell = worksheet.getCell(
                `${String.fromCharCode(col)}${row}`
              );
              if (col != 65) {
                if (col % 2 == 1) {
                  worksheet.mergeCells(
                    `${String.fromCharCode(col)}${row}:${String.fromCharCode(
                      col + 1
                    )}${row}`
                  );
                }
              }
              cell.numFmt = "#,##0";
              cell.border = {
                top: { style: "thin", color: { argb: "C0C0C0" } },
                left: { style: "thin", color: { argb: "C0C0C0" } },
                bottom: { style: "thin", color: { argb: "C0C0C0" } },
                right: { style: "thin", color: { argb: "C0C0C0" } },
              };
            }
          }

          // 插入表頭
          function setCellStyle(
            cell,
            value,
            bold = true,
            align = "center",
            bgColor = "f2f2f2"
          ) {
            cell.value = value;
            cell.alignment = { horizontal: align };
            cell.font = { bold: bold };
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: bgColor },
            };
          }
          const getA = worksheet.getCell(`A${thelastrow}`);
          const getB = worksheet.getCell(`B${thelastrow}`);
          const getC = worksheet.getCell(`C${thelastrow}`);
          const getE = worksheet.getCell(`E${thelastrow}`);
          const getG = worksheet.getCell(`G${thelastrow}`);
          setCellStyle(getA, header3[0]);
          setCellStyle(getB, header3[1]);
          setCellStyle(getC, header3[2]);
          setCellStyle(getE, header3[3]);
          setCellStyle(getG, header3[4]);
          //製卡資料
          //製作日期
          for (let x = 0; x <= data5.length - 1; x++) {
            const tableStartRef = `A${thelastrow + 1 + x}`;
            const cell = worksheet.getCell(tableStartRef);
            cell.value = data5[x][0];
            cell.alignment = { horizontal: "center" };
          }
          //車牌號碼
          for (let x = 0; x <= data5.length - 1; x++) {
            const tableStartRef = `B${thelastrow + 1 + x}`;
            const cell = worksheet.getCell(tableStartRef);
            cell.value = data5[x][1];
            cell.alignment = { horizontal: "center" };
          }
          //車隊卡卡號
          for (let x = 0; x <= data5.length - 1; x++) {
            const tableStartRef = `C${thelastrow + 1 + x}`;
            const cell = worksheet.getCell(tableStartRef);
            cell.value = data5[x][2];
            cell.alignment = { horizontal: "center" };
          }
          //製卡類別
          for (let x = 0; x <= data5.length - 1; x++) {
            const tableStartRef = `E${thelastrow + 1 + x}`;
            const cell = worksheet.getCell(tableStartRef);
            cell.value = data5[x][3];
            cell.alignment = { horizontal: "center" };
          }
          //製卡費用
          for (let x = 0; x <= data5.length - 1; x++) {
            const tableStartRef = `G${thelastrow + 1 + x}`;
            const cell = worksheet.getCell(tableStartRef);
            cell.value = data5[x][4];
            cell.numFmt = "#,##0";
          }
          //合計
          // const lastrow2= thelastrow+data5.length+1
          // worksheet.mergeCells(`A${lastrow2}:F${lastrow2}`);
          // worksheet.mergeCells(`G${lastrow2}:H${lastrow2}`);
          // worksheet.getCell(`A${lastrow2}`).value = '合計'
          // worksheet.getCell(`G${lastrow2}`).value = 88888889
          // worksheet.getCell(`A${lastrow2}`).font = { bold: true };
          // worksheet.getCell(`G${lastrow2}`).font = { bold: true };
          // worksheet.getCell(`A${lastrow2}`).alignment = { horizontal: 'right' }
          // worksheet.getCell(`G${lastrow2}`).numFmt = '#,##0';
          // worksheet.getCell(`A${lastrow2}`).border = {
          //               top: { style: 'thin' },
          //               left: { style: 'thin' },
          //               bottom: { style: 'thin' },
          //               right: { style: 'thin' }
          //   };
          // worksheet.getCell(`G${lastrow2}`).border = {
          //               top: { style: 'thin' },
          //               left: { style: 'thin' },
          //               bottom: { style: 'thin' },
          //               right: { style: 'thin' }
          //   };

          // 字型
          worksheet.eachRow((row) => {
            row.eachCell((cell) => {
              // 取得當前儲存格的字型設定
              const currentFont = cell.font || {};

              // 設定字型大小為 12，字型為 "Times New Roman" 或 "新細明體"，並保留原有的粗體等屬性
              cell.font = {
                ...currentFont,
                size: 12,
                name: "Times New Roman", // 如果想要新細明體，設為 "PMingLiU"
              };
              cell.border = {
                top: { style: "thin", color: { argb: "C0C0C0" } },
                left: { style: "thin", color: { argb: "C0C0C0" } },
                bottom: { style: "thin", color: { argb: "C0C0C0" } },
                right: { style: "thin", color: { argb: "C0C0C0" } },
              };
            });
          });
          const rowToClear = 8; // 要清除框線的行
          const rowToAddTopBorder = 9; // 要添加上框線的行
          const start = "A"; // 起始列
          const end = "G"; // 結束列

          // 刪除 A8-G8 的所有框線
          for (let col = start.charCodeAt(0); col <= end.charCodeAt(0); col++) {
            const cell = worksheet.getCell(
              `${String.fromCharCode(col)}${rowToClear}`
            );
            cell.border = undefined; // 清除框線
          }

          // 添加 A11-G11 的上框線
          for (let col = start.charCodeAt(0); col <= end.charCodeAt(0); col++) {
            const cell = worksheet.getCell(
              `${String.fromCharCode(col)}${rowToAddTopBorder}`
            );
            cell.border = {
              top: { style: "thin", color: { argb: "C0C0C0" } }, // 添加銀色細邊框
              left: { style: "thin", color: { argb: "C0C0C0" } }, // 添加銀色細邊框
              right: { style: "thin", color: { argb: "C0C0C0" } }, // 添加銀色細邊框
            };
          }

          // 保存到新的文件
          const newFileName = "明細測試.xlsx";
          const buffer = await workbook.xlsx.writeBuffer();

          // 生成下載鏈接並觸發下載
          const blob = new Blob([buffer], { type: "application/octet-stream" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = newFileName;
          link.click();
        };
        this.$message({
          message: "匯出成功",
          type: "success",
        });
      } catch (error) {
        console.error("Error during export to Excel:", error);
      }
    },
    // 匯出 Excel
    async exportToExcel2() {
      try {
        // 確保資料先完成取得
        const workbook = new ExcelJS.Workbook();
        const fr = new FileReader();
        const response = await fetch(
          new URL("@/assets/對帳單明細.xlsx", import.meta.url).href
        ); // 從 URL 載入模板檔案
        const data = await response.blob(); // 轉為 Blob
        fr.readAsArrayBuffer(data);

        // 當 FileReader 完成後，讀取 Excel 並進行修改
        fr.onload = async (ev) => {
          await workbook.xlsx.load(ev.target.result);
          const worksheet = workbook.worksheets[0]; // 取得第一個工作表

          //表頭

          //公司資訊
          let rowstitle = [
            ["1"],
            ["公司名稱：樂客遊覽車股份有限公司"],
            ["發票抬頭：樂客遊覽車股份有限公司"],
            ["帳單組別：樂客遊覽車股份有限公司"],
          ];
          rowstitle.forEach((row, index) => {
            worksheet.getCell(`B${1 + index}`).value = row[0]; // 將每一行的第一列資料放入指定儲存格
          });
          const data = [
            [
              "436-G6",
              "2024/10/05 19:08:52",
              "亞柏仁武",
              "超級柴油",
              27.7,
              150.0,
              1.5,
              4155,
              3930,
              132,
            ],
            [
              "436-G6",
              "2024/10/05 19:08:52",
              "亞柏仁武",
              "超級柴油",
              27.7,
              150.0,
              1.5,
              4155,
              3930,
              132,
            ],
            [
              "436-G6",
              "2024/10/05 19:08:52",
              "亞柏仁武",
              "超級柴油",
              27.7,
              150.0,
              1.5,
              4155,
              3930,
              132,
            ],
          ];

          // 起始行
          let startRow = 7;

          data.forEach((rowData, rowIndex) => {
            rowData.forEach((cellData, colIndex) => {
              const cellAddress = `${String.fromCharCode(65 + colIndex)}${
                startRow + rowIndex
              }`;
              const cell = worksheet.getCell(cellAddress);
              cell.value = cellData; // 將數據插入單元格
            });
          });
          const lastRowNum = worksheet.lastRow
            ? worksheet.lastRow.number + 1
            : 1; // 若無資料，從第 1 行開始

          // 合併儲存格 A-C
          worksheet.mergeCells(`A${lastRowNum}:C${lastRowNum}`);

          // 設定合併儲存格的樣式和框線
          const mergedCell = worksheet.getCell(`A${lastRowNum}`);
          mergedCell.value = "小計"; // 可根據需求修改內容
          mergedCell.alignment = { horizontal: "center", vertical: "middle" }; // 居中對齊
          mergedCell.font = { bold: true }; // 粗體（可選）

          // 設定框線
          mergedCell.border = {
            top: { style: "thin" }, // 細線
            bottom: { style: "medium" }, // 正常下框線
          };
          // 設定 A-J 的框線
          const startCol = "A"; // 開始列
          const endCol = "J"; // 結束列

          for (
            let col = startCol.charCodeAt(0);
            col <= endCol.charCodeAt(0);
            col++
          ) {
            const cellAddress = `${String.fromCharCode(col)}${lastRowNum}`;
            const cell = worksheet.getCell(cellAddress);
            cell.border = {
              top: { style: "thin" }, // 細線
              bottom: { style: "medium" }, // 正常下框線
            };
          }

          // 保存到新的文件
          const newFileName = "明細測試.xlsx";
          const buffer = await workbook.xlsx.writeBuffer();

          // 生成下載鏈接並觸發下載
          const blob = new Blob([buffer], { type: "application/octet-stream" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = newFileName;
          link.click();
        };
        this.$message({
          message: "匯出成功",
          type: "success",
        });
      } catch (error) {
        console.error("Error during export to Excel:", error);
      }
    },
    async exportToPdfAndPrint() {
      try {
        const workbook = new ExcelJS.Workbook();
        const fr = new FileReader();

        // 加载 Excel 文件
        const response = await fetch(
          new URL("@/assets/對帳單明細.xlsx", import.meta.url).href
        );
        const data = await response.blob(); // 转为 Blob
        fr.readAsArrayBuffer(data);

        fr.onload = async (event) => {
          await workbook.xlsx.load(event.target.result); // 加载 Excel 数据
          const worksheet = workbook.worksheets[0]; // 获取第一个工作表

          // 初始化 jsPDF
          const pdf = new jsPDF({
            orientation: "landscape", // 横向页面
            unit: "pt", // 点为单位
            format: "a4", // A4 纸张
          });

          // 添加标题
          pdf.setFontSize(16);
          pdf.text("對帳單明細", 40, 40);

          // 表格数据
          const pdfTable = [];
          worksheet.eachRow({ includeEmpty: false }, (row, rowIndex) => {
            const rowData = row.values.slice(1); // 跳过行头信息
            pdfTable.push(rowData);
          });

          // 使用 autoTable 插件绘制表格
          pdf.autoTable({
            head: [pdfTable[0]], // 表头
            body: pdfTable.slice(1), // 表格内容
            startY: 60, // 表格开始位置
            styles: { fontSize: 10, cellPadding: 5 }, // 样式
          });

          // 导出为 PDF 或打印
          pdf.save("對帳單明細.pdf");
          // pdf.autoPrint(); // 如果需要直接打印，可以使用这一行
          // window.open(pdf.output("bloburl"), "_blank");
        };
      } catch (error) {
        console.error("Error while converting Excel to PDF:", error);
        this.$message.error("转换失败，请重试！");
      }
    },
  },
};
</script>

<style scoped>
.page-title {
  margin-top: 30px;
  margin-bottom: 30px;
}
.section-header {
  margin-top: 50px;
  background-color: #f0ecec; /* 浅灰色背景 */
  border-radius: 10px; /* 圆角 */
  padding: 10px; /* 内边距 */
  margin-bottom: 10px; /* 项目之间的间距 */
}
</style>
