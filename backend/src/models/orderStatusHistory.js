module.exports = (sequelize, DataTypes) => {
    const orderStatusHistory = sequelize.define('orderStatusHistory', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(255),
            enum: ['pending', 'success', 'failed'],
            defaultValue: 'pending'
        },
        updatedBy: {
            type: DataTypes.INTEGER,
        },
        remarks: {
            type: DataTypes.STRING(255),
            default: null
        }
    },
    {
        freezeTableName: true,
        tableName: 'order_status_history',
        timestamps: true,
        paranoid: true,
        underscored: true,
    });

    orderStatusHistory.associate = function (models) {
        orderStatusHistory.belongsTo(models.order, {
            foreignKey: 'orderId',
            as: 'order' 
        });

        orderStatusHistory.belongsTo(models.user, {
            foreignKey: 'updatedBy',
            as: 'user'
        });
    };

    return orderStatusHistory;
}