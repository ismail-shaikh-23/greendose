module.exports = (sequelize, DataTypes) => {
    const orderDeliveryHistory = sequelize.define('orderDeliveryHistory', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        orderDetailsId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(255),
            enum: ['placed', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'],
            defaultValue: 'placed'
        },
        updatedBy: {
            type: DataTypes.INTEGER,
        },
        isCurrentActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
    },
    {
        freezeTableName: true,
        tableName: 'order_delivery_history',
        timestamps: true,
        paranoid: true,
        underscored: true,
    });
    orderDeliveryHistory.associate = function (models) {
        orderDeliveryHistory.belongsTo(models.orderDetail, {
            foreignKey: 'orderDetailsId',
            as: 'orderDetails' 
        });

        orderDeliveryHistory.belongsTo(models.user, {
            foreignKey: 'updatedBy',
        });
    };

    return orderDeliveryHistory;
}