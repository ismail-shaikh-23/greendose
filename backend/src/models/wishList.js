module.exports = (sequelize, DataTypes) => { 
  const wishList = sequelize.define('wishList', 
    { 
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
      tableName: 'wish_list', 
      paranoid: true, 
      timestamps: true, 
      underscored: true,
    }, 
  ); 
  wishList.associate = (models) => {
    wishList.belongsTo(models.customer, {
      foreignKey: 'customerId',
      as: 'customer',
    });

    wishList.belongsTo(models.product, {
      foreignKey: 'productId',
      as: 'product',
    });
  };

  wishList.addHook('beforeFind', (options) => {
    options.where = options.where || {};
    if (options.where.deletedAt === undefined) {
      options.where.deletedAt = null;
    }
  });

  return wishList; 
}; 