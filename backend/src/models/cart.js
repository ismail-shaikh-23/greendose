module.exports = (sequelize, DataTypes) => {
    const cart = sequelize.define('cart', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        customerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        subTotal: {
            type: DataTypes.DECIMAL,
            defaultValue: 0
        },
        total: {
            type: DataTypes.DECIMAL,
            defaultValue: 0
        },
        discount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        handlingCharges: {
            type: DataTypes.DECIMAL,
            defaultValue: 0.00,
        },
        deliveryFee: {
            type: DataTypes.DECIMAL,
            defaultValue: 0.00,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        timestamps: true,
        paranoid: true,
        tableName: 'cart',
        underscored: true
    });

    cart.associate = (models) => {
        cart.belongsTo(models.customer, { 
            foreignKey: 'customerId',
            as: 'customer'
        });
        cart.hasMany(models.cartItem, { 
            foreignKey: 'cartId', 
            as: 'cartItems' 
        });
    };
    return cart;
};
