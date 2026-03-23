/* eslint-disable max-lines-per-function */
module.exports = (sequelize, DataTypes) => {
  const browsingHistory = sequelize.define('browsingHistory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, 
  {
    freezeTableName: true,
    paranoid: true,
    tableName: 'browsingHistory',
    underscored: true,
  });

  browsingHistory.associate = ((model) => {
    browsingHistory.belongsTo(model.product, {
      foreignKey: 'productId',
      as: 'product',
    });
    browsingHistory.belongsTo(model.customer, {
      foreignKey: 'customerId',
      as: 'customer',
    });
  });

  return browsingHistory;
};