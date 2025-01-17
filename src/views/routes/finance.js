const router = require('express').Router()
const Controllers = require('../controllers')

router.get('/selectSINOPAC', Controllers.finance.selectSINOPAC);   // 取得永豐資料
router.post('/searchSINOPAC', Controllers.finance.searchSINOPAC);  // 查詢客戶的永豐資料
router.post('/createSINOPAC', Controllers.finance.createSINOPAC);  // 新增永豐資料
router.post('/deleteSINOPAC', Controllers.finance.deleteSINOPAC);  // 刪除永豐資料

// 手動入
router.get('/selectTBB', Controllers.finance.selectTBB);   // 取得台企銀資料
router.post('/searchTBB', Controllers.finance.searchTBB);  // 查詢客戶的台企銀資料
router.post('/createTBB', Controllers.finance.createTBB);  // 新增台企銀資料
router.post('/deleteTBB', Controllers.finance.deleteTBB);  // 刪除台企銀資料

router.post('/unverified', Controllers.finance.unverified);  // 取未核銷中油、銀行資料
// 自動入
router.post('/updateTBBAccount', Controllers.finance.updateTBBAccount);  // 修改台企銀帳號
router.get('/reconciliationCPC', Controllers.finance.reconciliationCPC);  // 核銷中油資料
router.get('/reconciliationTBB', Controllers.finance.reconciliationTBB);  // 核銷台企銀資料
router.post('/searchReconciledTBB', Controllers.finance.searchReconciledTBB);  // 查詢已核銷台企銀資料
router.post('/updateReconciledTBB', Controllers.finance.updateReconciledTBB);  // 修改已核銷台企銀資料

router.post('/selectCreditCard', Controllers.finance.selectCreditCard);  // 取得刷卡資料

router.get('/debitAccount', Controllers.finance.debitAccount);  // 傳票借方會計科目(借方)
router.get('/creditAccount', Controllers.finance.creditAccount);  // 傳票貸方會計科目(貸方)
router.post('/subpoena', Controllers.finance.subpoena);  // 產生傳票
router.post('/searchSubpoena', Controllers.finance.searchSubpoena);  // 查詢傳票資料
router.post('/selectSubpoena', Controllers.finance.selectSubpoena);  // 查詢個別傳票資料
router.post('/deleteSubpoena', Controllers.finance.deleteSubpoena);  // 刪除傳票
router.post('/deleteSubpoenaedetails', Controllers.finance.deleteSubpoenaedetails);  // 刪除傳票明細
router.post('/updatesubpoena', Controllers.finance.updatesubpoena);  // 修改傳票


router.post('/searchtotalamount', Controllers.finance.searchtotalamount);  //查詢特殊發票金額
router.post('/searchuseamount', Controllers.finance.searchuseamount);   //查詢已開立發票金額
router.post('/insertinvoice', Controllers.finance.insertinvoice);   // 產生特殊發票
router.post('/selectinvoice', Controllers.finance.selectinvoice);   // 查詢已開立發票明細
router.post('/changeinvoicetype', Controllers.finance.changeinvoicetype);   //更改一般/特殊發票開立
router.post('/getsystemwork', Controllers.finance.getsystemwork);   //取得月結作業
router.post('/changesystemwork', Controllers.finance.changesystemwork);   //新增月結作業
router.post('/systemworktime', Controllers.finance.systemworktime);   //更新完成結束作業

module.exports = router;