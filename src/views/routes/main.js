const router = require('express').Router()
const Controllers = require('../controllers')

router.get('/selectCustomer', Controllers.main.selectCustomer);   // 取得客戶資料
router.post('/searchCustomer', Controllers.main.searchCustomer);  // 查詢客戶資料
router.post('/createCustomer', Controllers.main.createCustomer);  // 新增客戶資料
router.post('/updateCustomer', Controllers.main.updateCustomer);  // 修改客戶資料
router.post('/updateCuscardStatus', Controllers.main.updateCuscardStatus);  // 修改客戶鎖卡狀態
router.post('/exportCuscardStatus', Controllers.main.exportCuscardStatus);  // 匯出客戶鎖卡狀態
router.post('/deleteCustomer', Controllers.main.deleteCustomer);  // 刪除客戶資料

router.get('/selectContact', Controllers.main.selectContact);   // 取得聯絡人資料
router.post('/searchContact', Controllers.main.searchContact);   // 查詢客戶聯絡人資料
router.post('/createContact', Controllers.main.createContact);  // 新增聯絡人資料
router.post('/updateContact', Controllers.main.updateContact);  // 修改聯絡人資料

router.get('/selectAccount_sort', Controllers.main.selectAccount_sort);   // 取得帳單資料
router.post('/searchAccount_sort', Controllers.main.searchAccount_sort);  // 查詢客戶帳單資料
router.post('/viewAccount_sort', Controllers.main.viewAccount_sort);  // 瀏覽指定帳單資料
router.post('/createAccount_sort', Controllers.main.createAccount_sort);  // 新增帳單資料
router.post('/updateAccount_sort', Controllers.main.updateAccount_sort);  // 修改帳單資料
router.post('/deleteAccount_sort', Controllers.main.deleteAccount_sort);  // 刪除帳單資料

router.get('/selectVehicle', Controllers.main.selectVehicle);   // 取得車籍資料
router.post('/searchVehicle', Controllers.main.searchVehicle);   // 查詢客戶車籍資料
router.post('/createVehicle', Controllers.main.createVehicle);  // 新增車籍資料
router.post('/updateVehicle', Controllers.main.updateVehicle);  // 修改車籍資料
router.post('/deleteVehicle', Controllers.main.deleteVehicle);  // 刪除車籍資料

router.get('/selectAllCard', Controllers.main.selectAllCard);   // 取得車籍卡片資料
router.post('/searchCard', Controllers.main.searchCard);   // 查詢車籍卡片資料
router.post('/createCard', Controllers.main.createCard);  // 新增車籍卡片資料
router.post('/updateCard', Controllers.main.updateCard);  // 修改車籍卡片資料
router.post('/deleteCard', Controllers.main.deleteCard);  // 刪除車籍卡片資料

router.get('/selectSalesman', Controllers.main.selectSalesman);   // 取得業務員資料
router.post('/searchSalesman', Controllers.main.searchSalesman);  // 查詢客戶的業務員資料
router.post('/createSalesman', Controllers.main.createSalesman);  // 新增業務員資料
router.post('/updateSalesman', Controllers.main.updateSalesman);  // 修改業務員資料
router.post('/updateSales_relation', Controllers.main.updateSales_relation);  // 更改客戶負責的業務員

router.get('/selectDiscount', Controllers.main.selectDiscount);   // 取得折讓資料
router.post('/searchDiscount', Controllers.main.searchDiscount);  // 查詢折讓資料
router.post('/createDiscount', Controllers.main.createDiscount);  // 新增折讓資料
router.post('/updateDiscount', Controllers.main.updateDiscount);  // 修改折讓資料
router.post('/deleteDiscount', Controllers.main.deleteDiscount);  // 刪除折讓資料

router.post('/searchPlate', Controllers.main.searchPlate);   // 查詢車籍資料(車號)
router.post('/transformation', Controllers.main.transformation);  // 轉客代或帳單組別
router.get('/selectProduct', Controllers.main.selectProduct);  // 取出油品種類
router.post('/modificationDiscount', Controllers.main.modificationDiscount);  // 調整折讓
router.post('/selectDefnotify', Controllers.main.selectDefnotify);  // 取得未發簡訊
router.post('/setDefnotify', Controllers.main.setDefnotify);  // 設定傳送訊息


//大批處理
router.get('/getRecordedVehicle', Controllers.main.getRecordedVehicle);   // 取出登錄車籍資料
router.post('/recordedVehicle', Controllers.main.recordedVehicle);   // 登錄車籍資料
router.post('/generateCPCfile', Controllers.main.generateCPCfile);  // 產生中油檔
router.post('/importCPCfile', Controllers.main.importCPCfile);  // 匯入中油檔
router.get('/selectCPCdata', Controllers.main.selectCPCdata);  // 未核對中油檔資料




// router.get('/selectSINOPAC', Controllers.main.selectSINOPAC);   // 取得永豐資料
// router.post('/searchSINOPAC', Controllers.main.searchSINOPAC);  // 查詢客戶的永豐資料
// router.post('/createDiscount', Controllers.main.createDiscount);  // 新增永豐資料
// router.post('/updateDiscount', Controllers.main.updateDiscount);  // 修改永豐資料
// router.post('/deleteDiscount', Controllers.main.deleteDiscount);  // 刪除永豐資料


// router.get('/supplierAcc', Controllers.main.supplierAcc);  // 供應商帳密
router.post('/updateSupplierAcc', Controllers.main.updateSupplierAcc);  // 更新供應商帳密
// router.get('/encryptionPWD', Controllers.main.encryptionPWD);  // 加密
// router.get('/decryptPWD', Controllers.main.decryptPWD);  // 解密



module.exports = router;