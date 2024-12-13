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
          @change="clink()"
        />
        <!-- 發送方式的下拉框 -->
        <el-select
          v-model="selectedSendMode"
          placeholder="請選擇發送方式"
          style="width: 150px; margin-right: 10px"
          @change="selectbillNotify()"
        >
          <el-option label="寄送" value="1" />
          <el-option label="Line" value="2" />
          <el-option label="mail" value="3" />
        </el-select>
        <el-select
          v-model="select"
          placeholder="請選擇匯出項目"
          style="width: 150px; margin-right: 10px"
          @change="APIData()"
        >
          <el-option label="總表" value="1" />
          <el-option label="明細" value="2" />
        </el-select>
        <el-button type="success" @click="exportAll">匯出</el-button>
      </div>
    </el-form-item>
    <div class="pagination-info">
      共{{ this.AllContact.length }}位聯絡人，共{{
        this.groupContact.length
      }}位查詢客戶需要發送，共{{
        this.cus_info.length
      }}位客戶查詢資料成功，共取得{{ this.Account.length }}筆帳單資料
    </div>
    <!-- <div class="pagination-info" v-if="this.select">
      去除無資料帳單，剩餘{{ this.cus_message.length }}筆需匯出
    </div> -->

    <!-- <div class="pagination-info">共顯示{{ this.cus_message.length }}筆資料</div> -->
    <el-form-item label="需列印客戶" class="section-header">
      <div class="table-container">
        <el-table :data="cus_message" style="width: 100%">
          <el-table-column prop="account_sortId" label="帳單編號" width="150" />
          <el-table-column prop="customerId" label="客戶代號" width="150" />
          <el-table-column prop="cus_name" label="客戶名稱" width="300" />
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
    :show-close="false"
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
        // {
        //   account_sortId: "646",
        //   customerId: "G2200072",
        //   cusName: "世發通運有限公司",
        //   transaction_mode: "1", //交易模式
        //   invoice_name: "世發通運有限公司", //發票抬頭
        //   acc_name: "世發通運有限公司", //帳單名稱
        // },
        // {
        //   account_sortId: "713",
        //   customerId: "G2200002",
        //   cusName: "詮瑞福物流股份有限公司",
        //   transaction_mode: "2", //交易模式
        //   invoice_name: "詮瑞福物流股份有限公司", //發票抬頭
        //   acc_name: "詮瑞福物流股份有限公司", //帳單名稱
        // },
        // {
        //   account_sortId: "1352",
        //   customerId: "G2200002",
        //   cusName: "紘鼎開發工程有限公司",
        //   transaction_mode: "2", //交易模式
        //   invoice_name: "紘鼎開發工程有限公司", //發票抬頭
        //   acc_name: "紘鼎開發工程有限公司", //帳單名稱
        // },
      ],
      //  DDD:"G2200072,G2200176,G2200230,G2200260,G2200319,G2200520,G2200608,G2200782,G2200783",
      DDD: "G2200741",
      Statement: [],
      DetaProduct: [],
      Balance: [],
      collateral: [],
      Details: [],
      AllContact: [], //所有聯絡人
      groupContact: [], //去除重複 且須列印客戶
      cus_info: [], //所有客戶的姓名 交易模式
      Account: [], //{"account_sortId":806,"customerId":"G2200739","invoice_name":"廣獲企業股份有限公司","acc_name":"廣獲企業股份有限公司"},{"account_sortId":732,"customerId":"G2100006","invoice_name":"今齊物流有限公司","acc_name":"今齊物流有限公司"}
    };
  },
  created() {
    this.getselectContact();
  },
  methods: {
    async getselectContact() {
      try {
        this.isLoading = true; // 開始加載
        const response = await axios.get(
          "http://122.116.23.30:3347/main/selectContact"
        );
        // this.AllContact = response.data.data; //全部的聯絡人
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async selectbillNotify() {
      this.isLoading = true;
      this.groupContact = [];
      this.cus_info = [];
      this.Account = [];
      const uniqueCustomerIds = new Set();
      if (this.selectedSendMode == "1") {
        this.groupContact = this.AllContact.filter(
          (contact) => contact.billNotify === "1"
        );
      } else if (this.selectedSendMode == "2") {
        this.groupContact = this.AllContact.filter(
          (contact) => contact.billNotify === "2"
        );
      } else if (this.selectedSendMode == "3") {
        this.groupContact = this.AllContact.filter(
          (contact) => contact.billNotify === "3"
        );
      }
      this.groupContact = this.groupContact
        .filter((contact) => {
          if (uniqueCustomerIds.has(contact.customerId)) {
            return false; // 若 customerId 已存在，過濾掉
          }
          uniqueCustomerIds.add(contact.customerId); // 新增至 Set，表示已處理過
          return true; // 保留該筆資料
        })
        .map((contact) => ({
          customerId: contact.customerId, // 保留 customerId
          billNotify: contact.billNotify, // 保留 billNotify
        }));

      //自訂匯出
      this.groupContact = this.DDD.split(",").map((customerId) => ({
        customerId,
      }));

      this.groupContact.sort((a, b) => {
        // 字串排序（假設 customerId 是字串，根據字典順序）
        return a.customerId.localeCompare(b.customerId);
      });
      try {
        await this.getcus();
        await this.getAccount();
      } catch {
        console.error("請求錯誤:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async APIData() {
      this.cus_message = []; //清空需匯出資料
      this.isLoading = true;
      if (this.select == 1) {
        try {
          for (let i = 0; i < this.Account.length; i++) {
            const selectcus = this.Account[i];
            const postdata = {
              date: this.search_month,
              customerId: selectcus.customerId,
              account_sortId: selectcus.account_sortId,
            };

            try {
              const response = await axios.post(
                "http://122.116.23.30:3346/main/accountStatement",
                postdata
              );

              // 如果查不到資料，移除該項目
              if (
                response.data.data.details.length == 0 &&
                response.data.data.product.length == 0 &&
                response.data.data.cardIssuanceFee.length == 0
              ) {
                this.Account.splice(i, 1);
                i--; // 刪除元素後，將索引減少，保證遍歷不會漏掉下一個元素
              }
            } catch (error) {
              console.error("請求錯誤:", error);
            }
          }
        } catch (error) {
          console.error("Error fetching customer data:", error);
        } finally {
          if (this.Account.length > 0) {
            await this.matchdata();
          }
          this.isLoading = false;
        }
      } else if (this.select == 2) {
        try {
          for (let i = 0; i < this.Account.length; i++) {
            const selectcus = this.Account[i];
            const postdata = {
              date: this.search_month,
              customerId: selectcus.customerId,
              account_sortId: selectcus.account_sortId,
            };

            try {
              const response = await axios.post(
                "http://122.116.23.30:3346/main/accountDetails",
                postdata
              );
              // 如果查不到資料，移除該項目
              if (response.data.data.length == 0) {
                this.Account.splice(i, 1);
                i--; // 刪除元素後，將索引減少，保證遍歷不會漏掉下一個元素
              }
            } catch (error) {
              console.error("請求錯誤:", error);
            }
          }
        } catch (error) {
          console.error("Error fetching customer data:", error);
        } finally {
          if (this.Account.length > 0) {
            await this.matchdata();
          }
          this.isLoading = false;
        }
      }
    },
    clink() {
      (this.selectedSendMode = ""), (this.select = "");
    },

    async matchdata() {
      for (const account of this.Account) {
        const customerId = account.customerId;

        // 找到與 Account 的 customerId 對應的 cus_info
        const cusData = this.cus_info.find(
          (cus) => cus.cus_code === customerId
        );

        if (cusData) {
          // 創建一個新的物件，將 Account 和 cus_info 的資料合併
          const newAccountData = {
            ...account, // 保留 Account 的原始資料
            cus_name: cusData.cus_name, // 新增 cus_name
            transaction_mode: cusData.transaction_mode, // 新增 transaction_mode
          };
          // 把新資料加入 cus_message 陣列
          this.cus_message.push(newAccountData);
        }
      }
    },
    async getAccount() {
      try {
        for (const selectcus of this.groupContact) {
          const postdata = {
            customerId: selectcus.customerId,
          };
          const response = await axios.post(
            "http://122.116.23.30:3347/main/searchAccount_sort",
            postdata
          );
          for (let x = 0; x < response.data.data.length; x++) {
            this.Account.push({
              account_sortId: response.data.data[x].account_sortId,
              customerId: response.data.data[x].customerId,
              invoice_name: response.data.data[x].invoice_name,
              acc_name: response.data.data[x].acc_name,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    async getcus() {
      try {
        for (const selectcus of this.groupContact) {
          const postdata = {
            cus_code: selectcus.customerId,
          };
          const response = await axios.post(
            "http://122.116.23.30:3347/main/searchCustomer",
            postdata
          );
          this.cus_info.push({
            cus_code: response.data.data[0].cus_code,
            cus_name: response.data.data[0].cus_name,
            transaction_mode: response.data.data[0].transaction_mode,
          });
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },

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
    async DetailsProduct(postData) {
      // 準備 postData
      const sortOrder = ["超級柴油", "無鉛汽油", "尿素溶液", "諾瓦尿素"];
      console.log("1.2明細 總表小計");
      // 發送 API 請求獲取帳單資料
      try {
        const response = await axios.post(
          "http://122.116.23.30:3346/main/accountStatement",
          postData
        );
        this.DetaProduct = response.data.data.product;
        // 排序邏輯
        this.DetaProduct.sort((a, b) => {
          const indexA = sortOrder.indexOf(a.product_name);
          const indexB = sortOrder.indexOf(b.product_name);
          return indexA - indexB;
        });
        console.log("DetaProduct" + JSON.stringify(this.DetaProduct));
      } catch (error) {
        console.error("API request failed:", error);
      }
      console.log("1.2結束");
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
            cus_name,
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
            console.log(`${customerId}資料缺少必要欄位，無法匯出`);
            continue;
          }
          this.Balance = [];
          this.collateral = [];
          this.Statement = [];
          this.Details = [];
          this.DetaProduct = [];
          await this.exportTYPE(customerId, account_sortId); // 查詢總表或明細
          await this.transactionTYPE(transaction_mode, customerId); //儲值月結資料查詢
          // 匯出Excel的功能
          await this.exportToExcel(
            cus_name,
            transaction_mode,
            invoice_name,
            acc_name,
            this.select,
            customerId
          );
        }
      } catch (error) {
        console.error("Error during exportAll:", error);
        this.$message({
          message: "匯出時發生錯誤",
          type: "error",
        });
      } finally {
        this.isLoading = false;
      }
    },

    async exportTYPE(customerId, account_sortId) {
      // 準備 postData
      console.log(1);
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
          this.Statement = response.data.data;
        } catch (error) {
          console.error("API request failed:", error);
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
          await this.groupDataByPlateAndProduct();
          await this.DetailsProduct(postData);
        } catch (error) {
          console.error("API request failed:", error);
        }
      }
      console.log("1結束");
    },
    async transactionTYPE(transaction_mode, customerId) {
      // 根據交易模式執行相應操作
      console.log(2);
      try {
        if (transaction_mode == 1) {
          //儲值
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
        } else if (transaction_mode == 2) {
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
        }
      } catch (error) {
        console.error("API request failed:", error);
      }
      console.log("2結束");
    },
    async exportToExcel(
      cus_name,
      transaction_mode,
      invoice_name,
      acc_name,
      select,
      customerId
    ) {
      console.log(3);
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
          const config_notes = this.collateral.config_notes; //擔保品
          const data4 = this.Statement.product;
          const sortOrder = ["超級柴油", "無鉛汽油", "尿素溶液", "諾瓦尿素"];
          // 排序邏輯
          data4.sort((a, b) => {
            const indexA = sortOrder.indexOf(a.product_name);
            const indexB = sortOrder.indexOf(b.product_name);
            return indexA - indexB;
          });
          console.log(JSON.stringify(this.Statement));
          console.log(JSON.stringify(data4));
          const data5 = this.Statement.cardIssuanceFee;
          const summary_data = this.Statement.details.map((row) => [
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
            [`帳單期別：${this.search_month}`],
            [`公司名稱：${cus_name}`],
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
            const items = config_notes.split(", ").map((item) => {
              const match = item.match(/(.+):\s*([\d]+)(.*)/);
              if (match) {
                return {
                  config: match[1].trim(), // 提取前面的項目
                  config_value: match[2].trim() + match[3]?.trim(), // 提取數值
                };
              }
              return null;
            });
            const filteredItems = items.filter(
              (item) => item && item.config_value != 0
            );

            // 分別取出 config 和 config_value
            const configs = filteredItems.map((item) => item.config);
            const config_values = filteredItems.map(
              (item) => item.config_value
            );
            const data = [
              `${configs}`,
              `${config_values}`,
              `${payment_deadline}`,
              `${total}`,
            ];
            worksheet.getCell("A7").value = data[0];
            worksheet.getCell("C7").value = data[1];
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
              if (col == 68) {
                cell.numFmt = "#,##0.00";
              } else if (col == 72) {
                cell.numFmt = "#,##0.00";
              } else {
                cell.numFmt = "#,##0";
              }
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
          //這裡
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
            cell.numFmt = "#,##0.00";
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
          //製卡資料
          if (data5.length > 0) {
            const thelastrow = lastrow + 2;
            const header3 = [
              "製作日期",
              "車牌號碼",
              "車隊卡卡號",
              "製卡類別",
              "製卡費用",
            ];
            // 使用 String.fromCharCode() 將列編號轉成字母

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
              cell.value = data5[x].credit_amount;
              cell.alignment = { horizontal: "center" };
            }
            //車牌號碼
            for (let x = 0; x <= data5.length - 1; x++) {
              const tableStartRef = `B${thelastrow + 1 + x}`;
              const cell = worksheet.getCell(tableStartRef);
              cell.value = data5[x].bank_amount;
              cell.alignment = { horizontal: "center" };
            }
            //車隊卡卡號
            for (let x = 0; x <= data5.length - 1; x++) {
              const tableStartRef = `C${thelastrow + 1 + x}`;
              const cell = worksheet.getCell(tableStartRef);
              cell.value = data5[x].credit_card_data;
              cell.alignment = { horizontal: "center" };
            }
            //製卡類別
            for (let x = 0; x <= data5.length - 1; x++) {
              const tableStartRef = `E${thelastrow + 1 + x}`;
              const cell = worksheet.getCell(tableStartRef);
              cell.value = data5[x].bank;
              cell.alignment = { horizontal: "center" };
            }
            //製卡費用
            for (let x = 0; x <= data5.length - 1; x++) {
              const tableStartRef = `G${thelastrow + 1 + x}`;
              const cell = worksheet.getCell(tableStartRef);
              cell.value = Number(data5[x].amount);
              cell.numFmt = "#,##0";
            }

            //合計
            const totalAmount2 = data5.reduce((sum, item) => {
              // 這裡會加總每個 item 的 amount
              return sum + parseFloat(item.amount); // 確保 amount 是數字
            }, 0); // 初始總和是 0
            const lastrow2 = thelastrow + data5.length + 1;
            worksheet.mergeCells(`A${lastrow2}:F${lastrow2}`);
            worksheet.mergeCells(`G${lastrow2}:H${lastrow2}`);
            worksheet.getCell(`A${lastrow2}`).value = "合計";
            worksheet.getCell(`G${lastrow2}`).value = Number(totalAmount2);
            worksheet.getCell(`A${lastrow2}`).font = { bold: true };
            worksheet.getCell(`G${lastrow2}`).font = { bold: true };
            worksheet.getCell(`A${lastrow2}`).alignment = {
              horizontal: "right",
            };
            worksheet.getCell(`G${lastrow2}`).numFmt = "#,##0";
            worksheet.getCell(`A${lastrow2}`).border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
            worksheet.getCell(`G${lastrow2}`).border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          }
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
          // 添加 A9-G9 的上框線
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
          const columnsToAdjust = ["A", "B", "C", "D", "E", "F", "H"]; // 需要調整的欄
          columnsToAdjust.forEach((col) => {
            const columnIndex = worksheet.getColumn(col).number; // 取得欄位編號
            worksheet.getColumn(columnIndex).width = 16; // 設定欄寬，數字可調整
          });
          // 保存到新的文件
          newFileName = `${this.search_month}總表_${customerId}_${acc_name}.xlsx`;
          buffer = await workbook.xlsx.writeBuffer();
        } else if (select == 2) {
          //公司資訊
          let rowstitle = [
            [this.search_month],
            [cus_name],
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
                if (colIndex == 4) {
                  cell.numFmt = "#,##0.0";
                } else if (colIndex == 5) {
                  cell.numFmt = "#,##0.00";
                } else if (colIndex == 6) {
                  cell.numFmt = "#,##0.0";
                } else {
                  cell.numFmt = "#,##0";
                }
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
            mergedCell.font = { ...mergedCell.font, bold: true }; // 粗體（可選）

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
          //這裡
          if (this.DetaProduct && this.DetaProduct.length > 0) {
            const header2 = ["品項", "公升數總計", "牌價總計", "售價總計"];
            const columns = ["A", "C", "F", "I"];
            console.log("有油類加總");
            let lastRowNumber = 0;
            worksheet.eachRow((row, rowNumber) => {
              if (row.hasValues) {
                lastRowNumber = rowNumber;
              }
            });

            const lastRowNum = lastRowNumber + 1;

            // 使用 String.fromCharCode() 將列編號轉成字母
            const endRow2 = lastRowNum + this.DetaProduct.length + 1; // 結束行+標題
            for (let row = lastRowNum + 1; row <= endRow2; row++) {
              // 合併 "AB"
              worksheet.mergeCells(`A${row}:B${row}`);
              const cellAB = worksheet.getCell(`A${row}`);
              cellAB.numFmt = "#,##0";

              // 合併 "CDE"
              worksheet.mergeCells(`C${row}:E${row}`);
              const cellCDE = worksheet.getCell(`C${row}`);
              cellCDE.numFmt = "#,##0";

              // 合併 "FGH"
              worksheet.mergeCells(`F${row}:H${row}`);
              const cellFGH = worksheet.getCell(`F${row}`);
              cellFGH.numFmt = "#,##0";

              // 合併 "IJ"
              worksheet.mergeCells(`I${row}:J${row}`);
              const cellIJ = worksheet.getCell(`I${row}`);
              cellIJ.numFmt = "#,##0";
            }
            // 插入表頭

            for (let x = 0; x < header2.length; x++) {
              const column = columns[x]; // 根據 A, C, F, I 的欄位
              const tableStartRef = `${column}${lastRowNum + 1}`;
              const cell = worksheet.getCell(tableStartRef);

              cell.value = header2[x]; // 插入表頭內容
              cell.alignment = { horizontal: "center" }; // 設置文字置中
              cell.font = { ...cell.font, bold: true }; // 設置為粗體
              cell.fill = {
                // 設置背景顏色為淺灰色
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "f2f2f2" }, // 使用十六進制顏色代碼
              };
            }
            //品項
            for (let x = 0; x <= this.DetaProduct.length - 1; x++) {
              const tableStartRef = `A${lastRowNum + 2 + x}`;
              const cell = worksheet.getCell(tableStartRef);
              cell.value = this.DetaProduct[x].product_name;
              cell.alignment = { horizontal: "center" };
            }
            //公升數
            for (let x = 0; x <= this.DetaProduct.length - 1; x++) {
              const tableStartRef = `C${lastRowNum + 2 + x}`;
              const cell = worksheet.getCell(tableStartRef);
              cell.value = parseFloat(this.DetaProduct[x].fuel_volume);
              cell.numFmt = "#,##0.00";
              cell.alignment = { horizontal: "right" };
            }
            //牌價
            for (let x = 0; x <= this.DetaProduct.length - 1; x++) {
              const tableStartRef = `F${lastRowNum + 2 + x}`;
              worksheet.getCell(tableStartRef).value = parseFloat(
                this.DetaProduct[x].reference_amount
              );
            }
            //售價
            for (let x = 0; x <= this.DetaProduct.length - 1; x++) {
              const tableStartRef = `I${lastRowNum + 2 + x}`;
              worksheet.getCell(tableStartRef).value = parseFloat(
                this.DetaProduct[x].amount
              );
            }
            // 合計
            const totalAmount = this.DetaProduct.reduce((sum, item) => {
              // 這裡會加總每個 item 的 amount
              return sum + parseFloat(item.amount); // 確保 amount 是數字
            }, 0); // 初始總和是 0
            const lastrow = endRow2 + 1;
            worksheet.mergeCells(`A${lastrow}:H${lastrow}`);
            worksheet.mergeCells(`I${lastrow}:J${lastrow}`);
            worksheet.getCell(`A${lastrow}`).value = "合計";
            worksheet.getCell(`I${lastrow}`).value = parseFloat(totalAmount);
            const total = worksheet.getCell(`A${lastrow}`);
            const totalNum = worksheet.getCell(`I${lastrow}`);
            total.font = {
              ...total.font, // 保留現有字體屬性
              bold: true, // 設置為粗體
            };
            totalNum.font = {
              ...totalNum.font, // 保留現有字體屬性
              bold: true, // 設置為粗體
            };
            worksheet.getCell(`A${lastrow}`).alignment = {
              horizontal: "right",
            };
            worksheet.getCell(`I${lastrow}`).numFmt = "#,##0";
            worksheet.getCell(`A${lastrow}`).border = {
              top: { style: "thin", color: { argb: "C0C0C0" } },
              left: { style: "thin", color: { argb: "C0C0C0" } },
              bottom: { style: "thin", color: { argb: "C0C0C0" } },
              right: { style: "thin", color: { argb: "C0C0C0" } },
            };
            worksheet.getCell(`I${lastrow}`).border = {
              top: { style: "thin", color: { argb: "C0C0C0" } },
              left: { style: "thin", color: { argb: "C0C0C0" } },
              bottom: { style: "thin", color: { argb: "C0C0C0" } },
              right: { style: "thin", color: { argb: "C0C0C0" } },
            };
            for (
              let row = lastRowNum + 1;
              row <= lastRowNum + this.DetaProduct.length + 1;
              row++
            ) {
              for (let col = 65; col <= 74; col++) {
                const cellRef = `${String.fromCharCode(col)}${row}`; // 計算儲存格編號
                const cell = worksheet.getCell(cellRef); // 獲取儲存格

                // 設定儲存格的邊框樣式
                cell.border = {
                  top: { style: "thin", color: { argb: "C0C0C0" } },
                  left: { style: "thin", color: { argb: "C0C0C0" } },
                  bottom: { style: "thin", color: { argb: "C0C0C0" } },
                  right: { style: "thin", color: { argb: "C0C0C0" } },
                };
              }
            }
          }

          const columnsToAdjust = ["A", "D", "H", "I", "J"]; // 需要調整的欄
          columnsToAdjust.forEach((col) => {
            const columnIndex = worksheet.getColumn(col).number; // 取得欄位編號
            worksheet.getColumn(columnIndex).width = 14; // 設定欄寬，數字可調整
          });
          worksheet.getColumn(2).width = 22; // 設定B欄寬
          worksheet.getColumn(3).width = 22; // 設定C欄寬
          // 保存到新的文件
          newFileName = `${this.search_month}明細_${customerId}_${acc_name}.xlsx`;
          buffer = await workbook.xlsx.writeBuffer();
        }
        // 生成下載鏈接並觸發下載
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = newFileName;
        link.click();

        // 顯示成功訊息
        this.$message({
          message: `${this.search_month}_${customerId}_${acc_name}.xlsx 匯出成功`,
          type: "success",
        });
        console.log("3結束");
      } catch (error) {
        this.$message({
          message: `${this.search_month}_${customerId}_${acc_name}.xlsx 匯出失敗`,
          type: "error",
        });
        console.error("Error during export to Excel:", error);
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
