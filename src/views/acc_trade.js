'use strict';
module.exports = (sequelize, DataTypes) => {
    const acc_trade = sequelize.define('acc_trade', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            notNull: true,
            autoIncrement: false
        },
        parkId: { type: DataTypes.STRING, notNull: false, },
        trade_name: { type: DataTypes.STRING, notNull: false, },
        amount: { type: DataTypes.STRING, notNull: false, },
        accDate: { type: DataTypes.STRING, notNull: false, },
        accFarewell: { type: DataTypes.STRING, notNull: false, },
        creatTime: { type: DataTypes.STRING, notNull: false, },
        deleteTime: { type: DataTypes.STRING, notNull: false, },
        debitmessage: { type: DataTypes.STRING, notNull: false, },
        creditmessage: { type: DataTypes.STRING, notNull: false, },
        customerId: { type: DataTypes.STRING, notNull: false, },
        cus_name: { type: DataTypes.STRING, notNull: false, },
    }, { operatorAliases: true, freezeTableName: true, timestamps: false });

    return acc_trade
}

