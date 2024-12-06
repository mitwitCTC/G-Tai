const { group } = require('console');
const { raw } = require('mysql2');

module.exports = ({ sequelize }) => {
    const { vehicle, cpc_data, bank_data, account_sort, reportsales, reportsales_details, product_class, customer, definvoice, definvoice_details } = sequelize
    const Sequelize = require('sequelize')
    const Op = Sequelize.Op;
    const fs = require('fs')
    const path = require('path')
    // const fetch = require('node-fetch')
    const dayjs = require('dayjs')
    const exceljs = require('exceljs')
    // const msopdf = require('node-msoffice-pdf');
    const trading_modelPath = path.resolve('./trading_model.json')
    const excelPath = path.resolve('./發票證明聯A5_v2.xlsx') //母檔

    const getDateTime = (input = null, timeFormat = 'YYYY-MM-DD HH:mm:ss', month = 0, endOf = false) => {
        let date = input ? input : new Date();
        if (endOf == true) {
            let dateTime = dayjs(date).add(month, 'month').endOf('month').format(timeFormat)
            return dateTime
        } else {
            let dateTime = dayjs(date).add(month, 'month').format(timeFormat)
            return dateTime
        }
        // let dateTime = dayjs(date).format(timeFormat)
    }

    // 民國年
    const convertToROCDate = (date) => {
        let [year, month, day] = date.split("-");
        let rocYear = year - 1911;
        return `${rocYear}${month}`;
    }


    return {
        // 最後更新時間
        lastUpdateTime: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 最後更新時間(lastUpdateTime)')
                const reportsalesList = await reportsales.findAll({
                    where: { customerId: { [Op.eq]: req.body.customerId } },
                    order: [['salesDate', 'DESC']],
                    raw: true
                })
                console.log({ returnCode: 0, message: "最後更新時間" })
                if (reportsalesList.length > 0) {
                    return res.json({ returnCode: 0, message: "最後更新時間", data: reportsalesList[0].salesDate + ' 23:59:59' })
                } else {
                    return res.json({ returnCode: 0, message: "最後更新時間", data: "無最後更新時間" })
                }
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 擔保品資訊(對帳單總表裡會使用)
        collateralInfo: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 擔保品資訊(collateralInfo)')
                // 取擔保品資訊
                const customerList = await customer.findAll({
                    where: { cus_code: { [Op.eq]: req.body.cus_code } },
                    attributes: ['customerId', 'cus_code', 'config_notes', 'remittance_date'],

                    raw: true
                })
                // customerList.forEach(item => {
                //     item.config_notes
                // })
                console.log({ returnCode: 0, message: "擔保品資訊", data: customerList })
                return res.json({ returnCode: 0, message: "擔保品資訊", data: customerList })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 月餘額查詢(對帳單總表裡會使用)
        monthlyBalance: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 月餘額查詢(monthlyBalance)')
                const thisMonth = getDateTime(req.body.date, 'YYYY-MM')   //當月
                const previousMonth = getDateTime(req.body.date, 'YYYY-MM-DD', -1, true)    //前一個月
                console.log(thisMonth)
                console.log(previousMonth)
                // 取前月結餘
                const balance = await reportsales.findAll({
                    // where: { customerId: { [Op.eq]: req.body.customerId } },
                    where: { customerId: { [Op.eq]: req.body.customerId }, salesDate: { [Op.eq]: previousMonth } },
                    raw: true
                })
                // 取當月匯款金額、加油小計 
                const reportsalesList = await reportsales.findAll({
                    // where: { customerId: { [Op.eq]: req.body.customerId } },
                    where: { customerId: { [Op.eq]: req.body.customerId }, salesDate: { [Op.like]: thisMonth + '-%' } },
                    attributes: ['customerId', [Sequelize.fn('SUM', Sequelize.col('creditAmount')), 'creditAmount'], [Sequelize.fn('SUM', Sequelize.col('salesAmount')), 'salesAmount']],
                    raw: true
                })
                reportsalesList.forEach(item => {
                    if (balance.length > 0) {
                        item.overage = balance[0].overage   // 前年結餘
                        item.thisMonthOverage = (balance[0].overage) + parseInt(item.creditAmount) - parseInt(item.salesAmount)
                    } else {
                        item.overage = null  // 前年結餘
                        item.thisMonthOverage = (null) + parseInt(item.creditAmount) - parseInt(item.salesAmount)
                    }
                })
                console.log({ returnCode: 0, message: "月餘額查詢", data: reportsalesList })
                return res.json({ returnCode: 0, message: "月餘額查詢", data: reportsalesList })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 加油明細餘額查詢
        balanceInquiry: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 加油明細餘額查詢(balanceInquiry)')
                const account_date = (req.body.date).replace("-", "/")
                const end_date = getDateTime(req.body.date, 'YYYY/MM', 1)
                // 取中油交易明細
                const details = await cpc_data.findAll({
                    // where: { customerId: { [Op.eq]: req.body.customerId } },
                    where: { customerId: { [Op.eq]: req.body.customerId }, account_date: { [Op.between]: [account_date + "/02", end_date + "/01"] }, account_sortId: { [Op.ne]: null } },
                    attributes: ['trade_time', 'account_sortId', 'license_plate', 'fuel_type', 'station_name', 'fuel_volume', 'reference_price', 'discount', 'reference_amount', 'salesAmount', 'mileage', 'fuel_consumption'],
                    order: [['id', 'DESC']], raw: true
                })
                // 查詢客戶底下的帳單資料
                const account_sortList = await account_sort.findAll({
                    // where: { customerId: { [Op.eq]: req.body.customerId } },
                    raw: true
                })
                details.forEach(item => {
                    // 計算折抵金額
                    item.discount_amount = (item.reference_amount) - (item.salesAmount)
                    const account_sort = account_sortList.find(x => x.account_sortId == item.account_sortId)
                    item.acc_name = account_sort == null ? null : account_sort.acc_name
                    // console.log(account_sort)
                })
                console.log({ returnCode: 0, message: "加油明細餘額查詢" })
                return res.json({ returnCode: 0, message: "加油明細餘額查詢", data: details })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 匯款紀錄查詢
        remittanceRecord: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 匯款紀錄查詢(remittanceRecord)')
                console.log(convertToROCDate(req.body.date))
                const remittance = await bank_data.findAll({
                    where: { customerId: { [Op.eq]: req.body.customerId }, account_date: { [Op.like]: convertToROCDate(req.body.date) + '%' }, delete_time: { [Op.eq]: '0' } },
                    attributes: ['id', 'account_date', 'amount', 'bank', 'trading_model', 'checkoutTime'],
                    raw: true
                })
                console.log({ returnCode: 0, message: "匯款紀錄查詢", data: remittance })
                return res.json({ returnCode: 0, message: "匯款紀錄查詢", data: remittance })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 入帳模式
        tradingModel: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 入帳模式(tradingModel)')
                const station = JSON.parse(fs.readFileSync(trading_modelPath, 'utf-8'))
                console.log({ returnCode: 0, message: "入帳模式", data: station })
                return res.json({ returnCode: 0, message: "入帳模式", data: station })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 對帳單組別
        accountGroup: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 對帳單組別(tradingModel)')
                const account_sortList = await account_sort.findAll({
                    where: { customerId: { [Op.eq]: req.body.customerId } },
                    attributes: ['account_sortId', 'customerId', 'asType', 'use_number', 'invoice_name', 'acc_name', 'statement_print', 'deleteTime'],
                    raw: true
                })
                console.log({ returnCode: 0, message: "對帳單組別", data: account_sortList })
                return res.json({ returnCode: 0, message: "對帳單組別", data: account_sortList })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 對帳單總表
        accountStatement: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 對帳單總表(accountStatement)')
                const account_date = req.body.date
                const end_date = dayjs(req.body.date).endOf('month').format('YYYY-MM-DD')
                // const end_date = getDateTime(req.body.date, 'YYYY-MM', 1)
                const reportsales_detailsList = await reportsales_details.findAll({
                    where: { customerId: { [Op.eq]: req.body.customerId }, salesDate: { [Op.between]: [account_date + "-01", end_date] }, account_sortId: { [Op.eq]: req.body.account_sortId } },
                    attributes: ['id', 'customerId', 'account_sortId', 'license_plate', 'productId', [Sequelize.fn('SUM', Sequelize.col('fuel_volume')), 'fuel_volume'], [Sequelize.fn('SUM', Sequelize.col('reference_amount')), 'reference_amount'], [Sequelize.fn('SUM', Sequelize.col('amount')), 'amount'], [Sequelize.fn('MIN', Sequelize.col('minMileage')), 'minMileage'], [Sequelize.fn('MAX', Sequelize.col('maxMileage')), 'maxMileage']],
                    group: ['license_plate', 'productId'],
                    order: [['license_plate']],
                    raw: true
                })
                // 查詢產品名稱
                const product_classList = await product_class.findAll({ raw: true })
                reportsales_detailsList.forEach(item => {
                    const product_name = product_classList.find(x => item.productId == x.classId).className
                    item.product_name = product_name == null ? null : product_name
                    // 計算總里程 (最大里程數-最小里程數)
                    item.mileage = item.maxMileage - item.minMileage
                    // 計算油耗 (最大里程數-最小里程數)/油量
                    item.fuel_consumption = Math.round(((item.maxMileage - item.minMileage) / item.fuel_volume) * 100) / 100
                })
                // 油品總計
                const productList = await reportsales_details.findAll({
                    where: { customerId: { [Op.eq]: req.body.customerId }, salesDate: { [Op.between]: [account_date + "-01", end_date] }, account_sortId: { [Op.eq]: req.body.account_sortId } },
                    attributes: ['productId', [Sequelize.fn('SUM', Sequelize.col('fuel_volume')), 'fuel_volume'], [Sequelize.fn('SUM', Sequelize.col('reference_amount')), 'reference_amount'], [Sequelize.fn('SUM', Sequelize.col('amount')), 'amount']],
                    group: ['productId'],
                    raw: true
                })

                productList.forEach(item => {
                    const product_name = product_classList.find(x => item.productId == x.classId).className
                    item.product_name = product_name == null ? null : product_name
                })

                // 製卡費
                const cardIssuanceFee = await bank_data.findAll({
                    where: { trading_model: { [Op.eq]: '7' }, customerId: { [Op.eq]: req.body.customerId }, credit_amount: { [Op.between]: [account_date + "-01", end_date] }, issuing_bank: { [Op.eq]: req.body.account_sortId } },
                    attributes: ['credit_amount', 'bank_amount', 'credit_card_data', 'bank', 'amount'],
                    raw: true
                })

                console.log({ returnCode: 0, message: "對帳單總表" })
                return res.json({ returnCode: 0, message: "對帳單總表", data: { details: reportsales_detailsList, product: productList, cardIssuanceFee: cardIssuanceFee } })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 對帳單明細
        accountDetails: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 對帳單總表(accountDetails)')
                const salesDate = req.body.date
                const salesEnd_date = getDateTime(req.body.date, 'YYYY-MM', 1)
                const reportsales_detailsList = await reportsales_details.findAll({
                    where: { customerId: { [Op.eq]: req.body.customerId }, salesDate: { [Op.between]: [salesDate + "-02", salesEnd_date + "-01"] }, account_sortId: { [Op.eq]: req.body.account_sortId } },
                    attributes: ['id', 'customerId', 'account_sortId', 'license_plate', 'productId', [Sequelize.fn('SUM', Sequelize.col('fuel_volume')), 'fuel_volume'], [Sequelize.fn('SUM', Sequelize.col('reference_amount')), 'reference_amount'], [Sequelize.fn('SUM', Sequelize.col('amount')), 'amount'], [Sequelize.fn('SUM', Sequelize.col('minMileage')), 'minMileage'], [Sequelize.fn('SUM', Sequelize.col('maxMileage')), 'maxMileage']],
                    group: ['license_plate', 'productId'],
                    order: ['license_plate'],
                    raw: true
                })
                const license_plateList = reportsales_detailsList.map(x => x.license_plate)
                console.log(license_plateList)
                // 查詢產品名稱
                const account_date = (req.body.date).replace("-", "/")
                const accountEnd_date = getDateTime(req.body.date, 'YYYY/MM', 1)
                const product_classList = await cpc_data.findAll({
                    where: { customerId: { [Op.eq]: req.body.customerId }, account_date: { [Op.between]: [account_date + "/02", accountEnd_date + "/01"] }, license_plate: { [Op.in]: license_plateList } },
                    attributes: ['id', 'customerId', 'license_plate', 'trade_time', 'station_name', 'fuel_type', 'reference_price', 'fuel_volume', 'discount', 'reference_amount', 'salesAmount', 'mileage'],
                    order: ['license_plate', 'account_date'],
                    raw: true
                })
                // reportsales_detailsList.forEach(item => {
                //     const product_name = product_classList.find(x => item.productId == x.classId).className
                //     item.product_name = product_name == null ? null : product_name
                // })
                // consolse.log({ returnCode: 0, message: "對帳單明細", data: product_classList })
                return res.json({ returnCode: 0, message: "對帳單明細", data: product_classList })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // // 發票明細(證明聯)
        // invoiceDetails: async (req, res) => {
        //     try {
        //         const time = getDateTime()
        //         console.log(time + ' 發票明細(invoiceDetails)')
        //         const invoiceDate = getDateTime(req.body.date, 'YYYY-MM')
        //         const definvoiceList = await definvoice.findAll({
        //             where: { customerId: { [Op.eq]: req.body.customerId }, invoiceDate: { [Op.like]: invoiceDate + '%' }, account_sortId: { [Op.eq]: req.body.account_sortId }, isDelete: { [Op.eq]: '0' } },
        //             raw: true
        //         })
        //         if (definvoiceList.length == 0) {
        //             return res.json({ returnCode: 0, message: "無發票資料" })
        //         }
        //         const definvoice_detailsList = await definvoice_details.findAll({
        //             where: { invoiceId: { [Op.eq]: definvoiceList[0].invoiceId } },
        //             raw: true
        //         })
        //         definvoiceList.forEach(item => {
        //             item.detail = definvoice_detailsList
        //         })

        //         const workbook = new exceljs.Workbook();
        //         await workbook.xlsx.readFile(excelPath); // 讀取模板
        //         const worksheet = workbook.getWorksheet(1); // 假設使用第一個工作表

        //         // 填充數據到表格
        //         worksheet.getCell(`B2`).value = definvoiceList[0].invoiceDate; // 發票日期
        //         worksheet.getCell(`D3`).value = definvoiceList[0].word_track + definvoiceList[0].number; // 發票號碼
        //         worksheet.getCell(`D4`).value = definvoiceList[0].Bidentifier; // 統編
        //         worksheet.getCell(`D5`).value = definvoiceList[0].BName; // 買方
        //         definvoice_detailsList.forEach((item, index) => {
        //             const rowIndex = index + 8; // 從第 8 行開始填充
        //             worksheet.getCell(`B${rowIndex}`).value = item.Details; // 品名
        //             worksheet.getCell(`E${rowIndex}`).value = item.Quantity; // 數量
        //             worksheet.getCell(`I${rowIndex}`).value = item.Amount; // 金額
        //         });
        //         // 保存為新文件
        //         await workbook.xlsx.writeFile(path.resolve('./dec/' + definvoiceList[0].customerId + '發票證明聯A5_v2.xlsx'));
        //         console.log(`Excel 文件已生成:` + path.resolve('./dec/' + definvoiceList[0].customerId + '發票證明聯A5_v2.xlsx'));

        //         msopdf(path.resolve('./dec/' + definvoiceList[0].customerId + '發票證明聯A5_v2.xlsx'), path.resolve('./dec/' + definvoiceList[0].customerId + '發票證明聯A5_v2.pdf'))
        //             .then(() => {
        //                 console.log(`PDF 已生成：${pdfFilePath}`);
        //             })
        //             .catch((error) => {
        //                 console.error('轉換失敗:', error);
        //               });








        //         // const doc = new PDFDocument();

        //         // // const writeStream = fs.createWriteStream(path.resolve('./dec/' + definvoiceList[0].customerId + '發票證明聯A5_v2.pdf'));
        //         // // doc.pipe(writeStream);

        //         // // 將 Excel 的每行寫入 PDF
        //         // worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
        //         //     console.log(row);
        //         //     // doc.text(row.values.slice(1).join(' | ')); // 去掉 Excel 的行索引
        //         // });

        //         // doc.end();
        //         // writeStream.on('finish', () => {
        //         //     console.log('PDF 文件已生成：');
        //         // });



        //         // consolse.log({ returnCode: 0, message: "發票明細", data: definvoiceList })
        //         return res.json({ returnCode: 0, message: "發票明細", data: definvoiceList })
        //     } catch (err) {
        //         console.log({ returnCode: 500, message: "系統錯誤", err: err })
        //         return res.json({ returnCode: 500, message: "系統錯誤", err: err })
        //     }
        // },


        // 登入
        logIn: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 登入(logIn)')
                const customerList = await customer.findAll({
                    where: { vat_number: { [Op.eq]: req.body.vat_number }, front_pwd: { [Op.eq]: req.body.front_pwd } },
                    attributes: ['customerId', 'cus_code', 'transaction_mode', 'contract_status'],
                    raw: true
                })
                if (customerList.length > 0) {
                    return res.json({ returnCode: 0, message: "登入", data: customerList })
                } else {
                    return res.json({ returnCode: -1, message: "登入失敗，帳號密碼錯誤" })
                }
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 修改前台密碼
        updatePassword: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 修改前台密碼(updatePassword)')
                const customerList = await customer.findAll({
                    where: { cus_code: { [Op.eq]: req.body.cus_code }, front_pwd: { [Op.eq]: req.body.front_pwd } },
                    raw: true
                })
                if (customerList.length > 0) {
                    const update = await customer.update({
                        front_pwd: req.body.newfront_pwd,
                    }, {
                        where: {
                            customerId: { [Op.eq]: customerList[0].customerId } //序號
                        }
                    })
                    return res.json({ returnCode: 0, message: "修改密碼成功" })
                } else {
                    return res.json({ returnCode: -1, message: "修改密碼失敗，原密碼錯誤" })
                }
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
    }
}