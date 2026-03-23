module.exports = (sequelize, DataTypes) => { 
  const productImage = sequelize.define('productImage', 
    { 
      id: { 
        type: DataTypes.INTEGER, 
        field: 'id', 
        primaryKey: true, 
        autoIncrement: true, 
      }, 
      fileId: {
        type: DataTypes.INTEGER, 
        field: 'file_id',
        allowNull: false, 
      }, 
      productId: {
        type: DataTypes.INTEGER, 
        field: 'product_id',
        allowNull: false, 
      }, 
    }, 
    { 
      freezeTableName: true, 
      tableName: 'product_image',
      timestamps: true, 
      underscored: true,
      paranoid: true
    }, 
  ); 
  productImage.associate = (model) => {
    productImage.belongsTo(model.product, {
      foreignKey: 'productId',
    });
    productImage.belongsTo(model.fileUpload, {
      foreignKey: 'fileId',
      as: 'imageDetails',
    });
  };
  return productImage; 
}; 
