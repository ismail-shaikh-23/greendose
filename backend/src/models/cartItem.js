/* eslint-disable max-lines-per-function */
module.exports = (sequelize, DataTypes) => {
  const cartItem = sequelize.define('cartItem',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'cart',
          key: 'id'
        }
      },
      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      paranoid: true,
      tableName: 'cart_item',
      underscored: true,
    },
  );

  cartItem.associate = (model) => {
    cartItem.belongsTo(model.product, {
      foreignKey: 'productId',
      as: 'product'
    });
    cartItem.belongsTo(model.cart, {
      foreignKey: 'cartId',
      as: 'cart'
    });
  };

  cartItem.addHook('beforeSave', async (cartItem) => {
    if (cartItem.unitPrice && cartItem.quantity) {
      cartItem.totalPrice = (cartItem.unitPrice * cartItem.quantity) - (cartItem.discount || 0);
    }
  });

  cartItem.addHook('beforeFind', (options) => {
    options.where = options.where || {};
    if (options.where.deletedAt === undefined) {
      options.where.deletedAt = null;
    }
  });
  
  return cartItem;
};