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
    editSupplier(supplier) {
      // 在这里添加编辑供應商的逻辑
    },
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

              let rowstitle=[['2024-09 對帳單總表']];
              // 處理資料，生成每一行的數據
              // const rowsData = chunk.map((data, index) => [
              //   index + 1, // 流水號
              //   data.license_plate, // 假設 vehicleId 是車牌
              //   data.product_name === '0006' ? 'V' : '', // 超級柴油
              //   data.product_name === '0001' ? 'V' : '', // 無鉛汽油
              //   data.product_name === '0005' ? 'V' : '', // 酒精汽油
              //   data.product_name === '0009' ? 'V' : '', // 不限油品
              //   data.product_name === '0017' ? 'V' : '', // 尿素溶液
              //   data.upload_reason === '新增' ? 'V' : '', // 新增
              //   data.upload_reason === '停用' ? 'V' : '', // 停用
              //   data.upload_reason === '遺失' ? 'V' : '', // 遺失
              //   data.upload_reason === '故障' ? 'V' : '', // 故障
              //   data.upload_reason === '原卡復油' ? 'V' : '', // 原卡復油
              //   data.customerId, // 保管單位
              //   data.custodian.substring(8, 12), // 公司名稱 (取第9~12個字)
              //   data.card_number //備註
              // ]);
              //表頭
              worksheet.addTable({
                name: 'table名稱', // 表格的名稱
                ref: 'A2', 
                headerRow: false, // 不需要表頭
                columns: rowstitle[0].map((_, index) => ({ name: `Column${index + 1}` })),  // 自動產生唯一名稱
                rows: rowstitle // 將生成的行數據放入表格
              });
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
            worksheet.getCell('B11').value = parseFloat(data[1]); // 千分位格式
            worksheet.getCell('C11').value = data2[2];
            worksheet.getCell('D11').value = data2[3]; // 千分位格式
            worksheet.getCell('E11').value = data2[4]; // 千分位格式
            worksheet.getCell('F11').value = data2[5]; // 千分位格式
            worksheet.getCell('G11').value = data2[6]; // 千分位格式
            worksheet.getCell('H11').value = data2[7]; // 千分位格式

            worksheet.getCell('G11').numFmt = '#,##0'; // 千分位格式
            worksheet.getCell('H11').numFmt = '#,##0'; // 千分位格式
              const data3=[ ["113/09","ALT-8729","超級柴油",273.14,,7,212, 0,0],["113/10","ALT-8729","超級柴油","273.14","0","7,212", 0,0],["113/11","ALT-8729","超級柴油","273.14","0","7,212", 0,0]]
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
                ref: 'A15', 
                headerRow: false, // 不需要表頭
                columns:header ,
                rows: data3 // 將生成的行數據放入表格
              });
              
              const startRow = 15; // 表格起始行
              const endRow = startRow + data3.length-1; // 結束行
              const startCol = 'A'; // 起始列
              const endCol = String.fromCharCode(startCol.charCodeAt(0) + header.length - 1); // 結束列
            // 設定邊框
            for (let row = startRow; row <= endRow; row++) {
                for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
                    const cell = worksheet.getCell(`${String.fromCharCode(col)}${row}`);
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                }
            }
            // 設定邊框並設置居中對齊
            for (let row = startRow; row <= endRow; row++) {
                for (let col = startCol.charCodeAt(0); col <=67; col++) {
                    const cell = worksheet.getCell(`${String.fromCharCode(col)}${row}`);
                    cell.alignment = { horizontal: 'center' };
                }
            }

            //     // 插入表格
            //      worksheet.addTable({
            //       name: 'FuelDataTable',
            //       ref: 'A15',
            //       headerRow: true,
            //       columns: header,
            //       rows: [],
            //       style: {           // 設定表格樣式
            //       theme: 'TableStyleLight9', // 選擇淺灰色背景
            //       showRowStripes: true       // 列條紋樣式
            //     }
            //     });

            //     //設置表頭粗體
            //     header.forEach((header, index) => {
            //     const cell = worksheet.getCell(15, index + 1); // index + 1 使列從 1 開始，對應 A-H
            //     cell.value = header; // 設置單元格的值
            //     cell.font = { bold: true }; // 設置為粗體
            //     cell.alignment = { horizontal: 'center' }; // 水平居中
            //     cell.fill = {
            //         // 設置背景顏色為淺灰色
            //         type: 'pattern',
            //         pattern: 'solid',
            //         fgColor: { argb: 'D3D3D3' } // 使用十六進制顏色代碼
            //     };
            // });

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