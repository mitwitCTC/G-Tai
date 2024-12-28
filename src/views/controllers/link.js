module.exports = ({ sequelize }) => {
    const express = require('express')
    const { line_member, contact, customer, reportsales } = sequelize
    const Sequelize = require('sequelize');
    const Op = Sequelize.Op;
    const dayjs = require('dayjs')

    const getDateTime = (input = null, timeFormat = 'YYYY-MM-DD HH:mm:ss') => {
        let date = input ? input : new Date();
        let dateTime = dayjs(date).format(timeFormat)
        return dateTime
    }

    return {
        // LINE 綁定
        linkLine: async (req, res) => {
            try {
                console.log(req.body)
                const time = getDateTime()
                console.log(time + ' LINE 綁定(linkLine)')
                if (req.body.vat_number || req.body.memberLineId) {

                    // 使用身分證/統編 查詢客戶代號 
                    const customerList = await customer.findAll({
                        where: {
                            vat_number: { [Op.eq]: req.body.vat_number }
                        },
                        attributes: ['cus_code', 'vat_number'],
                        raw: true
                    })
                    if (customerList.length == 0) {
                        console.log({ returnCode: -3, message: "LINE 綁定失敗，查無此客戶" })
                        return res.json({ returnCode: -3, message: "LINE 綁定失敗，查無此客戶" })
                    }
                    // 使用lineId查詢memberId
                    const memberList = await line_member.findAll({
                        where: {
                            memberLineId: { [Op.eq]: req.body.memberLineId }
                        },
                        attributes: ['memberId', 'memberProfileName', 'memberLineId'],
                        raw: true
                    })
                    if (memberList.length == 0) {
                        console.log({ returnCode: -4, message: "LINE 綁定失敗，查無此LINE好友資訊" })
                        return res.json({ returnCode: -4, message: "LINE 綁定失敗，查無此LINE好友資訊" })
                    }
                    // 查詢此客戶綁定數(LINE)
                    const contactList = await contact.findAll({
                        where: {
                            customerId: { [Op.eq]: customerList[0].cus_code },
                            isLine: { [Op.eq]: '1' },
                            deleteTime: { [Op.eq]: '0' }
                        },
                        attributes: ['customerId', [Sequelize.fn('COUNT', Sequelize.col('contactId')), 'count']],
                        raw: true
                    })
                    // 查詢此客戶是否已綁定此客代
                    const seachContact = await contact.findAll({
                        where: {
                            customerId: { [Op.eq]: customerList[0].cus_code },
                            memberId: memberList[0].memberId,
                            isLine: { [Op.eq]: '1' },
                            deleteTime: { [Op.eq]: '0' }
                        },
                        attributes: ['customerId', [Sequelize.fn('COUNT', Sequelize.col('contactId')), 'count']],
                        raw: true
                    })
                    if (contactList[0].count < 2) {
                        // 同個line不可綁同客代
                        if (seachContact[0].count == 1) {
                            console.log({ returnCode: -5, message: "LINE 綁定失敗，您已綁定此帳號" })
                            return res.json({ returnCode: -5, message: "LINE 綁定失敗，您已綁定此帳號" })
                        }
                        // 新增聯絡人
                        await contact.create({
                            customerId: customerList[0].cus_code,
                            isLine: '1',
                            memberId: memberList[0].memberId,
                            name: memberList[0].memberProfileName,
                            billNotify: req.body.billNotify,
                            billMail: req.body.billMail == '' ? null : req.body.billMail,
                            messageNotify: req.body.messageNotify,
                            mobile: req.body.mobile == '' ? null : req.body.mobile,
                            messageMail: req.body.messageMail == '' ? null : req.body.messageMail,
                            createTime: time
                        })
                        console.log({ returnCode: 0, message: "LINE 綁定成功" })
                        return res.json({ returnCode: 0, message: "LINE 綁定成功" })
                    } else {
                        console.log({ returnCode: -1, message: "LINE 綁定失敗，此帳號已綁定兩人" })
                        return res.json({ returnCode: -1, message: "LINE 綁定失敗，此帳號已綁定兩人" })
                    }
                } else {
                    console.log({ returnCode: -2, message: "LINE 綁定失敗，缺少參數" })
                    return res.json({ returnCode: -2, message: "LINE 綁定失敗，缺少參數" })
                }
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
        // 取餘額
        balance: async (req, res) => {
            try {
                console.log(req.body)
                const time = getDateTime()
                console.log(time + ' 取當月餘額(balance)')
                if (req.body.memberLineId) {
                    // 使用userId查詢memberId
                    const memberList = await line_member.findAll({
                        where: {
                            memberLineId: { [Op.eq]: req.body.memberLineId }
                        },
                        attributes: ['memberId', 'memberProfileName', 'memberLineId'],
                        raw: true
                    })
                    if (memberList.length == 0) {
                        console.log({ returnCode: -4, message: "查無此LINE好友資訊" })
                        return res.json({ returnCode: -4, message: "查無此LINE好友資訊" })
                    }
                    // 查詢此客戶綁定數(LINE)
                    const contactList = await contact.findAll({
                        where: {
                            memberId: { [Op.eq]: memberList[0].memberId },
                            isLine: { [Op.eq]: '1' },
                            deleteTime: { [Op.eq]: '0' }
                        },
                        attributes: ['customerId'],
                        raw: true
                    })
                    if (contactList.length == 0) {
                        console.log({ returnCode: -3, message: "查無綁定帳號" })
                        return res.json({ returnCode: -3, message: "查無綁定帳號" })
                    }
                    console.log(contactList)
                    const customerId = contactList.map((x) => x.customerId)
                    console.log(customerId)
                    // 查此客代餘額
                    const customerList = await customer.findAll({
                        where: {
                            cus_code: { [Op.in]: customerId }
                        },
                        attributes: ['cus_code','cus_name','month_balance'],
                        raw: true
                    })
                    if (customerList.length == 0) {
                        console.log({ returnCode: -2, message: "查無此客代餘額" })
                        return res.json({ returnCode: -2, message: "查無此客代餘額" })
                    }
                    const reportsalesList = await reportsales.findAll({
                        where: { customerId: { [Op.in]: customerId } },
                        order: [['salesDate', 'DESC']],
                        raw: true
                    })
                    customerList.forEach(item => {
                        if (reportsalesList.length > 0) {
                            item.dateTime = reportsalesList[0].salesDate + ' 23:59:59'
                        } else {
                            item.dateTime = ''
                        }
                    });
                    console.log({ returnCode: 0, message: "查詢成功", data: customerList })
                    return res.json({ returnCode: 0, message: "查詢成功", data: customerList })

                } else {
                    console.log({ returnCode: -1, message: "查詢失敗，缺少參數" })
                    return res.json({ returnCode: -1, message: "查詢失敗，缺少參數" })
                }
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
    }
}