<script>
import ExcelJS from "exceljs";
import axios from "axios";

export default {
  name: "ExportSelCard",
  data() {
    return {
      customers: [],
      UreaCard: [], //尿素資料
      gas: [],
      Vehicle: [],
      Bill: [],
      Allexport: [],
      productMap: [],
    };
  },
  methods: {
    async getproduct_name() {
      await axios
        .get("http://122.116.23.30:3347/main/selectProduct")
        .then((response) => {
          this.productMap = response.data.data;
        })
        .catch((error) => {
          // 處理錯誤
          console.error("API request failed:", error);
        });
    },
    async getselectCUSData() {
      try {
        // 發送 GET 請求到指定的 API
        const response = await axios.get(
          "http://122.116.23.30:3347/main/selectCustomer"
        );
        const customerData = response.data.data;
        // 將資料放入 customers 陣列中
        this.customers = customerData;
        this.customers.sort((a, b) => {
          // 字串排序（假設 customerId 是字串，根據字典順序）
          return a.cus_code.localeCompare(b.cus_code);
        });
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    async getselectCARData() {
      try {
        // 發送 GET 請求到指定的 API
        const response = await axios.get(
          "http://122.116.23.30:3347/main/selectAllCard"
        );
        const Allcard = response.data.data;
        // 將資料放入 customers 陣列中
        this.gas = Allcard.filter(
          //油
          (card) =>
            card.buildType == "3" &&
            (card.card_type === "2" || card.card_type === "3")
        );
        this.UreaCard = Allcard.filter(
          //尿素
          (card) => card.buildType == "3" && card.card_type === "1"
        );
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    async getselectVEHData() {
      try {
        // 發送 GET 請求到指定的 API
        const response = await axios.get(
          "http://122.116.23.30:3347/main/selectVehicle "
        );
        this.Vehicle = response.data.data;
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    async getselectBillData() {
      try {
        // 發送 GET 請求到指定的 API
        const response = await axios.get(
          "http://122.116.23.30:3347/main/selectAccount_sort"
        );
        this.Bill = response.data.data;
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    },
    async doData() {
      this.gas = this.gas.filter((gas) => {
        // 嘗試找到對應的車籍資料
        const Vehicle = this.Vehicle.find((v) => v.vehicleId === gas.vehicleId);
        // 如果沒有找到對應的 vehicleId，則返回 false，把該筆資料過濾掉
        return Vehicle !== undefined;
      });
      this.UreaCard = this.UreaCard.filter((UreaCard) => {
        // 嘗試找到對應的車籍資料
        const Vehicle = this.Vehicle.find(
          (v) => v.vehicleId === UreaCard.vehicleId
        );
        // 如果沒有找到對應的 vehicleId，則返回 false，把該筆資料過濾掉
        return Vehicle !== undefined;
      });

      this.Allexport = this.gas.map((gas) => {
        // 找到對應的車籍
        const Vehicle = this.Vehicle.find((v) => v.vehicleId === gas.vehicleId);
        const customerId = Vehicle ? Vehicle.customerId : "";
        const license_plate = Vehicle ? Vehicle.license_plate : "";
        const product_name = Vehicle ? Vehicle.product_name : "";
        const account_sortId = Vehicle ? Vehicle.account_sortId : "";

        // 2. 找到對應的公司名稱資料
        const customer = this.customers.find((c) => c.cus_code === customerId);
        const cus_name = customer ? customer.cus_name : "";

        // 3. 找到對應的帳單資料
        const Bill = this.Bill.find((b) => b.account_sortId === account_sortId);
        const acc_name = Bill ? Bill.acc_name : "";

        // 4. 將資料組合起來
        return {
          ...gas,
          customerId,
          license_plate,
          product_name,
          account_sortId,
          cus_name,
          acc_name,
          UreaCard: null, // 預設為 null，稍後會根據 UreaCard 的資料進行填充
        };
      });

      // Step 2: 根據 UreaCard 找到對應的車籍資料並更新 Allexport 中的資料
      this.UreaCard.forEach((urea) => {
        // 1. 根據 vehicleId 找到對應的 gas 資料
        const matchingGas = this.Allexport.find(
          (exportItem) => exportItem.vehicleId === urea.vehicleId
        );

        // 2. 如果找到對應的 gas 資料，就更新 UreaCard 欄位
        if (matchingGas) {
          matchingGas.UreaCard = urea.card_number; // 填入對應的 card_number
        } else {
          // 3. 如果找不到對應的 gas 資料，還是把這筆 UreaCard 資料加入 Allexport
          // 這裡會按照 gas 的結構來填充資料，並且加入 UreaCard 欄位
          const Vehicle = this.Vehicle.find(
            (v) => v.vehicleId === urea.vehicleId
          );
          const customerId = Vehicle ? Vehicle.customerId : "";
          const license_plate = Vehicle ? Vehicle.license_plate : "";
          const product_name = Vehicle ? Vehicle.product_name : "";
          const account_sortId = Vehicle ? Vehicle.account_sortId : "";

          const customer = this.customers.find(
            (c) => c.cus_code === customerId
          );
          const cus_name = customer ? customer.cus_name : "";

          const Bill = this.Bill.find(
            (b) => b.account_sortId === account_sortId
          );
          const acc_name = Bill ? Bill.acc_name : "";

          // 把資料填充並加入 Allexport
          this.Allexport.push({
            vehicleId: urea.vehicleId,
            customerId,
            license_plate,
            product_name,
            account_sortId,
            cus_name,
            acc_name,
            UreaCard: urea.card_number, // 填入對應的 card_number
          });
        }
      });

      // 遍歷 this.Allexport 中的每一筆資料
      this.Allexport = this.Allexport.map((exportItem) => {
        // 根據 product_name 查找對應的 productMap 資料
        const matchingProduct = this.productMap.find(
          (product) => product.classId === exportItem.product_name
        );

        // 如果找到了對應的 productName，就將 product_name 換成 className
        const updatedProductName = matchingProduct
          ? matchingProduct.className
          : exportItem.product_name;

        return {
          ...exportItem,
          product_name: updatedProductName, // 更新 product_name
        };
      });
      this.Allexport = this.Allexport.filter((item) =>
        this.cus_code === item.customerId)
      ;
    },
    async exportExcel(cus_code, cus_name) {
      this.cus_code = cus_code;
      this.cus_name = cus_name;
      console.log("1查詢客戶資料");
      await this.getselectCUSData();
      console.log(this.cus_code, this.cus_name);
      console.log("1查詢客戶資料");
      await this.getselectCUSData();
      console.log("1結束");
      console.log("2查詢卡號資料");
      await this.getselectCARData();
      console.log("2結束");
      console.log("3查詢車籍資料");
      await this.getselectVEHData();
      console.log("3結束");
      console.log("4查詢帳單資料");
      await this.getselectBillData();
      console.log("4結束");
      console.log("5查尋產品名稱");
      await this.getproduct_name();
      console.log("5結束");
      console.log("6組成資料");
      await this.doData();
      console.log("6結束");
      console.log("7 匯出");
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
        this.Allexport.forEach((data, index) => {
          const rowIndex = index + 2; // 從 A2 開始
          worksheet.getCell(`A${rowIndex}`).value = data.customerId || "";
          worksheet.getCell(`B${rowIndex}`).value = data.cus_name || "";
          worksheet.getCell(`C${rowIndex}`).value = data.acc_name || "";
          worksheet.getCell(`D${rowIndex}`).value = data.license_plate || "";
          worksheet.getCell(`E${rowIndex}`).value = data.product_name || "";
          worksheet.getCell(`F${rowIndex}`).value = data.card_number || "";
          worksheet.getCell(`G${rowIndex}`).value =
            data.card_arrival_date || "";
          worksheet.getCell(`H${rowIndex}`).value = data.card_stop_date || "";
          worksheet.getCell(`I${rowIndex}`).value = data.UreaCard || "";
          worksheet.getCell(`J${rowIndex}`).value = data.notes || "";
        });
        worksheet.getColumn(2).width = 50;
        worksheet.getColumn(3).width = 60;
        worksheet.getColumn(9).width = 28;
        worksheet.getColumn(10).width = 60;
        // 生成下載鏈接並觸發下載
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${this.cus_code}_${this.cus_name}_車籍資料表.xlsx`; // 設定下載檔案名
        link.click();
        console.log("7結束");
      } catch (error) {
        console.error("Error during export to Excel:", error);
      }
    },
  },
};
</script>
