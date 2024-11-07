<template>
  <div>
    <ListBar/>
    <div class="page-title"><h2>{{ pageTitle }}</h2></div>
    <div>
      <BreadCrumb :isSpecialPage="true"/>
  </div>
  <div class="card-container">
    <el-card v-for="supplier in suppliers" :key="supplier.supplierName" class="supplier-card" shadow="hover">
      <template v-slot:header>
<div  class="card-header">
        <span>{{ supplier.supplierName }}</span>
      </div>
</template>
      <div class="card-body">
        <p><strong>統編:</strong> {{ supplier.taxId }}</p>
        <p><strong>地址:</strong> {{ supplier.address }}</p>
        <p><strong>電話:</strong> {{ supplier.phone }}</p>
      </div>
      <div class="card-footer">
        <el-button @click="editSupplier(supplier)" type="primary" size="small">编辑</el-button>
      </div>
    </el-card>
  </div>
  </div>
  <el-button @click="exportToExcel">匯出</el-button>
  <el-button @click="exportToExcel2">匯出2</el-button>
</template>

<script>
import ListBar from '@/components/ListBar.vue'
import BreadCrumb from '@/components/BreadCrumb.vue';
import ExcelJS from 'exceljs';
export default {
  components: {
    BreadCrumb,
    ListBar
  },
data() {
    return {
      suppliers: [
        {
          supplierName: '中油',
          taxId: '12345678',
          address: '台北市中正區',
          phone: '12345678'
        },
        {
          supplierName: '台塑',
          taxId: '87654321',
          address: '台中市西屯區',
          phone: '87654321'
        }
      ]
    };
  },
  methods: {
   
    // 匯出 Excel
    async exportToExcel() {
          try {
            // 確保資料先完成取得
            const workbook = new ExcelJS.Workbook();
            const fr = new FileReader();
            const response = await fetch(new URL('@/assets/對帳單總表.xlsx', import.meta.url).href); // 從 URL 載入模板檔案
            const data = await response.blob(); // 轉為 Blob
            fr.readAsArrayBuffer(data);

            // 當 FileReader 完成後，讀取 Excel 並進行修改
            fr.onload = async (ev) => {
              await workbook.xlsx.load(ev.target.result);
              const worksheet = workbook.worksheets[0]; // 取得第一個工作表
              
              //表頭
              const today = new Date();
              const yearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
              let rowstitle = `${yearMonth} 對帳單總表`;
              worksheet.getCell('A2').value = rowstitle 
              
              //公司資訊
              let rowstitle2=[['2024-09 對帳單總表'],['2024-09 對帳單總表2'],['2024-09 對帳單總表3']];
              rowstitle2.forEach((row, index) => {
              worksheet.getCell(`B${3 + index}`).value = row[0]; // 將每一行的第一列資料放入指定儲存格
              });
            //月結
            const data = ['value1', '35000', 'value3', '120000'];
            //   let columnAscii = 65;
            //   data.forEach(value => {
            //   const cell = String.fromCharCode(columnAscii) + '8'; // 將 ASCII 轉為字母再組成單元格名稱
            //   worksheet.getCell(cell).value = value;
            //   columnAscii += 2; // 每次間隔兩個欄位
            // });
            worksheet.getCell('A8').value = data[0];
            worksheet.getCell('C8').value = parseFloat(data[1]); // 千分位格式
            worksheet.getCell('E8').value = data[2];
            worksheet.getCell('G8').value = parseFloat(data[3]); // 千分位格式

            worksheet.getCell('C8').numFmt = '#,##0'; // 千分位格式
            worksheet.getCell('G8').numFmt = '#,##0'; // 千分位格式
            //儲值
            const data2 = ['value1', '35000', 'value3', '120000','120000','120000','120000',120000];
            worksheet.getCell('A11').value = data2[0];
            worksheet.getCell('B11').value = parseFloat(data[1]); 
            worksheet.getCell('C11').value = data2[2];
            worksheet.getCell('D11').value = data2[3]; 
            worksheet.getCell('E11').value = data2[4]; 
            worksheet.getCell('F11').value = data2[5]; 
            worksheet.getCell('G11').value = data2[6]; 
            worksheet.getCell('H11').value = data2[7]; 

            worksheet.getCell('G11').numFmt = '#,##0'; // 千分位格式
            worksheet.getCell('H11').numFmt = '#,##0'; // 千分位格式
            const data3=[ ["113/09","ALT-8729","超級柴油",27314,0,7,212,0],["113/10","ALT-8729","超級柴油",27314,0,7,212,0],["113/11","ALT-8729","超級柴油",273.14,0,7,212,0]]
            // 定義標頭
                const header = [
                  { name: '年月' },
                  { name: '車牌號碼' },
                  { name: '產品名稱' },
                  { name: '公升數合計' },
                  { name: '牌價合計' },
                  { name: '售價合計' },
                  { name: '總里程數' },
                  { name: '油耗' }
                ];
                worksheet.addTable({
                name: 'table名稱', // 表格的名稱
                ref: 'A14', 
                headerRow: false, // 不需要表頭
                columns: header,
                rows: data3 // 將生成的行數據放入表格
              });
              
              const startRow = 14; // 表格起始行
              const endRow = startRow + data3.length-1; // 結束行
              const startCol = 'A'; // 起始列
              const endCol = String.fromCharCode(startCol.charCodeAt(0) + header.length - 1); // 結束列
            // 設定邊框
            for (let row = startRow; row <= endRow; row++) {
                for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
                    const cell = worksheet.getCell(`${String.fromCharCode(col)}${row}`);
                    cell.numFmt = '#,##0';
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                }
            }

            // // 設定邊框並設置居中對齊
            for (let row = startRow; row <= endRow; row++) {
                for (let col = startCol.charCodeAt(0); col <=67; col++) {
                    const cell = worksheet.getCell(`${String.fromCharCode(col)}${row}`);
                    cell.alignment = { horizontal: 'center' };
                }
            }
            worksheet.addRow([]);//空白行
            worksheet.addRow([]);//空白行
          const header2 = ['品項','公升數總計','牌價總計','售價總計'];
          const lastRowNum = worksheet.lastRow.number;
          // 使用 String.fromCharCode() 將列編號轉成字母
          const data4=[ ["超級柴油",1000,34410,344],["無鉛汽油",2000,3,344666],["尿素溶液",3000.5610,555,444],["諾瓦尿素",4000.5610,123131,123131231]]
          const endRow2 = lastRowNum + data4.length+1; // 結束行+標題
          
          for (let row = lastRowNum+1; row <= endRow2; row++) {
                for (let col = startCol.charCodeAt(0); col <= 71; col++) {
                    const cell = worksheet.getCell(`${String.fromCharCode(col)}${row}`);
                    if(col%2==1){
                      worksheet.mergeCells(`${String.fromCharCode(col)}${row}:${String.fromCharCode(col+1)}${row}`);
                    }
                    cell.numFmt = '#,##0';
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                }
            }

           // 插入表頭
           for (let x = 0; x <= 3; x++) { 
            const column = String.fromCharCode(65 + x * 2); // 65 是 'A' 的 ASCII 代碼
            const tableStartRef = `${column}${lastRowNum + 1}`;
            const cell=worksheet.getCell(tableStartRef)
            cell.value = header2[x];
            cell.alignment = { horizontal: 'center' }
            cell.font = { bold: true }; // 設置為粗體
            cell.fill = {
                    // 設置背景顏色為淺灰色
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'DDDDDD' } // 使用十六進制顏色代碼
                };
          }
          //品項
          for (let x = 0; x <= 3; x++) {
            const tableStartRef = `A${lastRowNum +2+x}`;
            const cell=worksheet.getCell(tableStartRef)
            cell.value = data4[x][0];
            cell.alignment = { horizontal: 'center' }
          }
          //公升數
          for (let x = 0; x <= 3; x++) {
            const tableStartRef = `C${lastRowNum +2+x}`;
            worksheet.getCell(tableStartRef).value = data4[x][1];
          }
          //牌價
          for (let x = 0; x <= 3; x++) {
            const tableStartRef = `E${lastRowNum +2+x}`;
            worksheet.getCell(tableStartRef).value = data4[x][2];
          }
          //售價
          for (let x = 0; x <= 3; x++) {
            const tableStartRef = `G${lastRowNum +2+x}`;
            worksheet.getCell(tableStartRef).value = data4[x][3];
          }
          //合計
          const lastrow= worksheet.lastRow.number+1
          worksheet.mergeCells(`A${lastrow}:F${lastrow}`);
          worksheet.mergeCells(`G${lastrow}:H${lastrow}`);
          worksheet.getCell(`A${lastrow}`).value = '合計'
          worksheet.getCell(`G${lastrow}`).value = 8888888
          worksheet.getCell(`A${lastrow}`).font = { bold: true };
          worksheet.getCell(`G${lastrow}`).font = { bold: true };
          worksheet.getCell(`A${lastrow}`).alignment = { horizontal: 'right' }
          worksheet.getCell(`G${lastrow}`).numFmt = '#,##0';
          worksheet.getCell(`A${lastrow}`).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
            };
          worksheet.getCell(`G${lastrow}`).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
            };
          //製卡資料
          worksheet.addRow([]);//空白行
          const thelastrow=worksheet.lastRow.number+1
          const header3 = ['製作日期','車牌號碼','車隊卡卡號','製卡類別','製卡費用'];
          // 使用 String.fromCharCode() 將列編號轉成字母
          const data5=[["2024/10/24","KAA-370","#12161120060714473","尿素-新增製卡",8888], ["2024/10/25","KAA-3770","#121611200607144731","尿素-新增製卡",0],["2024/10/26","KAA-3771","#12","尿素-新增製卡1",0],["2024/10/27","KAA-3772","#12161121","尿素-新增製卡2",0]]
          const endRow3 = worksheet.lastRow.number + data5.length+1; // 結束行+標題
          
          for (let row =thelastrow; row <= endRow3; row++) {
                for (let col = startCol.charCodeAt(0); col <= 71; col++) {
                    const cell = worksheet.getCell(`${String.fromCharCode(col)}${row}`);
                    if(col!=65){
                      if(col%2==1){
                        worksheet.mergeCells(`${String.fromCharCode(col)}${row}:${String.fromCharCode(col+1)}${row}`);
                      }
                    }
                    cell.numFmt = '#,##0';
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                }
            }

           // 插入表頭
           function setCellStyle(cell, value, bold = true, align = 'center', bgColor = 'DDDDDD') {
          cell.value = value;
          cell.alignment = { horizontal: align };
          cell.font = { bold: bold };
          cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: bgColor }
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
           for (let x = 0; x <= data5.length-1 ; x++) {
            const tableStartRef = `A${thelastrow +1 + x}`;
            const cell=worksheet.getCell(tableStartRef)
            cell.value = data5[x][0];
            cell.alignment = { horizontal: 'center' }
          }
          //車牌號碼
          for (let x = 0; x <= data5.length-1 ; x++) {
            const tableStartRef = `B${thelastrow +1 + x}`;
            const cell=worksheet.getCell(tableStartRef)
            cell.value = data5[x][1];
            cell.alignment = { horizontal: 'center' }
          }
          //車隊卡卡號
          for (let x = 0; x <= data5.length-1 ; x++) {
            const tableStartRef = `C${thelastrow +1 + x}`;
            const cell=worksheet.getCell(tableStartRef)
            cell.value = data5[x][2];
            cell.alignment = { horizontal: 'center' }
          }
          //製卡類別
          for (let x = 0; x <= data5.length-1 ; x++) {
            const tableStartRef = `E${thelastrow +1 + x}`;
            const cell=worksheet.getCell(tableStartRef)
            cell.value = data5[x][3];
            cell.alignment = { horizontal: 'center' }
          }
          //製卡費用
          for (let x = 0; x <= data5.length-1 ; x++) {
            const tableStartRef = `G${thelastrow +1 + x}`;
            const cell=worksheet.getCell(tableStartRef)
            cell.value = data5[x][4];
            cell.numFmt = '#,##0';
          }
          //合計
          const lastrow2= worksheet.lastRow.number+1
          worksheet.mergeCells(`A${lastrow2}:F${lastrow2}`);
          worksheet.mergeCells(`G${lastrow2}:H${lastrow2}`);
          worksheet.getCell(`A${lastrow2}`).value = '合計'
          worksheet.getCell(`G${lastrow2}`).value = 88888889
          worksheet.getCell(`A${lastrow2}`).font = { bold: true };
          worksheet.getCell(`G${lastrow2}`).font = { bold: true };
          worksheet.getCell(`A${lastrow2}`).alignment = { horizontal: 'right' }
          worksheet.getCell(`G${lastrow2}`).numFmt = '#,##0';
          worksheet.getCell(`A${lastrow2}`).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
            };
          worksheet.getCell(`G${lastrow2}`).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
            };
            //字型
            worksheet.eachRow((row) => {
              row.eachCell((cell) => {
                // 取得當前儲存格的字型設定
                const currentFont = cell.font || {};

                // 設定字型大小為 12，並保留是否粗體等屬性
                cell.font = { ...currentFont, size: 12 };
              });
            });
            
              // 保存到新的文件
              const newFileName = '母檔測試.xlsx';
              const buffer = await workbook.xlsx.writeBuffer();

              // 生成下載鏈接並觸發下載
              const blob = new Blob([buffer], { type: 'application/octet-stream' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = newFileName;
              link.click();
            } 
              this.$message({
                      message: '匯出成功',
                      type: 'success'
            });
          } catch (error) {
            console.error('Error during export to Excel:', error);
          }
},
// 匯出 Excel2
async exportToExcel2() {
          try {
            // 確保資料先完成取得
            const workbook = new ExcelJS.Workbook();
            const fr = new FileReader();
            const response = await fetch(new URL('@/assets/對帳單總表.xlsx', import.meta.url).href); // 從 URL 載入模板檔案
            const data = await response.blob(); // 轉為 Blob
            fr.readAsArrayBuffer(data);

            // 當 FileReader 完成後，讀取 Excel 並進行修改
            fr.onload = async (ev) => {
              await workbook.xlsx.load(ev.target.result);
              const worksheet = workbook.worksheets[0]; // 取得第一個工作表
              
              //表頭
              const today = new Date();
              const yearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
              let rowstitle = `${yearMonth} 對帳單總表`;
              worksheet.getCell('A2').value = rowstitle 
              
              //公司資訊
              let rowstitle2=[['2024-09 對帳單總表'],['2024-09 對帳單總表2'],['2024-09 對帳單總表3']];
              rowstitle2.forEach((row, index) => {
              worksheet.getCell(`B${3 + index}`).value = row[0]; // 將每一行的第一列資料放入指定儲存格
              });
            //月結
            const data = ['value1', '35000', 'value3', '120000'];
            //   let columnAscii = 65;
            //   data.forEach(value => {
            //   const cell = String.fromCharCode(columnAscii) + '8'; // 將 ASCII 轉為字母再組成單元格名稱
            //   worksheet.getCell(cell).value = value;
            //   columnAscii += 2; // 每次間隔兩個欄位
            // });
            worksheet.getCell('A8').value = data[0];
            worksheet.getCell('C8').value = parseFloat(data[1]); // 千分位格式
            worksheet.getCell('E8').value = data[2];
            worksheet.getCell('G8').value = parseFloat(data[3]); // 千分位格式

            worksheet.getCell('C8').numFmt = '#,##0'; // 千分位格式
            worksheet.getCell('G8').numFmt = '#,##0'; // 千分位格式
            //儲值
            const data2 = ['value1', '35000', 'value3', '120000','120000','120000','120000',120000];
            worksheet.getCell('A11').value = data2[0];
            worksheet.getCell('B11').value = parseFloat(data[1]); 
            worksheet.getCell('C11').value = data2[2];
            worksheet.getCell('D11').value = data2[3]; 
            worksheet.getCell('E11').value = data2[4]; 
            worksheet.getCell('F11').value = data2[5]; 
            worksheet.getCell('G11').value = data2[6]; 
            worksheet.getCell('H11').value = data2[7]; 

            worksheet.getCell('G11').numFmt = '#,##0'; // 千分位格式
            worksheet.getCell('H11').numFmt = '#,##0'; // 千分位格式
            const data3=[ ["113/09","ALT-8729","超級柴油",27314,0,7,212,0],["113/10","ALT-8729","超級柴油",27314,0,7,212,0],["113/11","ALT-8729","超級柴油",273.14,0,7,212,0]]
            // 定義標頭
                const header = [
                  { name: '年月' },
                  { name: '車牌號碼' },
                  { name: '產品名稱' },
                  { name: '公升數合計' },
                  { name: '牌價合計' },
                  { name: '售價合計' },
                  { name: '總里程數' },
                  { name: '油耗' }
                ];
                worksheet.addTable({
                name: 'table名稱', // 表格的名稱
                ref: 'A14', 
                headerRow: false, // 不需要表頭
                columns: header,
                rows: data3 // 將生成的行數據放入表格
              });
              
              const startRow = 14; // 表格起始行
              const endRow = startRow + data3.length-1; // 結束行
              const startCol = 'A'; // 起始列
              const endCol = String.fromCharCode(startCol.charCodeAt(0) + header.length - 1); // 結束列
            // 設定邊框
            for (let row = startRow; row <= endRow; row++) {
                for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
                    const cell = worksheet.getCell(`${String.fromCharCode(col)}${row}`);
                    cell.numFmt = '#,##0';
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                }
            }

            // // 設定邊框並設置居中對齊
            for (let row = startRow; row <= endRow; row++) {
                for (let col = startCol.charCodeAt(0); col <=67; col++) {
                    const cell = worksheet.getCell(`${String.fromCharCode(col)}${row}`);
                    cell.alignment = { horizontal: 'center' };
                }
            }
            worksheet.addRow([]);//空白行
            worksheet.addRow([]);//空白行
          const header2 = ['品項','公升數總計','牌價總計','售價總計'];
          const lastRowNum = worksheet.lastRow.number;
          // 使用 String.fromCharCode() 將列編號轉成字母
          const data4=[ ["超級柴油",1000,34410,344],["無鉛汽油",2000,3,344666],["尿素溶液",3000.5610,555,444],["諾瓦尿素",4000.5610,123131,123131231]]
          const endRow2 = lastRowNum + data4.length+1; // 結束行+標題
          
          for (let row = lastRowNum+1; row <= endRow2; row++) {
                for (let col = startCol.charCodeAt(0); col <= 71; col++) {
                    const cell = worksheet.getCell(`${String.fromCharCode(col)}${row}`);
                    if(col%2==1){
                      worksheet.mergeCells(`${String.fromCharCode(col)}${row}:${String.fromCharCode(col+1)}${row}`);
                    }
                    cell.numFmt = '#,##0';
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                }
            }

           // 插入表頭
           for (let x = 0; x <= 3; x++) { 
            const column = String.fromCharCode(65 + x * 2); // 65 是 'A' 的 ASCII 代碼
            const tableStartRef = `${column}${lastRowNum + 1}`;
            const cell=worksheet.getCell(tableStartRef)
            cell.value = header2[x];
            cell.alignment = { horizontal: 'center' }
            cell.font = { bold: true }; // 設置為粗體
            cell.fill = {
                    // 設置背景顏色為淺灰色
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'DDDDDD' } // 使用十六進制顏色代碼
                };
          }
          //品項
          for (let x = 0; x <= 3; x++) {
            const tableStartRef = `A${lastRowNum +2+x}`;
            const cell=worksheet.getCell(tableStartRef)
            cell.value = data4[x][0];
            cell.alignment = { horizontal: 'center' }
          }
          //公升數
          for (let x = 0; x <= 3; x++) {
            const tableStartRef = `C${lastRowNum +2+x}`;
            worksheet.getCell(tableStartRef).value = data4[x][1];
          }
          //牌價
          for (let x = 0; x <= 3; x++) {
            const tableStartRef = `E${lastRowNum +2+x}`;
            worksheet.getCell(tableStartRef).value = data4[x][2];
          }
          //售價
          for (let x = 0; x <= 3; x++) {
            const tableStartRef = `G${lastRowNum +2+x}`;
            worksheet.getCell(tableStartRef).value = data4[x][3];
          }
          //合計
          const lastrow= worksheet.lastRow.number+1
          worksheet.mergeCells(`A${lastrow}:F${lastrow}`);
          worksheet.mergeCells(`G${lastrow}:H${lastrow}`);
          worksheet.getCell(`A${lastrow}`).value = '合計'
          worksheet.getCell(`G${lastrow}`).value = 8888888
          worksheet.getCell(`A${lastrow}`).font = { bold: true };
          worksheet.getCell(`G${lastrow}`).font = { bold: true };
          worksheet.getCell(`A${lastrow}`).alignment = { horizontal: 'right' }
          worksheet.getCell(`G${lastrow}`).numFmt = '#,##0';
          worksheet.getCell(`A${lastrow}`).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
            };
          worksheet.getCell(`G${lastrow}`).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
            };
          //製卡資料
          worksheet.addRow([]);//空白行
          const thelastrow=worksheet.lastRow.number+1
          const header3 = ['製作日期','車牌號碼','車隊卡卡號','製卡類別','製卡費用'];
          // 使用 String.fromCharCode() 將列編號轉成字母
          const data5=[["2024/10/24","KAA-370","#12161120060714473","尿素-新增製卡",8888], ["2024/10/25","KAA-3770","#121611200607144731","尿素-新增製卡",0],["2024/10/26","KAA-3771","#12","尿素-新增製卡1",0],["2024/10/27","KAA-3772","#12161121","尿素-新增製卡2",0]]
          const endRow3 = worksheet.lastRow.number + data5.length+1; // 結束行+標題
          
          for (let row =thelastrow; row <= endRow3; row++) {
                for (let col = startCol.charCodeAt(0); col <= 71; col++) {
                    const cell = worksheet.getCell(`${String.fromCharCode(col)}${row}`);
                    if(col!=65){
                      if(col%2==1){
                        worksheet.mergeCells(`${String.fromCharCode(col)}${row}:${String.fromCharCode(col+1)}${row}`);
                      }
                    }
                    cell.numFmt = '#,##0';
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                }
            }

           // 插入表頭
           function setCellStyle(cell, value, bold = true, align = 'center', bgColor = 'DDDDDD') {
          cell.value = value;
          cell.alignment = { horizontal: align };
          cell.font = { bold: bold };
          cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: bgColor }
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
           for (let x = 0; x <= data5.length-1 ; x++) {
            const tableStartRef = `A${thelastrow +1 + x}`;
            const cell=worksheet.getCell(tableStartRef)
            cell.value = data5[x][0];
            cell.alignment = { horizontal: 'center' }
          }
          //車牌號碼
          for (let x = 0; x <= data5.length-1 ; x++) {
            const tableStartRef = `B${thelastrow +1 + x}`;
            const cell=worksheet.getCell(tableStartRef)
            cell.value = data5[x][1];
            cell.alignment = { horizontal: 'center' }
          }
          //車隊卡卡號
          for (let x = 0; x <= data5.length-1 ; x++) {
            const tableStartRef = `C${thelastrow +1 + x}`;
            const cell=worksheet.getCell(tableStartRef)
            cell.value = data5[x][2];
            cell.alignment = { horizontal: 'center' }
          }
          //製卡類別
          for (let x = 0; x <= data5.length-1 ; x++) {
            const tableStartRef = `E${thelastrow +1 + x}`;
            const cell=worksheet.getCell(tableStartRef)
            cell.value = data5[x][3];
            cell.alignment = { horizontal: 'center' }
          }
          //製卡費用
          for (let x = 0; x <= data5.length-1 ; x++) {
            const tableStartRef = `G${thelastrow +1 + x}`;
            const cell=worksheet.getCell(tableStartRef)
            cell.value = data5[x][4];
            cell.numFmt = '#,##0';
          }
          //合計
          const lastrow2= worksheet.lastRow.number+1
          worksheet.mergeCells(`A${lastrow2}:F${lastrow2}`);
          worksheet.mergeCells(`G${lastrow2}:H${lastrow2}`);
          worksheet.getCell(`A${lastrow2}`).value = '合計'
          worksheet.getCell(`G${lastrow2}`).value = 88888889
          worksheet.getCell(`A${lastrow2}`).font = { bold: true };
          worksheet.getCell(`G${lastrow2}`).font = { bold: true };
          worksheet.getCell(`A${lastrow2}`).alignment = { horizontal: 'right' }
          worksheet.getCell(`G${lastrow2}`).numFmt = '#,##0';
          worksheet.getCell(`A${lastrow2}`).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
            };
          worksheet.getCell(`G${lastrow2}`).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
            };
            //字型
            worksheet.eachRow((row) => {
              row.eachCell((cell) => {
                // 取得當前儲存格的字型設定
                const currentFont = cell.font || {};

                // 設定字型大小為 12，並保留是否粗體等屬性
                cell.font = { ...currentFont, size: 12 };
              });
            });
            
              // 保存到新的文件
              const newFileName = '母檔測試.xlsx';
              const buffer = await workbook.xlsx.writeBuffer();

              // 生成下載鏈接並觸發下載
              const blob = new Blob([buffer], { type: 'application/octet-stream' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = newFileName;
              link.click();
            } 
              this.$message({
                      message: '匯出成功',
                      type: 'success'
            });
          } catch (error) {
            console.error('Error during export to Excel:', error);
          }
},
  }
};
</script>

<style scoped>
.page-title {
  margin-top: 30px; 
  margin-bottom: 30px; 
  }
  .card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.supplier-card {
  width: 300px;
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.card-body {
  padding: 16px;
}

.card-footer {
  padding: 16px;
  text-align: right;
}
</style>