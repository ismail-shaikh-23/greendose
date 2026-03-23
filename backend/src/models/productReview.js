module.exports = (sequelize, DataTypes) => { 
  const productReview = sequelize.define('productReview', 
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
      rating: {
        type: DataTypes.INTEGER, 
        validate: {
          min: 1,
          max: 5
        },
        allowNull: false, 
      }, 
      feedback: {
        type: DataTypes.TEXT, 
        allowNull: true, 
      }, 
    }, 
    { 
      freezeTableName: true, 
      tableName: 'product_review',
      timestamps: true, 
      underscored: true,
      paranoid: true
    }, 
  ); 
  productReview.associate = (model) => {
    productReview.belongsTo(model.product, {
      foreignKey: 'productId',
      as: 'product'
    });
    productReview.belongsTo(model.customer, {
      foreignKey: 'customerId',
      as: 'customer'
    });
  };
  return productReview; 
}; 