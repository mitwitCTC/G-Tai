module.exports = ({ sequelize }) => {
    const { bank_data, cpc_data, accountingsubjects, acc_trade, acc_trade_details,reportsales,definvoice,definvoice_details } = sequelize
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
    //特殊發票流水號
    const getDateTimeSSS = (date = null, format = 'YYMMDDHHmmssSSS') => {
        const now = date ? new Date(date) : new Date();
        const pad = (num, size = 2) => num.toString().padStart(size, '0'); // 用於補零
      
        const YY = now.getFullYear().toString().slice(-2); // 取年份的後兩位
        const MM = pad(now.getMonth() + 1); // 月份 (0-indexed)
        const DD = pad(now.getDate()); // 日期
        const HH = pad(now.getHours()); // 小時
        const mm = pad(now.getMinutes()); // 分鐘
        const ss = pad(now.getSeconds()); // 秒
        const SSS = pad(now.getMilliseconds(), 3); // 毫秒
      
        // 替換格式
        return format
          .replace('YY', YY)
          .replace('MM', MM)
          .replace('DD', DD)
          .replace('HH', HH)
          .replace('mm', mm)
          .replace('ss', ss)
          .replace('SSS', SSS);
      };
      const getLastDayOfMonth = (searchMonth) => {
        // 假設 req.body.search_month 為 "YYYY-MM" 格式
        const startOfNextMonth = dayjs(searchMonth, 'YYYY-MM') // 解析搜尋的年月
          .add(1, 'month') // 增加1個月
          .startOf('month'); // 計算下個月的第一天
      
        const lastDayOfMonth = startOfNextMonth.subtract(1, 'day'); // 減去一天得到當月最後一天
      
        return lastDayOfMonth.format('YYYY-MM-DD'); // 返回格式化的日期
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
                const bank_date = convertToROCDate(getDateTime(req.body.account_date, 'YYYY-MM-DD', -1))
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

        //傳票借方會計科目(借方)
        debitAccount: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 傳票借方會計科目(debitAccount)')
                // 取得所有業務員
                const Account = await accountingsubjects.findAll({
                    // where: { useType: { [Op.eq]: 'DR' } },
                    raw: true
                })
                console.log({ returnCode: 0, message: "傳票借方會計科目", data: Account })
                return res.json({ returnCode: 0, message: "傳票借方會計科目", data: Account })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        //傳票貸方會計科目(貸方)
        creditAccount: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 傳票貸方會計科目(creditAccount)')
                // 取得所有業務員
                const Account = await accountingsubjects.findAll({
                    // where: { useType: { [Op.eq]: 'CR' } },
                    raw: true
                })
                console.log({ returnCode: 0, message: "傳票貸方會計科目", data: Account })
                return res.json({ returnCode: 0, message: "傳票貸方會計科目", data: Account })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 產生傳票
        subpoena: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 產生傳票(subpoena)')
                const accTradeID = "IN" + getDateTime(null, 'YYMMDDHHmmss')
                // let detail = []
                // req.body.forEach((item) => {
                //     console.log(item.debit)
                //     item.debit.forEach((item) => {
                //         // 借方
                //         let debitStr = {
                //             "Subjects": item.Subjects,
                //             "amount": item.amount,
                //             "type": item.type,
                //         }
                //         detail.push(debitStr)
                //     })
                //     item.credit.forEach((item) => {
                //         // 貸方
                //         let creditStr = {
                //             "Subjects": item.Subjects,
                //             "amount": item.amount,
                //             "type": item.type,
                //         }
                //         detail.push(creditStr)
                //     })
                // })
                // console.log(req.body)
                // 新增傳票紀錄
                const createAcc_trade = await acc_trade.create({
                    id: accTradeID,
                    parkId: 1,
                    trade_name: req.body.trade_name,
                    amount: req.body.totalAmount,
                    accDate: req.body.accDate,
                    accFarewell: getDateTime(req.body.actDate, 'YYYY-MM'),
                    creatTime: time,
                    debitmessage: req.body.debitmessage,
                    creditmessage: req.body.creditmessage,
                    customerId: req.body.customerId,
                    cus_name: req.body.cus_name,

                })
                // console.log({ returnCode: 0, message: "成功新增傳票紀錄" })
                req.body.detail.forEach(async (item) => {
                    // console.log(item)
                    // 新增傳票明細
                    const createAcc_tradeDetails = await acc_trade_details.create({
                        accTradeID: accTradeID,
                        Subjects: item.Subjects,
                        amount: item.amount,
                        type: item.type,
                        debitmessage:item.debitmessage,
                        creditmessage:item.creditmessage
                    })
                })
                // console.log({ returnCode: 0, message: "成功新增傳票明細" })
                console.log({ returnCode: 0, message: "產生傳票成功", data: accTradeID })
                return res.json({ returnCode: 0, message: "產生傳票成功", data: accTradeID })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 查詢傳票資料
        searchSubpoena: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 查詢傳票資料(searchSubpoena)')
                const accTrade = await acc_trade.findAll({
                    where: {
                        accDate: { [Op.between]: [req.body.date, req.body.enddate] },
                        deleteTime: { [Op.eq]: 0 }
                    }, raw: true,
                    order: [['accDate', 'DESC']],
                })
                if (accTrade.length == 0) {
                    console.log({ returnCode: 0, message: "無資料" })
                    return res.json({ returnCode: 0, message: "無資料" })
                }
                const accTradeID = accTrade.map(x => x.id)
                const accTradeDetails = await acc_trade_details.findAll({
                    where: {
                        accTradeID: { [Op.in]: accTradeID },
                    }, raw: true
                })
                accTrade.forEach(async (item) => {
                    const trade = accTradeDetails.filter(o => o.accTradeID == item.id)
                    item.detail = trade
                })
                console.log({ returnCode: 0, message: "查詢傳票資料", data: accTrade })
                return res.json({ returnCode: 0, message: "查詢傳票資料", data: accTrade })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
         // 查詢個別傳票資料
         selectSubpoena: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 查詢個別傳票資料(selectSubpoena)')
                const accTrade = await acc_trade.findAll({
                    where: {
                        id: { [Op.eq]: req.body.id },
                        deleteTime: { [Op.eq]: 0 }
                    }, raw: true
                })
                if (accTrade.length == 0) {
                    console.log({ returnCode: 0, message: "無資料" })
                    return res.json({ returnCode: 0, message: "無資料" })
                }
                const accTradeID = accTrade.map(x => x.id)
                const accTradeDetails = await acc_trade_details.findAll({
                    where: {
                        accTradeID: { [Op.in]: accTradeID },
                    }, raw: true
                })
                accTrade.forEach(async (item) => {
                    const trade = accTradeDetails.filter(o => o.accTradeID == item.id)
                    item.detail = trade
                })
                console.log({ returnCode: 0, message: "查詢個別傳票資料", data: accTrade })
                return res.json({ returnCode: 0, message: "查詢個別傳票資料", data: accTrade })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 刪除傳票
        deleteSubpoena: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 刪除傳票(deleteSubpoena)')
                // 刪除傳票紀錄
                const deleteAcc_trade = await acc_trade.update({
                    message: req.body.message == '' ? null : req.body.message,
                    deleteTime: time
                }, {
                    where: {
                        id: { [Op.eq]: req.body.id }
                    }
                })
                console.log({ returnCode: 0, message: "刪除傳票成功", data: req.body.id })
                return res.json({ returnCode: 0, message: "刪除傳票成功", data: req.body.id })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },

        // 修改傳票
        updatesubpoena: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 修改傳票(updatesubpoena)')
                const createAcc_trade = await acc_trade.update({
                    amount: req.body.totalAmount,
                    accDate: req.body.accDate,
                    accFarewell: getDateTime(req.body.actDate, 'YYYY-MM'),
                    debitmessage: req.body.debitmessage,
                    customerId: req.body.customerId,
                    cus_name: req.body.cus_name,

                },
                {
                    where: { id: req.body.id }, // 根据传票ID更新
                })
                // console.log({ returnCode: 0, message: "成功新增傳票紀錄" })
                for (const item of req.body.detail) {
                    if (item.id) {
                        // 如果有 ID，执行更新操作
                        await acc_trade_details.update(
                            {
                                Subjects: item.Subjects,
                                amount: item.amount,
                                type: item.type,
                                debitmessage: item.debitmessage,
                                creditmessage: item.creditmessage,
                            },
                            {
                                where: { id: item.id }, // 根据传票明细ID更新
                            }
                        );
                    } else {
                        // 如果没有 ID，执行新增操作
                        await acc_trade_details.create({
                            accTradeID: req.body.id, // 主传票的 ID
                            Subjects: item.Subjects,
                            amount: item.amount,
                            type: item.type,
                            debitmessage: item.debitmessage,
                            creditmessage: item.creditmessage,
                        });
                    }
                }
                // console.log({ returnCode: 0, message: "成功新增傳票明細" })
                console.log({ returnCode: 0, message: "修改傳票成功", data: req.body.id })
                return res.json({ returnCode: 0, message: "修改傳票成功", data: req.body.id })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        //查詢特殊發票金額
        searchtotalamount: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 查詢特殊發票金額(searchtotalamount)')
                if (req.body.salesDate && req.body.customerId ) {
                    const startDate = `${req.body.salesDate}-01`;
                    const endDate = `${req.body.salesDate}-31`;
                    
                    const customerList = await reportsales.findAll({
                      where: {
                        salesDate: {
                          [Op.between]: [startDate, endDate], // 範圍查詢
                        },
                        customerId: {
                          [Op.eq]: req.body.customerId,
                        },
                      },
                      raw: true,
                    });
                    // 計算 salesAmount 加總
                    const totalSalesAmount = customerList.reduce((total, record) => {
                        return total + (record.salesAmount || 0); // 確保 salesAmount 不為 null
                    }, 0);
                    // 組合回應結果
                    const result = {
                        customerId: req.body.customerId,
                        totalSalesAmount,
                    };
                    console.log({ returnCode: 0, message: "查詢特殊發票金額", data: result })
                    return res.json({ returnCode: 0, message: "查詢特殊發票金額", data: result })

                } else {
                    console.log({ returnCode: -1, message: '查詢失敗，缺少參數' })
                    return res.json({ returnCode: -1, message: '查詢失敗，缺少參數' })
                }
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
         //查詢已開立發票金額
         searchuseamount: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 查詢已開立發票金額(searchuseamount)')
                if (req.body.salesDate && req.body.customerId ) {
                    const startDate = `${req.body.salesDate}-01`;
                    const endDate = `${req.body.salesDate}-31`;
                    
                    const customerList = await definvoice.findAll({
                      where: {
                        invoiceDate: {
                          [Op.between]: [startDate, endDate], // 範圍查詢
                        },
                        customerId: {
                          [Op.eq]: req.body.customerId,
                        },
                      },
                      raw: true,
                    });
                    // 計算 salesAmount 加總
                    const totalAmount = customerList.reduce((total, record) => {
                        return total + (record.Amount || 0); // 確保 salesAmount 不為 null
                    }, 0);
                    // 組合回應結果
                    const result = {
                        customerId: req.body.customerId,
                        totalAmount,
                    };
                    console.log({ returnCode: 0, message: "查詢已開立發票金額", data: result })
                    return res.json({ returnCode: 0, message: "查詢已開立發票金額", data: result })

                } else {
                    console.log({ returnCode: -1, message: '查詢失敗，缺少參數' })
                    return res.json({ returnCode: -1, message: '查詢失敗，缺少參數' })
                }
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 產生特殊發票
        insertinvoice: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 產生特殊發票(insertinvoice)')
                for (const invoice of req.body.invoice) {
                    const invoiceId =  getDateTimeSSS(null, 'YYMMDDHHmmssSSS')
                    const createinvoice = await definvoice.create({
                        invoiceId: invoiceId,
                        customerId: req.body.cus_code, 
                        account_sortId: invoice.account_sortId, 
                        Amount: invoice.Amount, 
                        invoiceDate:getLastDayOfMonth(req.body.search_month),
                        invoiceTime:'00:00:00',
                        Bidentifier: invoice.use_number,  
                        BName: invoice.invoice_name,  
                    });
                    for (const products of invoice.products) {
                        const createinvoiceproducts = await definvoice_details.create({
                            InvoiceId: invoiceId,
                            Details: products.product, 
                            Unit_Price:products.amount, 
                            Amount:products.amount,
                        });
                    }
                }
                console.log({ returnCode: 0, message: "產生特殊發票成功" })
                return res.json({ returnCode: 0, message: "產生特殊發票成功" })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
    }

}