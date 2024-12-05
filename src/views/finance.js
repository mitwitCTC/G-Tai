module.exports = ({ sequelize }) => {
    const { bank_data, cpc_data, } = sequelize
    const Sequelize = require('sequelize');
    const Op = Sequelize.Op;
    const dayjs = require('dayjs');
    const env = process.env.NODE_ENV || 'development';
    const config = require('../config/config.json')[env];
    let sequelizeConfig;
    if (config.use_env_variable) {
        sequelizeConfig = new Sequelize(process.env[config.use_env_variable], config);
    } else {
        sequelizeConfig = new Sequelize(config.database, config.username, config.password, config);
    }

    const getDateTime = (input = null, timeFormat = 'YYYY-MM-DD HH:mm:ss', day = 0) => {
        let date = input ? input : new Date();
        let dateTime = dayjs(date).add(day, 'days').format(timeFormat)
        return dateTime
    }
    // 民國年
    const convertToROCDate = (date) => {
        let [year, month, day] = date.split("-");
        let rocYear = year - 1911;
        return `${rocYear}${month}${day}`;
    }

    return {
        // 取得永豐資料
        selectSINOPAC: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 取得永豐資料(selectSINOPAC)')
                // 取得所有業務員
                const bankList = await bank_data.findAll({
                    where: { trading_model: { [Op.eq]: 2 }, delete_time: { [Op.eq]: 0 } },   //永豐手動
                    attributes: ['id', 'customerId', 'account_date', 'issuing_bank', 'credit_amount', 'bank_amount', 'amount', 'invoice'],
                    raw: true
                })
                console.log({ returnCode: 0, message: "取得永豐資料", data: bankList })
                return res.json({ returnCode: 0, message: "取得永豐資料", data: bankList })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 查詢客戶的永豐資料
        searchSINOPAC: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 查詢客戶的永豐資料(searchSINOPAC)')
                if (req.body.invoice) {
                    const bankList = await bank_data.findAll({
                        where: {
                            invoice: { [Op.eq]: req.body.invoice },
                        }, raw: true
                    })
                    console.log({ returnCode: 0, message: "查詢客戶的永豐資料", data: bankList })
                    return res.json({ returnCode: 0, message: "查詢客戶的永豐資料", data: bankList })
                } else {
                    console.log({ returnCode: -1, message: '查詢失敗，缺少參數' })
                    return res.json({ returnCode: -1, message: '查詢失敗，缺少參數' })
                }
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 新增永豐資料
        createSINOPAC: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 新增永豐資料(createSINOPAC)')
                const bankList = await bank_data.create({
                    customerId: req.body.customerId,
                    trade_type: req.body.trade_type,
                    trading_model: req.body.trading_model,
                    bank: req.body.bank,
                    credit_card_data: req.body.credit_card_data,
                    bank_amount: req.body.bank_amount,
                    credit_amount: req.body.credit_amount,
                    issuing_bank: req.body.issuing_bank,
                    credit_percent: req.body.credit_percent,
                    handling_fee: req.body.handling_fee,
                    invoice: req.body.invoice,
                    account: req.body.account,
                    account_date: req.body.account_date,
                    account_time: req.body.account_time,
                    amount: req.body.amount,
                    remark: req.body.remark,
                })
                console.log({ returnCode: 0, message: "新增永豐資料", data: bankList.dataValues })
                return res.json({ returnCode: 0, message: "新增永豐資料", data: bankList })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 刪除永豐資料
        deleteSINOPAC: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 刪除永豐資料(deleteSINOPAC)')
                const bankList = await bank_data.update({
                    delete_time: req.body.delete_time == '' ? time : req.body.delete_time,
                }, {
                    where: {
                        id: { [Op.eq]: req.body.id }
                    }
                })
                console.log({ returnCode: 0, message: "刪除永豐資料 ", data: req.body })
                return res.json({ returnCode: 0, message: "刪除永豐資料 " + req.body.id })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },

        // 取得台企銀資料
        selectTBB: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 取得台企銀資料(selectTBB)')
                // 取得所有業務員
                const bankList = await bank_data.findAll({
                    where: { trading_model: { [Op.in]: [0, 3, 4, 5, 6] }, delete_time: { [Op.eq]: 0 } },   // 台企手動、支票、永豐匯款、現金、其他
                    // attributes: ['id', 'customerId', 'credit_card_data', 'issuing_bank', 'credit_amount', 'bank_amount', 'amount'],
                    raw: true
                })
                console.log({ returnCode: 0, message: "取得台企銀資料", data: bankList })
                return res.json({ returnCode: 0, message: "取得台企銀資料", data: bankList })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 查詢客戶的台企銀資料
        searchTBB: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 查詢客戶的台企銀資料(searchTBB)')
                if (req.body.invoice) {
                    const bankList = await bank_data.findAll({
                        where: {
                            invoice: { [Op.eq]: req.body.invoice },
                        }, raw: true
                    })
                    console.log({ returnCode: 0, message: "查詢客戶的台企銀資料", data: bankList })
                    return res.json({ returnCode: 0, message: "查詢客戶的台企銀資料", data: bankList })
                } else {
                    console.log({ returnCode: -1, message: '查詢失敗，缺少參數' })
                    return res.json({ returnCode: -1, message: '查詢失敗，缺少參數' })
                }
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 新增台企銀資料
        createTBB: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 新增台企銀資料(createTBB)')
                const bankList = await bank_data.create({
                    customerId: req.body.customerId,
                    trade_type: req.body.trade_type,
                    trading_model: req.body.trading_model,
                    bank: req.body.bank,
                    credit_card_data: req.body.credit_card_data,
                    bank_amount: req.body.bank_amount,
                    credit_amount: req.body.credit_amount,
                    issuing_bank: req.body.issuing_bank,
                    credit_percent: req.body.credit_percent,
                    handling_fee: req.body.handling_fee,
                    invoice: req.body.invoice,
                    account: req.body.account,
                    taxId: req.body.taxId,
                    account_date: req.body.account_date,
                    account_time: req.body.account_time,
                    amount: req.body.amount,
                    remark: req.body.remark,
                    data_source: req.body.data_source,
                })
                console.log({ returnCode: 0, message: "新增台企銀資料", data: bankList.dataValues })
                return res.json({ returnCode: 0, message: "新增台企銀資料", data: bankList })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 刪除台企銀資料
        deleteTBB: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 刪除台企銀資料(deleteTBB)')
                const bankList = await bank_data.update({
                    delete_time: req.body.delete_time == '' ? time : req.body.delete_time,
                }, {
                    where: {
                        id: { [Op.eq]: req.body.id }
                    }
                })
                console.log({ returnCode: 0, message: "刪除台企銀資料成功 ", data: req.body })
                return res.json({ returnCode: 0, message: "刪除台企銀資料成功 " + req.body.id })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },


        // 取未核銷中油、銀行資料
        unverified: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 取未核銷中油、銀行資料(unverified)')
                const cpc_date = (req.body.account_date).replace(/-/g, "/")
                const bank_date = convertToROCDate( getDateTime(req.body.account_date,'YYYY-MM-DD',-1))
                const cpc_dataCount = await cpc_data.findAll({
                    where: {
                        account_date: { [Op.eq]: cpc_date },
                    },
                    group: 'data_source',
                    attributes: ['data_source', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
                })
                const cpc_dataList = await cpc_data.findAll({
                    where: {
                        customerId: { [Op.is]: null },
                    }
                })
                const bank_dataCount = await bank_data.findAll({
                    where: {
                        account_date: { [Op.eq]: bank_date },
                        delete_time: { [Op.eq]: '0' }
                    },
                    group: 'bank',
                    attributes: ['bank', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
                })
                const bank_dataList = await bank_data.findAll({
                    where: {
                        customerId: { [Op.is]: null },
                        delete_time: { [Op.eq]: 0 },
                    }
                })
                console.log({ returnCode: 0, message: "取未核銷中油、銀行資料" })
                return res.json({ returnCode: 0, message: "取未核銷中油、銀行資料", data: { cpc_dataCount: cpc_dataCount, bank_dataCount: bank_dataCount, cpc_data: cpc_dataList, bank_data: bank_dataList } })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 修改台企銀帳號
        updateTBBAccount: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 修改台企銀帳號(updateTBBAccount)')
                const bankList = await bank_data.update({
                    account: req.body.account,
                    correct: req.body.correct
                }, {
                    where: {
                        id: { [Op.eq]: req.body.id }
                    }
                })
                console.log({ returnCode: 0, message: "修改台企銀帳號成功 ", data: req.body })
                return res.json({ returnCode: 0, message: "修改台企銀帳號成功，序號 " + req.body.id + " 新帳號 " + req.body.account })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 核銷中油資料
        reconciliationCPC: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 核銷中油資料(reconciliationCPC)')

                const [results, metadata] = await sequelizeConfig.query("update jutai.cpc_data `a` set customerId=(select customerId from jutai.vehicle `b` where a.license_plate = b.license_plate and b.deleteTime = '0' LIMIT 1) where customerId is null");

                console.log({ returnCode: 0, message: "核銷中油資料", data: results.info })
                return res.json({ returnCode: 0, message: "核銷中油資料", data: results.info })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 核銷台企銀資料
        reconciliationTBB: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 核銷台企銀資料(reconciliationTBB)')

                const [results, metadata] = await sequelizeConfig.query("update jutai.bank_data `a` set customerId=(select cus_code from jutai.customer `b` where a.account=b.virtual_account and b.deleteTime = '0' LIMIT 1) where customerId is null;");

                console.log({ returnCode: 0, message: "核銷台企銀資料", data: results.info })
                return res.json({ returnCode: 0, message: "核銷台企銀資料", data: results.info })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 查詢已核銷台企銀資料
        searchReconciledTBB: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 查詢已核銷台企銀資料(searchReconciledTBB)')
                if (req.body.customerId) {
                    const bankList = await bank_data.findAll({
                        where: {
                            customerId: { [Op.eq]: req.body.customerId },
                            checkoutTime: { [Op.eq]: '0' },
                        }, raw: true
                    })
                    console.log({ returnCode: 0, message: "查詢已核銷台企銀資料", data: bankList })
                    return res.json({ returnCode: 0, message: "查詢已核銷台企銀資料", data: bankList })
                } else {
                    console.log({ returnCode: -1, message: '查詢失敗，缺少參數' })
                    return res.json({ returnCode: -1, message: '查詢失敗，缺少參數' })
                }
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 修改已核銷台企銀資料
        updateReconciledTBB: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 修改已核銷台企銀資料(updateReconciledTBB)')
                const bankList = await bank_data.update({
                    customerId: null,
                    account: req.body.account,
                    correct: req.body.correct,
                }, {
                    where: {
                        id: { [Op.eq]: req.body.id }
                    }
                })
                console.log({ returnCode: 0, message: "修改已核銷台企銀資料", data: req.body })
                return res.json({ returnCode: 0, message: "修改已核銷台企銀資料", data: "序號 " + req.body.id + "已修改帳號為 " + req.body.account })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },

        // 取得刷卡資料
        selectCreditCard: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 取得刷卡資料(selectCreditCard)')
                // 取得所有業務員
                const bankList = await bank_data.findAll({
                    where: { customerId: { [Op.eq]: req.body.customerId }, bank: { [Op.eq]: '永豐' }, delete_time: { [Op.eq]: 0 } },
                    group: 'account',
                    attributes: ['customerId', 'account', 'issuing_bank'],
                    raw: true
                })
                console.log({ returnCode: 0, message: "取得刷卡資料", data: bankList })
                return res.json({ returnCode: 0, message: "取得刷卡資料", data: bankList })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
    }

}