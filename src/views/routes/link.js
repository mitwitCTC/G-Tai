const router = require('express').Router()
const Controllers = require('../controllers')

router.post('/linkLine', Controllers.link.linkLine);   // 綁定
router.post('/balance', Controllers.link.balance);   // 取餘額


module.exports = router;
