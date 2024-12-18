const { group } = require('console')
const { raw } = require('mysql2')

module.exports = ({ sequelize }) => {
    const { account_sort, card_relation, contact, customer, sales_relation, salesman, vehicle, supplier, discount, reportsales_record, cpc_data, product_class, defnotify } = sequelize
    const Sequelize = require('sequelize');
    const Op = Sequelize.Op;
    const fs = require('fs')
    const path = require('path')
    // const fetch = require('node-fetch')
    const dayjs = require('dayjs');
    const rootPath = path.join(__dirname, '../')
    const { EnObject, DeObject } = require(rootPath + '/tools/crypto')
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

    return {
        // 取得所有客戶資料
        selectCustomer: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 取得客戶資料(selectCustomer)')
                // 取得所有客戶
                const customerList = await customer.findAll({
                    where: { deleteTime: { [Op.eq]: '0' } },
                    order: [['cus_code', 'DESC']],
                    attributes: ['customerId', 'cus_code', 'cus_name', 'salesmanId', 'virtual_account', 'region', 'industry', 'est_fuel_volume', 'phone', 'fax', 'vat_number', 'company_title', 'deleteTime', 'month_gas', 'month_balance', 'front_pwd', 'submission_date','mail_address'],
                    raw: true
                })
                //Jason
                const MaxCus_code = await customer.findOne({
                    order: [['cus_code', 'DESC']],
                    attributes: ['cus_code'],
                    raw: true
                })
                console.log({ returnCode: 0, message: "取得客戶資料", data: customerList , maxcus_code:MaxCus_code})
                return res.json({ returnCode: 0, message: "取得客戶資料", data: customerList, maxcus_code:MaxCus_code })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 查詢客戶資料
        searchCustomer: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 查詢客戶資料(searchCustomer)')
                // 查詢符合條件客戶
                if (req.body.cus_code) {
                    const customerList = await customer.findAll({
                        where: {
                            cus_code: { [Op.eq]: req.body.cus_code }
                        }, raw: true
                    })
                    console.log({ returnCode: 0, message: "查詢客戶資料", data: customerList })
                    return res.json({ returnCode: 0, message: "查詢客戶資料", data: customerList })

                } else {
                    console.log({ returnCode: -1, message: '查詢失敗，缺少參數' })
                    return res.json({ returnCode: -1, message: '查詢失敗，缺少參數' })
                }
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 新增客戶資料
        createCustomer: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 新增客戶資料(createCustomer)')
                let virtual_account = (req.body.vat_number).length == 8 ? '447110' + req.body.vat_number : '44711' + req.body.vat_number.replace(/\D/g, '');
                const customerList = await customer.create({
                    cus_code: (req.body.cus_code).trim(),
                    cus_name: req.body.cus_name,
                    salesmanId: req.body.salesmanId,
                    virtual_account: virtual_account,
                    region: req.body.region,
                    industry: req.body.industry,
                    est_fuel_volume: req.body.est_fuel_volume,
                    phone: req.body.phone,
                    fax: req.body.fax,
                    vat_number: req.body.vat_number,
                    company_title: req.body.company_title,
                    front_pwd: req.body.front_pwd,
                    contract_start: req.body.contract_start,
                    contract_end: req.body.contract_end,
                    low_balance_notice: req.body.low_balance_notice,
                    fuel_grace_limit: req.body.fuel_grace_limit,
                    reg_address: req.body.reg_address,
                    mail_address: req.body.mail_address,
                    transaction_mode: req.body.transaction_mode,
                    invoice_notes: req.body.invoice_notes,
                    contract_status: req.body.contract_status,
                    contract_sales: req.body.contract_sales,
                    card_fee: req.body.card_fee,
                    reissue_fee: req.body.reissue_fee,
                    sales_notes: req.body.sales_notes,
                    deposit: req.body.deposit,
                    contract_notes: req.body.contract_notes,
                    created: req.body.created,  // 建立者
                    submission_date: req.body.submission_date,
                    remittance_date: req.body.remittance_date,
                    fuel_sms_phone: req.body.fuel_sms_phone,
                    fuel_sms_option: req.body.fuel_sms_option,
                    balance_sms_phone: req.body.balance_sms_phone,
                    config_method: (req.body.config_method).join(','),
                    config_notes: req.body.config_notes,
                    card_fee_notes: req.body.card_fee_notes,
                    createTime: req.body.createTime == '' ? time : req.body.createTime,
                    con_notes: req.body.con_notes,
                    card_other_fee: req.body.card_other_fee == '' ? null : req.body.card_other_fee,
                    card_handling: req.body.card_handling == '' ? null : req.body.card_handling
                })
                console.log({ returnCode: 0, message: "新增客戶資料", data: customerList.dataValues })
                return res.json({ returnCode: 0, message: "新增客戶資料", data: customerList })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 修改客戶資料
        updateCustomer: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 修改客戶資料(updateCustomer)')
                // 修改客戶
                const customerList = await customer.update({
                    cus_code: req.body.cus_code,
                    cus_name: req.body.cus_name,
                    salesmanId: req.body.salesmanId,
                    region: req.body.region,
                    industry: req.body.industry,
                    est_fuel_volume: req.body.est_fuel_volume,
                    phone: req.body.phone,
                    fax: req.body.fax,
                    vat_number: req.body.vat_number,
                    company_title: req.body.company_title,
                    front_pwd: req.body.front_pwd,
                    contract_start: req.body.contract_start,
                    contract_end: req.body.contract_end,
                    low_balance_notice: req.body.low_balance_notice,
                    fuel_grace_limit: req.body.fuel_grace_limit,
                    reg_address: req.body.reg_address,
                    mail_address: req.body.mail_address,
                    transaction_mode: req.body.transaction_mode,
                    invoice_notes: req.body.invoice_notes,
                    contract_status: req.body.contract_status,
                    contract_sales: req.body.contract_sales,
                    card_fee: req.body.card_fee,
                    reissue_fee: req.body.reissue_fee,
                    sales_notes: req.body.sales_notes,
                    deposit: req.body.deposit,
                    contract_notes: req.body.contract_notes,
                    updated: req.body.updated,  // 更新者
                    submission_date: req.body.submission_date,
                    remittance_date: req.body.remittance_date,
                    fuel_sms_phone: req.body.fuel_sms_phone,
                    fuel_sms_option: req.body.fuel_sms_option,
                    balance_sms_phone: req.body.balance_sms_phone,
                    config_method: (req.body.config_method).join(','),
                    config_notes: req.body.config_notes,
                    card_fee_notes: req.body.card_fee_notes,
                    updateTime: req.body.updateTime == '' ? time : req.body.updateTime,
                    con_notes: req.body.con_notes,
                    card_other_fee: req.body.card_other_fee == '' ? null : req.body.card_other_fee,
                    card_handling: req.body.card_handling == '' ? null : req.body.card_handling,
                    //Jason
                    virtual_account:req.body.virtual_account//虛擬帳戶
                }, {
                    where: {
                        customerId: { [Op.eq]: req.body.customerId }
                    }
                })
                console.log({ returnCode: 0, message: "修改客戶資料 ", data: req.body })
                return res.json({ returnCode: 0, message: "修改客戶資料 " + req.body.customerId })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 刪除客戶資料
        deleteCustomer: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 刪除客戶資料(deleteCustomer)')
                // 刪除客戶
                const customerList = await customer.update({
                    updated: req.body.updated,
                    deleteTime: req.body.deleteTime == '' ? time : req.body.deleteTime,
                }, {
                    where: {
                        customerId: { [Op.eq]: req.body.customerId }
                    }
                })
                console.log({ returnCode: 0, message: "刪除客戶資料 ", data: req.body })
                return res.json({ returnCode: 0, message: "刪除客戶資料: " + req.body.customerId })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },

        // 取得聯絡人資料
        selectContact: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 取得聯絡人資料(selectContact)')
                // 取得所有聯絡人
                const contactList = await contact.findAll({ where: {
                    deleteTime: { [Op.eq]: '0' }
                }, raw: true })
                console.log({ returnCode: 0, message: "取得聯絡人資料", data: contactList })
                return res.json({ returnCode: 0, message: "取得聯絡人資料", data: contactList })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 查詢客戶聯絡人資料
        searchContact: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 查詢客戶聯絡人資料(searchContact)')
                const contactList = await contact.findAll({
                    where: {
                        customerId: { [Op.eq]: req.body.customerId },
                        deleteTime: { [Op.eq]: '0' }
                    }, raw: true
                })
                console.log({ returnCode: 0, message: "查詢客戶聯絡人資料", data: contactList })
                return res.json({ returnCode: 0, message: "查詢客戶聯絡人資料", data: contactList })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 新增聯絡人資料
        createContact: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 新增聯絡人資料(createContact)')
                const contactList = await contact.create({
                    customerId: req.body.customerId,
                    job_title: req.body.job_title,
                    gender: req.body.gender,
                    name: req.body.name,
                    mobile: req.body.mobile,
                    mail: req.body.mail,
                    notes: req.body.notes,
                    //Jason
                    messageNotify: req.body.messageNotify,
                    billNotify: req.body.billNotify,
                    messageMail: req.body.messageMail,
                    billMail: req.body.billMail,
                    createTime: req.body.createTime == '' ? time : req.body.createTime,
                })
                console.log({ returnCode: 0, message: "新增聯絡人資料", data: contactList.dataValues })
                return res.json({ returnCode: 0, message: "新增聯絡人資料", data: contactList })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 修改聯絡人資料
        updateContact: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 修改聯絡人資料(updateContact)')
                // 修改聯絡人
                const contactList = await contact.update({
                    customerId: req.body.customerId,
                    job_title: req.body.job_title == '' ? null : req.body.job_title,
                    gender: req.body.gender == '' ? null : req.body.gender,
                    name: req.body.Name == '' ? null : req.body.name,
                    mobile: req.body.mobile == '' ? null : req.body.mobile,
                    mail: req.body.mail == '' ? null : req.body.mail,
                    //JASON
                    notes: req.body.notes == '' ? null : req.body.notes,
                    billNotify: req.body.billNotify == '' ? null : req.body.billNotify,
                    billMail: req.body.billMail == '' ? null : req.body.billMail,
                    messageNotify: req.body.messageNotify == '' ? null : req.body.messageNotify,
                    messageMail: req.body.messageMail == '' ? null : req.body.messageMail,
                }, {
                    where: {
                        contactId: { [Op.eq]: req.body.contactId }
                    }
                })
                console.log({ returnCode: 0, message: "修改聯絡人資料 ", data: req.body })
                return res.json({ returnCode: 0, message: "修改聯絡人資料 " + req.body.contactId })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },

        // 取得帳單資料
        selectAccount_sort: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 取得帳單資料(selectAccount_sort)')
                // 取得所有客戶
                const account_sortList = await account_sort.findAll({
                    where: { deleteTime: { [Op.eq]: '0' } },
                    raw: true
                })
                console.log({ returnCode: 0, message: "取得帳單資料", data: account_sortList })
                return res.json({ returnCode: 0, message: "取得帳單資料", data: account_sortList })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 查詢客戶帳單資料
        searchAccount_sort: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 查詢客戶帳單資料(searchAccount_sort)')
                // 查詢此客戶的帳單
                if (req.body.customerId) {
                    const account_sortList = await account_sort.findAll({
                        where: {
                            customerId: { [Op.eq]: req.body.customerId },
                            deleteTime: { [Op.eq]: '0' }
                        }, raw: true
                    })
                    console.log({ returnCode: 0, message: "查詢客戶帳單資料", data: account_sortList })
                    return res.json({ returnCode: 0, message: "查詢客戶帳單資料", data: account_sortList })
                } else {
                    console.log({ returnCode: -1, message: '查詢失敗，缺少參數' })
                    return res.json({ returnCode: -1, message: '查詢失敗，缺少參數' })
                }
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 瀏覽指定帳單資料
        viewAccount_sort: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 瀏覽指定帳單資料(viewAccount_sort)')
                // 查詢此客戶的帳單
                if (req.body.account_sortId) {
                    const account_sortList = await account_sort.findAll({
                        where: {
                            account_sortId: { [Op.eq]: req.body.account_sortId },
                            deleteTime: { [Op.eq]: '0' }
                        }, raw: true
                    })
                    console.log({ returnCode: 0, message: "瀏覽指定帳單資料", data: account_sortList })
                    return res.json({ returnCode: 0, message: "瀏覽指定帳單資料", data: account_sortList })
                } else {
                    console.log({ returnCode: -1, message: '查詢失敗，缺少參數' })
                    return res.json({ returnCode: -1, message: '查詢失敗，缺少參數' })
                }
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 新增帳單資料
        createAccount_sort: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 新增帳單資料(createAccount_sort)')
                const account_sortList = await account_sort.create({
                    customerId: req.body.customerId,
                    use_number: req.body.use_number,
                    invoice_name: req.body.invoice_name,
                    billing_method: req.body.billing_method,
                    address_email: req.body.address_email,
                    statement_print: req.body.statement_print,
                    recipient_name: req.body.recipient_name,
                    statement_notes: req.body.statement_notes,
                    statement_remarks: req.body.statement_remarks,
                    createTime: req.body.createTime == '' ? time : req.body.createTime,
                    acc_name: req.body.acc_name,
                    acc_contact: req.body.acc_contact
                })
                console.log({ returnCode: 0, message: "新增帳單資料", data: account_sortList.dataValues })
                return res.json({ returnCode: 0, message: "新增帳單資料", data: account_sortList })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 修改帳單資料
        updateAccount_sort: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 修改帳單資料(updateAccount_sort)')
                // 修改帳單
                const account_sortList = await account_sort.update({
                    customerId: req.body.customerId,
                    use_number: req.body.use_number,
                    invoice_name: req.body.invoice_name,
                    billing_method: req.body.billing_method,
                    address_email: req.body.address_email,
                    statement_print: req.body.statement_print,
                    recipient_name: req.body.recipient_name,
                    statement_notes: req.body.statement_notes,
                    statement_remarks: req.body.statement_remarks,
                    updateTime: req.body.updateTime == '' ? time : req.body.updateTime,
                    acc_name: req.body.acc_name,
                    acc_contact: req.body.acc_contact
                }, {
                    where: {
                        account_sortId: { [Op.eq]: req.body.account_sortId }
                    }
                })
                console.log({ returnCode: 0, message: "修改帳單資料 ", data: req.body })
                return res.json({ returnCode: 0, message: "修改帳單資料 " + req.body.account_sortId })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 刪除帳單資料
        deleteAccount_sort: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 刪除帳單資料(deleteAccount_sort)')
                // 刪除帳單
                const account_sortList = await account_sort.update({
                    deleteTime: req.body.deleteTime == '' ? time : req.body.deleteTime,
                }, {
                    where: {
                        account_sortId: { [Op.eq]: req.body.account_sortId }
                    }
                })
                console.log({ returnCode: 0, message: "刪除帳單資料 ", data: req.body })
                return res.json({ returnCode: 0, message: "刪除帳單資料: " + req.body.account_sortId })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },

        // 取得車籍資料
        selectVehicle: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 取得車籍資料(selectVehicle)')
                // 取得所有車籍
                const vehicleList = await vehicle.findAll({
                    where: { deleteTime: { [Op.eq]: '0' } },
                    raw: true
                })
                console.log({ returnCode: 0, message: "取得車籍資料", data: vehicleList })
                return res.json({ returnCode: 0, message: "取得車籍資料", data: vehicleList })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 查詢客戶車籍資料
        searchVehicle: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 查詢客戶車籍資料(searchVehicle)')
                // 取得所有車籍
                const vehicleList = await vehicle.findAll({
                    where: {
                        customerId: { [Op.eq]: req.body.customerId },
                        deleteTime: { [Op.eq]: '0' }
                    },
                    raw: true
                })
                console.log({ returnCode: 0, message: "查詢客戶車籍資料", data: vehicleList })
                return res.json({ returnCode: 0, message: "查詢客戶車籍資料", data: vehicleList })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 新增車籍資料
        createVehicle: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 新增帳單資料(createVehicle)')
                const vehicleList = await vehicle.create({
                    account_sortId: req.body.account_sortId,
                    customerId: req.body.customerId,
                    license_plate: req.body.license_plate,
                    vehicle_type: req.body.vehicle_type,
                    product_name: req.body.product_name,
                    createTime: req.body.createTime == '' ? time : req.body.createTime,
                })
                console.log({ returnCode: 0, message: "新增帳單資料", data: vehicleList.dataValues })
                return res.json({ returnCode: 0, message: "新增帳單資料", data: vehicleList })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 修改車籍資料
        updateVehicle: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 修改車籍資料(updateVehicle)')
                // 修改帳單
                const vehicleList = await vehicle.update({
                    account_sortId: req.body.account_sortId,
                    customerId: req.body.customerId,
                    license_plate: req.body.license_plate,
                    vehicle_type: req.body.vehicle_type,
                    product_name: req.body.product_name,
                    updateTime: req.body.updateTime == '' ? time : req.body.updateTime,
                }, {
                    where: {
                        vehicleId: { [Op.eq]: req.body.vehicleId }
                    }
                })
                console.log({ returnCode: 0, message: "修改車籍資料 ", data: req.body })
                return res.json({ returnCode: 0, message: "修改車籍資料 " + req.body.vehicleId })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 刪除車籍資料
        deleteVehicle: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 刪除車籍資料(deleteVehicle)')
                // 刪除帳單
                const vehicleList = await vehicle.update({
                    deleteTime: req.body.deleteTime == '' ? time : req.body.deleteTime,
                }, {
                    where: {
                        vehicleId: { [Op.eq]: req.body.vehicleId }
                    }
                })
                const card_relationList = await card_relation.update({
                    buildType: "3",
                    deleteTime: req.body.deleteTime == '' ? time : req.body.deleteTime,
                }, {
                    where: {
                        vehicleId: { [Op.eq]: req.body.vehicleId }
                    }
                })

                console.log({ returnCode: 0, message: "刪除車籍資料 ", data: req.body })
                return res.json({ returnCode: 0, message: "刪除車籍資料: " + req.body.vehicleId })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },

         // 查詢全部車籍卡片(不包含刪除)資料
         selectAllCard: async (req, res) => {
                // 取得車籍的卡片
                try {
                    const time = getDateTime()
                    console.log(time + ' 取得車籍卡片資料(selectAllCard)')
                    // 取得所有聯絡人
                    const card_relationList = await card_relation.findAll({ where: {deleteTime: { [Op.eq]: '0' }},
                    raw: true })
                    console.log({ returnCode: 0, message: "取得車籍卡片資料", data: card_relationList })
                    return res.json({ returnCode: 0, message: "取得車籍卡片資料", data: card_relationList })
    
                } catch (err) {
                    console.log({ returnCode: 500, message: "系統錯誤", err: err })
                    return res.json({ returnCode: 500, message: "系統錯誤", err: err })
                }
        },
        // 查詢車籍卡片資料
        searchCard: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 取得車籍卡片資料(selectVehicle)')
                // 取得車籍的卡片
                switch (req.body.status) {
                    case 1:
                        const card_relationList = await card_relation.findAll({
                            where: { vehicleId: { [Op.eq]: req.body.vehicleId }, deleteTime: { [Op.eq]: '0' } },
                            raw: true
                        })
                        console.log({ returnCode: 0, message: "取得車籍卡片資料", data: card_relationList })
                        return res.json({ returnCode: 0, message: "取得車籍卡片資料", data: card_relationList })
                    case 2:
                        const card_relationAllList = await card_relation.findAll({
                            where: { vehicleId: { [Op.eq]: req.body.vehicleId }, card_type: { [Op.eq]: req.body.card_type } },
                            raw: true
                        })
                        console.log({ returnCode: 0, message: "取得車籍卡片資料", data: card_relationAllList })
                        return res.json({ returnCode: 0, message: "取得車籍卡片資料", data: card_relationAllList })
                    case 3:
                        const card_AllList = await card_relation.findAll({
                            where: { vehicleId: { [Op.eq]: req.body.vehicleId } },
                            raw: true
                        })
                        console.log({ returnCode: 0, message: "取得車籍卡片資料", data: card_AllList })
                        return res.json({ returnCode: 0, message: "取得車籍卡片資料", data: card_AllList })
                }
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 新增車籍卡片資料
        createCard: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 新增車籍卡片資料(createCard)')
                const card_relationList = await card_relation.create({
                    vehicleId: req.body.vehicleId == '' ? null : req.body.vehicleId,
                    buildType: "1",
                    card_type: req.body.card_type == '' ? null : req.body.card_type,
                    upload_reason: req.body.upload_reason == '' ? null : req.body.upload_reason,
                    notes: req.body.notes == '' ? null : req.body.notes,
                    vehicle_change_reason: req.body.vehicle_change_reason == '' ? null : req.body.vehicle_change_reason,
                    createTime: req.body.createTime == '' ? time : req.body.createTime,
                })
                console.log({ returnCode: 0, message: "新增車籍卡片資料", data: card_relationList.dataValues })
                return res.json({ returnCode: 0, message: "新增車籍卡片資料", data: card_relationList })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 修改車籍卡片資料
        updateCard: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 修改車籍卡片資料(updateCard)')
                const card_relationList = await card_relation.update({
                    vehicleId: req.body.vehicleId == '' ? null : req.body.vehicleId,
                    card_type: req.body.card_type == '' ? null : req.body.card_type,
                    upload_reason: req.body.upload_reason == '' ? null : req.body.upload_reason,
                    notes: req.body.notes == '' ? null : req.body.notes,
                    vehicle_change_reason: req.body.vehicle_change_reason == '' ? null : req.body.vehicle_change_reason,
                    updateTime: req.body.updateTime == '' ? time : req.body.updateTime,
                }, {
                    where: {
                        card_relationIid: { [Op.eq]: req.body.card_relationIid }
                    }
                })
                console.log({ returnCode: 0, message: "修改車籍卡片資料 ", data: req.body })
                return res.json({ returnCode: 0, message: "修改車籍卡片資料 " + req.body.card_relationIid })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 刪除車籍卡片資料
        deleteCard: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 刪除車籍卡片資料(deleteCard)')
                const card_relationList = await card_relation.update({
                    buildType: "3",
                    deleteTime: req.body.deleteTime == '' ? time : req.body.deleteTime,
                }, {
                    where: {
                        card_relationIid: { [Op.eq]: req.body.card_relationIid }
                    }
                })
                console.log({ returnCode: 0, message: "刪除車籍卡片資料 ", data: req.body })
                return res.json({ returnCode: 0, message: "刪除車籍卡片資料: " + req.body.card_relationIid })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },

        // 取得業務員資料
        selectSalesman: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 取得業務員資料(selectSalesman)')
                // 取得所有業務員
                const salesmanList = await salesman.findAll({ raw: true })
                console.log({ returnCode: 0, message: "取得業務員資料", data: salesmanList })
                return res.json({ returnCode: 0, message: "取得業務員資料", data: salesmanList })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 查詢客戶的業務員資料
        searchSalesman: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 查詢業務員資料(searchSalesman)')
                if (req.body.customerId) {
                    const sales_relationList = await sales_relation.findAll({
                        where: {
                            customerId: { [Op.eq]: req.body.customerId },
                        }, raw: true
                    })
                    let salesId = sales_relationList.map(x => x.salesId)
                    console.log(salesId)
                    const salesmanList = await salesman.findAll({
                        where: {
                            salesmanId: { [Op.eq]: salesId },
                        }, raw: true
                    })
                    console.log({ returnCode: 0, message: "查詢業務員資料", data: salesmanList })
                    return res.json({ returnCode: 0, message: "查詢業務員資料", data: salesmanList })
                } else {
                    console.log({ returnCode: -1, message: '查詢失敗，缺少參數' })
                    return res.json({ returnCode: -1, message: '查詢失敗，缺少參數' })
                }
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 新增業務員資料
        createSalesman: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 新增業務員資料(createContact)')
                const salesmanList = await salesman.create({
                    record_id: req.body.record_id,
                    employee_id: req.body.employee_id,
                    employee_name: req.body.employee_name,
                    job_title: req.body.job_title,
                    department_code: req.body.department_code,
                    department: req.body.department,
                    created: req.body.created,
                    createTime: req.body.createTime == '' ? time : req.body.createTime,
                })
                console.log({ returnCode: 0, message: "新增業務員資料", data: salesmanList.dataValues })
                return res.json({ returnCode: 0, message: "新增業務員資料", data: salesmanList })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 修改業務員資料
        updateSalesman: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 修改業務員資料(updateSalesman)')
                const contactList = await salesman.update({
                    record_id: req.body.record_id,
                    employee_id: req.body.employee_id,
                    employee_name: req.body.employee_name,
                    job_title: req.body.job_title,
                    department_code: req.body.department_code,
                    department: req.body.department,
                    updated: req.body.updated,
                    updateTime: req.body.updateTime == '' ? time : req.body.updateTime,
                }, {
                    where: {
                        salesmanId: { [Op.eq]: req.body.salesmanId }
                    }
                })
                console.log({ returnCode: 0, message: "修改業務員資料 ", data: req.body })
                return res.json({ returnCode: 0, message: "修改業務員資料 " + req.body.salesmanId })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 更改客戶負責的業務員
        updateSales_relation: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 更改客戶負責的業務員(updateSales_relation)')
                const sales_relationList = await sales_relation.update({
                    salesId: req.body.salesId,
                }, {
                    where: {
                        relationId: { [Op.eq]: req.body.relationId }
                    }
                })
                console.log({ returnCode: 0, message: "更改客戶負責的業務員 ", data: req.body })
                return res.json({ returnCode: 0, message: "更改客戶負責的業務員: " + req.body.relationId })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },

        // 取得折讓資料
        selectDiscount: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 取得折讓資料(selectDiscount)')
                // 取得所有業務員
                const discountList = await discount.findAll({ raw: true })
                console.log({ returnCode: 0, message: "取得折讓資料", data: discountList })
                return res.json({ returnCode: 0, message: "取得折讓資料", data: discountList })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 查詢客戶的折讓資料
        searchDiscount: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 查詢客戶的折讓資料(searchDiscount)')
                if (req.body.customerId) {
                    const discountList = await discount.findAll({
                        where: {
                            customerId: { [Op.eq]: req.body.customerId },
                        }, raw: true
                    })
                    console.log({ returnCode: 0, message: "查詢客戶的折讓資料", data: discountList })
                    return res.json({ returnCode: 0, message: "查詢客戶的折讓資料", data: discountList })
                } else {
                    console.log({ returnCode: -1, message: '查詢失敗，缺少參數' })
                    return res.json({ returnCode: -1, message: '查詢失敗，缺少參數' })
                }
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 新增折讓資料
        createDiscount: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 新增折讓資料(createDiscount)')
                const discountList = await discount.create({
                    customerId: req.body.customerId,
                    product_name: req.body.product_name,
                    supplier_name: req.body.supplier_name,
                    responsible_person: req.body.responsible_person,
                    discount_float: req.body.discount_float,
                    created: req.body.created,
                    createTime: req.body.createTime == '' ? time : req.body.createTime,
                })
                console.log({ returnCode: 0, message: "新增折讓資料", data: discountList.dataValues })
                return res.json({ returnCode: 0, message: "新增折讓資料", data: discountList })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 修改折讓資料
        updateDiscount: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 修改折讓資料(updateDiscount)')
                const discountList = await discount.update({
                    customerId: req.body.customerId,
                    product_name: req.body.product_name,
                    supplier_name: req.body.supplier_name,
                    responsible_person: req.body.responsible_person,
                    discount_float: req.body.discount_float,
                    updated: req.body.updated,
                    updateTime: req.body.updateTime == '' ? time : req.body.updateTime,
                }, {
                    where: {
                        discountId: { [Op.eq]: req.body.discountId }
                    }
                })
                console.log({ returnCode: 0, message: "修改折讓資料 ", data: req.body })
                return res.json({ returnCode: 0, message: "修改折讓資料 " + req.body.discountId })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 刪除折讓資料
        deleteDiscount: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 刪除折讓資料(deleteDiscount)')
                const discountList = await discount.update({
                    updated: req.body.updated,
                    deleteTime: req.body.deleteTime == '' ? time : req.body.deleteTime,
                }, {
                    where: {
                        discountId: { [Op.eq]: req.body.discountId }
                    }
                })
                console.log({ returnCode: 0, message: "刪除折讓資料 ", data: req.body })
                return res.json({ returnCode: 0, message: "刪除折讓資料: " + req.body.discountId })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },

        // 查詢車籍資料(車號)
        searchPlate: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 查詢車籍資料(searchPlate)')
                // 取得所有車籍
                const vehicleList = await vehicle.findAll({
                    where: {
                        license_plate: { [Op.eq]: req.body.license_plate },
                        deleteTime: { [Op.eq]: '0' }
                    },
                    raw: true
                })
                console.log({ returnCode: 0, message: "查詢車籍資料", data: vehicleList })
                return res.json({ returnCode: 0, message: "查詢車籍資料(車號)", data: vehicleList })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },

        // 轉客代或帳單組別
        transformation: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 轉客代或帳單組別(transformation)')
                req.body.forEach(async item => {
                    if (item.mode == 2) {
                        const updateCpc_data = await cpc_data.update({
                            customerId: item.newCustomerId
                        }, {
                            where: {
                                account_date: { [Op.gte]: getDateTime(item.date, 'YYYY/MM/DD', 1) },
                                license_plate: { [Op.eq]: item.license_plate }
                            }
                        })
                        const createReportsales_record = await reportsales_record.create({
                            salesDate: getDateTime(item.date, 'YYYY/MM/DD'),
                            customerId: item.oldCustomerId + ',' + item.newCustomerId,
                            mode: item.mode,
                            message: item.message,
                            starttime: time
                        })
                        console.log({ returnCode: 0, message: "轉客代成功", data: req.body })
                        return res.json({ returnCode: 0, message: "轉客代成功" })
                    } else if (item.mode == 3) {
                        const updateVehicle = await vehicle.update({
                            account_sortId: item.account_sortId
                        }, {
                            where: {
                                customerId: { [Op.eq]: item.customerId },
                                license_plate: { [Op.eq]: item.license_plate }
                            }
                        })
                        const updateCpc_data = await cpc_data.update({
                            account_sortId: item.account_sortId
                        }, {
                            where: {
                                customerId: item.customerId,
                                account_date: { [Op.gte]: getDateTime(item.date, 'YYYY/MM/DD', 1) },
                                license_plate: { [Op.eq]: item.license_plate }
                            }
                        })
                        const createReportsales_record = await reportsales_record.create({
                            salesDate: getDateTime(item.date, 'YYYY/MM/DD'),
                            customerId: item.customerId,
                            mode: item.mode,
                            message: item.message + ',' + item.account_sortId,
                            starttime: time
                        })

                        console.log(updateVehicle)
                    }
                    console.log({ returnCode: 0, message: "轉帳單組別成功", data: req.body })
                    return res.json({ returnCode: 0, message: "轉帳單組別成功" })
                })
                // console.log({ returnCode: 0, message: "轉客代或帳單組別" })
                // return res.json({ returnCode: 0, message: "轉客代或帳單組別", data: req.body })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },

        // 取出油品種類
        selectProduct: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 取出油品種類(selectProduct)')
                // 取得所有油品
                const productList = await product_class.findAll({ raw: true })
                console.log({ returnCode: 0, message: "取出油品種類", data: productList })
                return res.json({ returnCode: 0, message: "取出油品種類", data: productList })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },

        // 調整折讓
        modificationDiscount: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 調整折讓(transformation)')

                const updateDiscount = await discount.update({
                    discount_float: req.body.discount_float,
                    updateTime: req.body.updateTime == '' ? time : req.body.updateTime,
                }, {
                    where: {
                        customerId: { [Op.eq]: req.body.customerId },
                        product_name: req.body.product_name,
                    }
                })
                const updateCpc_data = await cpc_data.update({
                    discount: req.body.discount_float,
                }, {
                    where: {
                        customerId: { [Op.eq]: req.body.customerId },
                        productId: { [Op.eq]: req.body.product_name },
                        account_date: { [Op.gte]: getDateTime(req.body.date, 'YYYY/MM/DD', 1) },
                    }
                })
                const createReportsales_record = await reportsales_record.create({
                    salesDate: getDateTime(req.body.date, 'YYYY/MM/DD'),
                    customerId: req.body.customerId,
                    mode: 4,
                    message: req.body.product_name + ',' + req.body.discount_float,
                    starttime: time
                })

                console.log({ returnCode: 0, message: "調整折讓", data: req.body })
                return res.json({ returnCode: 0, message: "調整折讓", data: "調整筆數: " + updateCpc_data + " 筆" })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },

        
        // 取得未發簡訊(查詢日期)
        selectDefnotify: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 取得折讓資料(selectDefnotify)')
                // 取得所有業務員
                const notifyList = await defnotify.findAll({ 
                    where:{
                        createDate: { [Op.eq]: req.body.createDate },
                        sendType: { [Op.eq]: '0' },
                    },raw: true })
                console.log({ returnCode: 0, message: "取得未發簡訊", data: notifyList })
                return res.json({ returnCode: 0, message: "取得未發簡訊", data: notifyList })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 設定傳送訊息
        setDefnotify: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 設定傳送訊息(setDefnotify)')
                console.log(req.body.id)
                const notifyList = await defnotify.update({
                    sendType: '1',
                }, {
                    where: {
                        id: { [Op.in]: req.body.id }
                    }
                })
                console.log({ returnCode: 0, message: "設定傳送訊息 ", data: req.body.id })
                return res.json({ returnCode: 0, message: "設定傳送訊息 " })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },


        // 取出登錄車籍資料
        getRecordedVehicle: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 取出登錄車籍資料(getRecordedVehicle)')
                const [results, metadata] = await sequelizeConfig.query("SELECT a.customerId, c.cus_name, d.acc_name, a.license_plate, b.card_number, a.createTime, b.cpc_account FROM  (((jutai.vehicle a LEFT JOIN jutai.card_relation b ON ((a.vehicleId = b.vehicleId))) LEFT JOIN jutai.customer c ON ((a.customerId = c.cus_code))) LEFT JOIN jutai.account_sort d ON ((a.account_sortId = d.account_sortId))) where b.buildType in (1,4,6)");
                console.log({ returnCode: 0, message: "取出登錄車籍資料", data: results })
                return res.json({ returnCode: 0, message: "取出登錄車籍資料", data: results })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 登錄車籍資料
        recordedVehicle: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 登錄車籍資料(recordedVehicle)')
                // 查詢車號
                const searchVehicle = await vehicle.findAll({
                    where: {
                        license_plate: { [Op.eq]: req.body.license_plate },
                        deleteTime: { [Op.eq]: '0' }
                    }, raw: true
                })
                switch (req.body.status) {
                    case 1:
                        // 新增車號
                        await vehicle.create({
                            account_sortId: req.body.account_sortId,
                            customerId: req.body.customerId,
                            license_plate: req.body.license_plate,
                            vehicle_type: req.body.vehicle_type,
                            product_name: req.body.product_name,
                            vehicle_change: req.body.vehicle_change,
                            createTime: req.body.createTime == '' ? time : req.body.createTime,
                        })
                        const searchVehicle1 = await vehicle.findAll({
                            where: {
                                license_plate: { [Op.eq]: req.body.license_plate },
                                deleteTime: { [Op.eq]: '0' }
                            }, raw: true
                        })
                        console.log(searchVehicle1[0].vehicleId)
                        // 新增卡片
                        await card_relation.create({
                            vehicleId: searchVehicle1[0].vehicleId,
                            buildType: "1",
                            card_number: req.body.card_number == '' ? null : req.body.card_number,
                            card_type: req.body.card_type,
                            upload_time: "0",
                            upload_reason: req.body.upload_reason == '' ? "0" : req.body.upload_reason,
                            card_create_date: req.body.card_create_date == '' ? time : req.body.card_create_date,
                            card_arrival_date: "0",
                            card_stop_date: "0",
                            stop_upload_time: "0",
                            stop_upload_reason: "0",
                            vehicle_change_reason: req.body.vehicle_change_reason == '' ? null : req.body.vehicle_change_reason,
                            cpc_account: req.body.cpc_account,
                            status: req.body.status,
                            createTime: req.body.createTime == '' ? time : req.body.createTime,
                        })
                        console.log({ returnCode: 0, message: "登錄車籍資料", data: req.body })
                        return res.json({ returnCode: 0, message: "登錄車籍資料" })
                    case 2:
                        // 停卡
                        const searcCard_relation2 = await card_relation.findAll({
                            where: {
                                card_number: { [Op.eq]: req.body.card_number },
                                deleteTime: { [Op.eq]: '0' }
                            }, raw: true
                        })
                        if (searcCard_relation2.length > 0) {
                            console.log(searcCard_relation2[0].card_relationIid)
                            await card_relation.update({
                                buildType: "4",
                                card_type: req.body.card_type,
                                // upload_time: "0",
                                card_stop_date: req.body.card_stop_date == '' ? time : req.body.card_stop_date,
                                upload_reason: req.body.upload_reason == '' ? "0" : req.body.upload_reason,
                                vehicle_change_reason: req.body.vehicle_change_reason == '' ? null : req.body.vehicle_change_reason,
                                status: req.body.status,
                                deleteTime: req.body.deleteTime == '' ? time : req.body.deleteTime,
                            }, {
                                where: {
                                    card_relationIid: { [Op.eq]: searcCard_relation2[0].card_relationIid }
                                }
                            })
                        } else {
                            console.log({ returnCode: -1, message: "停卡失敗，此卡號已刪除", data: req.body })
                            return res.json({ returnCode: -1, message: "停卡失敗，此卡號" + req.body.card_number + "已刪除" })
                        }

                        // 查詢車號
                        const searchVehicle2 = await vehicle.findAll({
                            where: {
                                license_plate: { [Op.eq]: req.body.license_plate },
                                deleteTime: { [Op.eq]: '0' }
                            }, raw: true
                        })
                        if (searchVehicle2.length > 0) {
                            console.log(searchVehicle2[0].vehicleId)
                            // 新增卡片
                            await card_relation.create({
                                vehicleId: searchVehicle2[0].vehicleId,
                                buildType: "1",
                                card_type: req.body.card_type,
                                upload_time: "0",
                                upload_reason: "新增",
                                card_create_date: req.body.card_create_date == '' ? time : req.body.card_create_date,
                                card_arrival_date: "0",
                                card_stop_date: "0",
                                stop_upload_time: "0",
                                stop_upload_reason: "0",
                                vehicle_change_reason: req.body.vehicle_change_reason == '' ? null : req.body.vehicle_change_reason,
                                cpc_account: req.body.cpc_account,
                                status: req.body.status,
                                createTime: req.body.createTime == '' ? time : req.body.createTime,
                            })
                        } else {
                            console.log({ returnCode: -1, message: "新增車籍卡片失敗", data: req.body })
                            return res.json({ returnCode: -1, message: "新增車籍卡片失敗" })
                        }

                        console.log({ returnCode: 0, message: "登錄車籍資料", data: req.body })
                        return res.json({ returnCode: 0, message: "登錄車籍資料" })
                    case 3:
                        // 刪除車號
                        const searchVehicle3 = await vehicle.findAll({
                            where: {
                                license_plate: { [Op.eq]: req.body.license_plate },
                                deleteTime: { [Op.eq]: '0' }
                            }, raw: true
                        })
                        console.log(searchVehicle3[0].vehicleId)
                        await vehicle.update({
                            vehicle_change: req.body.vehicle_change,
                            deleteTime: req.body.deleteTime == '' ? time : req.body.deleteTime,
                        }, {
                            where: {
                                vehicleId: { [Op.eq]: searchVehicle3[0].vehicleId }
                            }
                        })
                        // 停卡
                        // const searcCard_relation3 = await card_relation.findAll({
                        //     where: {
                        //         card_number: { [Op.eq]: req.body.card_number },
                        //         deleteTime: { [Op.eq]: '0' }
                        //     }, raw: true
                        // })
                        // console.log(searcCard_relation3[0].card_relationIid)
                        await card_relation.update({
                            buildType: "4",
                            card_type: req.body.card_type,
                            // upload_time: "0",
                            card_stop_date: req.body.card_stop_date == '' ? time : req.body.card_stop_date,
                            upload_reason: req.body.upload_reason == '' ? "0" : req.body.upload_reason,
                            vehicle_change_reason: req.body.vehicle_change_reason == '' ? null : req.body.vehicle_change_reason,
                            status: req.body.status,
                            deleteTime: req.body.deleteTime == '' ? time : req.body.deleteTime,
                        }, {
                            where: {
                                vehicleId: { [Op.eq]: searchVehicle3[0].vehicleId },
                                deleteTime: { [Op.eq]: '0' },
                            }
                        })
                        // 新增車號
                        await vehicle.create({
                            account_sortId: req.body.account_sortId,
                            customerId: req.body.customerId,
                            license_plate: req.body.license_plate,
                            vehicle_type: req.body.vehicle_type,
                            product_name: req.body.product_name,
                            vehicle_change: req.body.vehicle_change,
                            createTime: req.body.createTime == '' ? time : req.body.createTime,
                        })
                        const searchVehicle4 = await vehicle.findAll({
                            where: {
                                license_plate: { [Op.eq]: req.body.license_plate },
                                deleteTime: { [Op.eq]: '0' }
                            }, raw: true
                        })
                        console.log(searchVehicle4[0].vehicleId)
                        // 新增卡片
                        await card_relation.create({
                            vehicleId: searchVehicle4[0].vehicleId,
                            buildType: "1",
                            card_number: req.body.card_number == '' ? null : req.body.card_number,
                            card_type: req.body.card_type,
                            upload_time: "0",
                            upload_reason: "新增",
                            card_create_date: req.body.card_create_date == '' ? time : req.body.card_create_date,
                            card_arrival_date: "0",
                            card_stop_date: "0",
                            stop_upload_time: "0",
                            stop_upload_reason: "0",
                            vehicle_change_reason: req.body.vehicle_change_reason == '' ? null : req.body.vehicle_change_reason,
                            cpc_account: req.body.cpc_account,
                            status: req.body.status,
                            createTime: req.body.createTime == '' ? time : req.body.createTime,
                        })
                        console.log({ returnCode: 0, message: "登錄車籍資料", data: req.body })
                        return res.json({ returnCode: 0, message: "登錄車籍資料" })
                    case 4: // 停卡
                        const searcCard_relation4 = await card_relation.findAll({
                            where: {
                                card_number: { [Op.eq]: req.body.card_number },
                                deleteTime: { [Op.eq]: '0' }
                            }, raw: true
                        })
                        console.log(searcCard_relation4[0].card_relationIid)
                        await card_relation.update({
                            buildType: "4",
                            card_type: req.body.card_type,
                            // upload_time: "0",
                            card_stop_date: req.body.card_stop_date == '' ? time : req.body.card_stop_date,
                            upload_reason: req.body.upload_reason == '' ? "0" : req.body.upload_reason,
                            vehicle_change_reason: req.body.vehicle_change_reason == '' ? null : req.body.vehicle_change_reason,
                            status: req.body.status,
                            deleteTime: req.body.deleteTime == '' ? time : req.body.deleteTime,
                        }, {
                            where: {
                                card_relationIid: { [Op.eq]: searcCard_relation4[0].card_relationIid }
                            }
                        })
                        console.log({ returnCode: 0, message: "登錄車籍資料", data: req.body })
                        return res.json({ returnCode: 0, message: "登錄車籍資料" })
                    case 5: // 原卡復油
                        const searchVehicle12 = await vehicle.findAll({
                            where: {
                                license_plate: { [Op.eq]: req.body.license_plate },
                                deleteTime: { [Op.eq]: '0' }
                            }, raw: true
                        })
                        console.log(searchVehicle12[0].vehicleId)
                        const searcCard_relation5 = await card_relation.findAll({
                            where: {
                                card_number: { [Op.eq]: req.body.card_number },
                                vehicleId: { [Op.eq]: searchVehicle12[0].vehicleId }
                            }, raw: true
                        })
                        if (searcCard_relation5.length == 0) {
                            console.log({ returnCode: -1, message: "查無此條件的卡片", data: req.body })
                            return res.json({ returnCode: -1, message: "查無此條件的卡片" })
                        }
                        console.log(searcCard_relation5[0].card_relationIid)
                        await card_relation.update({
                            buildType: "6",
                            card_type: req.body.card_type,
                            // upload_time: "0",
                            card_stop_date: req.body.card_stop_date == '' ? null : req.body.card_stop_date,
                            upload_reason: req.body.upload_reason == '' ? "0" : req.body.upload_reason,
                            vehicle_change_reason: req.body.vehicle_change_reason == '' ? null : req.body.vehicle_change_reason,
                            status: req.body.status,
                            deleteTime: req.body.deleteTime == '' ? "0" : req.body.deleteTime,
                        }, {
                            where: {
                                card_relationIid: { [Op.eq]: searcCard_relation5[0].card_relationIid }
                            }
                        })
                        console.log({ returnCode: 0, message: "登錄車籍資料", data: req.body })
                        return res.json({ returnCode: 0, message: "登錄車籍資料" })
                    case 6: // 改客戶(原卡號停用)
                        // 刪除車號
                        const searchVehicle6 = await vehicle.findAll({
                            where: {
                                license_plate: { [Op.eq]: req.body.license_plate },
                                deleteTime: { [Op.eq]: '0' }
                            }, raw: true
                        })
                        console.log(searchVehicle6[0].vehicleId)
                        await vehicle.update({
                            vehicle_change: req.body.vehicle_change,
                            deleteTime: req.body.deleteTime == '' ? time : req.body.deleteTime,
                        }, {
                            where: {
                                vehicleId: { [Op.eq]: searchVehicle6[0].vehicleId }
                            }
                        })
                        // 停卡
                        await card_relation.update({
                            buildType: "5",
                            card_type: req.body.card_type,
                            // card_number: req.body.card_number,
                            // upload_time: "0",
                            card_stop_date: req.body.card_stop_date == '' ? time : req.body.card_stop_date,
                            upload_reason: req.body.upload_reason == '' ? "0" : req.body.upload_reason,
                            vehicle_change_reason: req.body.vehicle_change_reason == '' ? null : req.body.vehicle_change_reason,
                            status: req.body.status,
                            deleteTime: req.body.deleteTime == '' ? time : req.body.deleteTime,
                        }, {
                            where: {
                                vehicleId: { [Op.eq]: searchVehicle6[0].vehicleId },
                                deleteTime: { [Op.eq]: '0' },
                            }
                        })
                        // 新增車號
                        await vehicle.create({
                            account_sortId: req.body.account_sortId,
                            customerId: req.body.customerId,
                            license_plate: req.body.license_plate,
                            vehicle_type: req.body.vehicle_type,
                            product_name: req.body.product_name,
                            vehicle_change: req.body.vehicle_change,
                            createTime: req.body.createTime == '' ? time : req.body.createTime,
                        })
                        const searchVehicle7 = await vehicle.findAll({
                            where: {
                                license_plate: { [Op.eq]: req.body.license_plate },
                                deleteTime: { [Op.eq]: '0' }
                            }, raw: true
                        })
                        console.log(searchVehicle7[0].vehicleId)
                        // 新增卡片
                        await card_relation.create({
                            vehicleId: searchVehicle7[0].vehicleId,
                            buildType: "3",
                            card_number: req.body.card_number == '' ? null : req.body.card_number,
                            card_type: req.body.card_type,
                            upload_time: "0",
                            upload_reason: "新增",
                            card_create_date: req.body.card_create_date == '' ? time : req.body.card_create_date,
                            card_arrival_date: "0",
                            card_stop_date: "0",
                            stop_upload_time: "0",
                            stop_upload_reason: "0",
                            vehicle_change_reason: req.body.vehicle_change_reason == '' ? null : req.body.vehicle_change_reason,
                            cpc_account: req.body.cpc_account,
                            status: req.body.status,
                            createTime: req.body.createTime == '' ? time : req.body.createTime,
                        })
                        console.log({ returnCode: 0, message: "登錄車籍資料", data: req.body })
                        return res.json({ returnCode: 0, message: "登錄車籍資料" })
                    case 7:
                        const searchVehicle8 = await vehicle.findAll({
                            where: {
                                license_plate: { [Op.eq]: req.body.license_plate },
                                deleteTime: { [Op.eq]: '0' }
                            }, raw: true
                        })
                        console.log(searchVehicle8[0].vehicleId)
                        // 新增卡片
                        await card_relation.create({
                            vehicleId: searchVehicle8[0].vehicleId,
                            buildType: "1",
                            card_number: req.body.card_number == '' ? null : req.body.card_number,
                            card_type: req.body.card_type,
                            upload_time: "0",
                            upload_reason: req.body.upload_reason == '' ? "0" : req.body.upload_reason,
                            card_create_date: req.body.card_create_date == '' ? time : req.body.card_create_date,
                            card_arrival_date: "0",
                            card_stop_date: "0",
                            stop_upload_time: "0",
                            stop_upload_reason: "0",
                            vehicle_change_reason: req.body.vehicle_change_reason == '' ? null : req.body.vehicle_change_reason,
                            cpc_account: req.body.cpc_account,
                            status: req.body.status,
                            createTime: req.body.createTime == '' ? time : req.body.createTime,
                        })
                        console.log({ returnCode: 0, message: "登錄車籍資料", data: req.body })
                        return res.json({ returnCode: 0, message: "登錄車籍資料" })
                }
                console.log({ returnCode: -1, message: "缺少參數：狀態", data: req.body })
                return res.json({ returnCode: -1, message: "缺少參數：狀態" })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 產生中油檔
        generateCPCfile: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 產生中油檔(generateCPCfile)')
                console.log(req.body)

                const card_relationList = await card_relation.findAll({
                    where: {
                        buildType: { [Op.in]: ['1', '4', '6'] },
                        cpc_account: { [Op.eq]: req.body.cpc_account },
                    },
                    raw: true
                })
                // 取對應vehicleId的車籍資料
                const vehicleId = card_relationList.map(x => x.vehicleId)
                const vehicleList = await vehicle.findAll({
                    where: {
                        vehicleId: { [Op.in]: vehicleId }
                    },
                    // limit: 1,
                    raw: true
                })
                // 利用車籍資料取對應customerId的客戶資料 
                const customerId = vehicleList.map(x => x.customerId)
                const customerList = await customer.findAll({
                    where: {
                        cus_code: { [Op.in]: customerId }
                    }, raw: true
                })
                vehicleList.forEach(item => {
                    console.log(item.vehicleId)
                    let relation = card_relationList.filter(x => x.vehicleId == item.vehicleId);
                    console.log(relation)
                    relation.forEach(x => {
                        x.customerId = item.customerId;
                        x.product_name = item.product_name;
                        x.license_plate = item.license_plate;
                    })
                })
                card_relationList.forEach(async item => {
                    const resultCustodian = customerList.find(x => item.customerId == x.cus_code)
                    item.custodian = resultCustodian == undefined ? null : resultCustodian.cus_code + resultCustodian.cus_name
                    if (item.buildType == "1") {
                        await card_relation.update({
                            buildType: "2",
                            upload_time: req.body.upload_time == '' ? time : req.body.upload_time,
                            upload_reason: req.body.upload_reason == '' ? null : req.body.upload_reason,
                            deleteTime: req.body.deleteTime == '' ? time : req.body.deleteTime,
                        }, {
                            where: {
                                card_relationIid: { [Op.eq]: item.card_relationIid }
                            }
                        })
                    } else if (item.buildType == "4") {
                        await card_relation.update({
                            buildType: "5",
                            stop_upload_time: req.body.stop_upload_time == '' ? time : req.body.stop_upload_time,
                            stop_upload_reason: req.body.stop_upload_reason == '' ? null : req.body.stop_upload_reason,
                            card_stop_date: req.body.card_stop_date == '' ? time : req.body.card_stop_date,
                            deleteTime: req.body.deleteTime == '' ? time : req.body.deleteTime,
                        }, {
                            where: {
                                card_relationIid: { [Op.eq]: item.card_relationIid }
                            }
                        })
                    } else if (item.buildType == "6") {
                        await card_relation.update({
                            buildType: "3",
                            stop_upload_reason: req.body.stop_upload_reason == '' ? null : req.body.stop_upload_reason,
                            card_stop_date: req.body.card_stop_date == '' ? null : req.body.card_stop_date,
                            deleteTime: req.body.deleteTime == '' ? "0" : req.body.deleteTime,
                        }, {
                            where: {
                                card_relationIid: { [Op.eq]: item.card_relationIid }
                            }
                        })
                    }
                })

                console.log({ returnCode: 0, message: "產生中油檔", data: card_relationList })
                return res.json({ returnCode: 0, message: "產生中油檔", data: card_relationList })

            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 匯入中油檔
        importCPCfile: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 匯入中油檔(importCPCfile)')
                // console.log(req.body)
                // let vehicleList =null
                req.body.data.forEach(async item => {
                    // let license_plate = item.map(x=>x.license_plate)
                    let custodian = (item.custodian).split(' ')[0]
                    // console.log(custodian)
                    const vehicleList = await vehicle.findAll({
                        where: {
                            customerId: custodian,
                            license_plate: { [Op.eq]: item.license_plate },
                            // product_name: { [Op.eq]: item.product_name },
                            deleteTime: { [Op.eq]: '0' }
                        },
                        // limit: 1,
                        raw: true
                    })
                    vehicleList.forEach(async x => {
                        const card_relationList = await card_relation.update({
                            buildType: '3',
                            card_number: item.card_number,
                            card_arrival_date: item.card_arrival_date == '' ? time : item.card_arrival_date,
                            upload_time: item.upload_time,
                        }, {
                            where: {
                                vehicleId: { [Op.eq]: x.vehicleId },
                                card_type: { [Op.eq]: item.card_type },
                                deleteTime: { [Op.eq]: '0' }
                            },
                            raw: true
                        })
                        console.log(card_relationList)
                    })
                    // console.log(vehicleList)
                    // return res.json(vehicleList)
                    console.log({ returnCode: 0, message: "匯入中油檔", data: vehicleList })
                })
                return res.json({ returnCode: 0, message: "匯入中油檔成功" })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 未核對中油檔資料
        selectCPCdata: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 未核對中油檔資料(selectCPCdata)')

                const card_relationList = await card_relation.findAll({
                    where: {
                        buildType: { [Op.eq]: '2' },
                        deleteTime: { [Op.eq]: '0' }
                    },
                    raw: true
                })
                // console.log(card_relationList)

                // console.log(vehicleList)
                // return res.json(vehicleList)
                console.log({ returnCode: 0, message: "未核對中油檔資料", data: card_relationList })

                return res.json({ returnCode: 0, message: "未核對中油檔資料", data: card_relationList })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },




        // 供應商帳密
        supplierAcc: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 供應商帳密(supplierAcc)')
                const supplierList = await supplier.findAll({ attributes: ['account', 'password'], raw: true })
                console.log({ returnCode: 0, message: "查詢供應商帳密", data: supplierList })
                return res.json({ returnCode: 0, message: "查詢成功", data: supplierList })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },

        // 更新供應商帳密
        updateSupplierAcc: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 更新供應商帳密(updateSupplierAcc)')
                const supplierList = await supplier.update({
                    password: EnObject(req.body.password),
                    modification_time: getDateTime(null, 'YYYY-MM-DD'),
                }, {
                    where: {
                        account: { [Op.eq]: req.body.account }
                    }
                })
                console.log({ returnCode: 0, message: "更新供應商帳密", data: req.body })
                return res.json({ returnCode: 0, message: "更新成功", data: req.body })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },

        // 加密
        encryptionPWD: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 加密(encryptionPWD)')
                let Str = 'Ff4299315777'
                console.log({ returnCode: 0, message: "加密", data: EnObject(Str) })
                return res.json({ returnCode: 0, message: "加密", data: EnObject(Str) })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },

        // 解密
        decryptPWD: async (req, res) => {
            try {
                const time = getDateTime()
                console.log(time + ' 解密(decryptPWD)')
                const supplierList = await supplier.findAll({ attributes: ['account', 'password'], raw: true })
                supplierList.forEach(element => {
                    element.decryptPWD = DeObject(element.password)
                });
                // let Str = 'VTJGc2RHVmtYMS95SGZQZVhjOFRDa25Jd2dybGdKQ1ZObEdwMDBkQmFjWT0='
                console.log({ returnCode: 0, message: "解密", data: supplierList })
                return res.json({ returnCode: 0, message: "解密", data: supplierList })
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
    }
}