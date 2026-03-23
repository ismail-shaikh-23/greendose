module.exports = (sequelize, DataTypes) => { 
  const offerProduct = sequelize.define('offerProduct', { 
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true, 
      field: 'id',
    }, 
    offerId: { 
      type: DataTypes.INTEGER,  
      allowNull: false,
      field: 'offer_id',
    }, 
    productId: { 
      type: DataTypes.INTEGER,
      allowNull: false, 
      field: 'product_id',
    }, 
    status: { 
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
      field: 'status',
    }, 
    priority: {
      type: DataTypes.INTEGER,
      field: 'priority',
    },
  }, { 
    freezeTableName: true, 
    paranoid: true, 
    tableName: 'offer_product',
    underscored: true, 
  }); 

  offerProduct.associate = (model) => {
    offerProduct.belongsTo(model.product, {
      foreignKey: 'productId',
      as: 'product',
    });
    offerProduct.belongsTo(model.offer, {
      foreignKey: 'offerId',
      as: 'offer',
    });
  };

  return offerProduct; 
};