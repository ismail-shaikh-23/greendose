const orderId = require('order-id')('ORDER');
const orderIdGD = require('order-id')('GD');

/* eslint-disable max-lines-per-function */
module.exports = (sequelize, DataTypes) => {
  const order = sequelize.define('order',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      orderNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      addressId: {
        type: DataTypes.INTEGER,
      },
      cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      subTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      discount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
      },
      tax: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
      },
      commissionFee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
      },
      deliveryFee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
      },
      handlingFee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
      },
      paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
        defaultValue: 'pending',
      },
      invoiceNumber: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      paranoid: true,
      tableName: 'order',
      underscored: true,
    },
  );

  order.associate = (model) => {
    order.belongsTo(model.customer, {
      foreignKey: 'customerId',
      as: 'customer'
    });
    order.belongsTo(model.cart, {
      foreignKey: 'cartId',
      as: 'cart'
    });
    order.belongsTo(model.address, {
      foreignKey: 'addressId',
      as: 'address'
    });
    order.hasMany(model.orderDetail, {
      foreignKey: 'orderId',
      as: 'orderDetails'
    });
    order.hasOne(model.orderStatusHistory, {
      foreignKey: 'orderId',
      as: 'orderStatusHistory'
    })
  };

  order.beforeCreate(async(order) => {
    order.orderNumber = orderId.generate(new Date());
    order.invoiceNumber = 'GD-'+ orderIdGD.generate(new Date());
  })

  order.addHook('beforeFind', (options) => {
    options.where = options.where || {};
    if (options.where.deletedAt === undefined) {
      options.where.deletedAt = null;
    }
  });
  return order;
};