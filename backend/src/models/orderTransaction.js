module.exports = (sequelize, DataTypes) => {
    const orderTransaction = sequelize.define('orderTransaction', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        orderId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'order',
                key: 'id'
            }
        },
        transactionId: {
            type: DataTypes.STRING,
        },
        request: {
            type: DataTypes.STRING
        },
        response: {
            type: DataTypes.STRING
        },
        paymentMode: {
            type: DataTypes.ENUM('credit_card', 'paypal', 'bank_transfer', 'cod'),
            defaultValue: 'cod' // as per the current phase and requirment might be change further
        },
        paymentGatewayRef: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.ENUM('initiated', 'paid', 'failed', 'pending', 'cod')
        }
    },
        {
            timestamps: true,
            tableName: 'order_transaction',
            paranoid: true,
            underscored: true,
        });

    return orderTransaction;
}