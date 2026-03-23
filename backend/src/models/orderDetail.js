/* eslint-disable max-lines-per-function */
module.exports = (sequelize, DataTypes) => {
  const orderDetail = sequelize.define('orderDetail',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      vendorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      productPrice: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
      },
      productQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productDiscount: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
        defaultValue: 0,
      },
      productExpiryDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      deliveryStatus: {
        type: DataTypes.ENUM('placed', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'),
        defaultValue: 'placed',
      },
      invoiceNumber: {  // this is updated after is payment done.
        type: DataTypes.STRING(255),
        defaultValue: null,
      }
    },
    {
      freezeTableName: true,
      timestamps: true,
      paranoid: true,
      tableName: 'order_detail',
      underscored: true,
    },
  );
  orderDetail.associate = (model) => {
    orderDetail.belongsTo(model.order, {
      foreignKey: 'orderId',
      as: 'order'
    });
    orderDetail.belongsTo(model.product, {
      foreignKey: 'productId',
      as: 'product'
    });
    orderDetail.belongsTo(model.vendor, {
      foreignKey: 'vendorId',
      as: 'vendor'
    });
    orderDetail.hasMany(model.orderDeliveryHistory, {
      foreignKey: 'orderDetailsId',
      as: 'deliveryHistory'
    });
  };

  // orderDetail.addHook('beforeSave', async (orderDetail) => {
  //   if (orderDetail.productPrice && orderDetail.productQuantity) {
  //     const price = parseFloat(orderDetail.productPrice);
  //     const quantity = parseInt(orderDetail.productQuantity);
  //     const discount = parseFloat(orderDetail.productDiscount || 0);
  //     orderDetail.totalPrice = (price * quantity) - discount;
  //   }
  // });

  return orderDetail;
};