module.exports = (sequelize, DataTypes) => { 
  const categoryImage = sequelize.define('categoryImage', 
    { 
      id: { 
        type: DataTypes.INTEGER, 
        field: 'id', 
        primaryKey: true, 
        autoIncrement: true, 
      }, 
      categoryId: {
        type: DataTypes.INTEGER, 
        field: 'category_id',
        allowNull: false, 
      }, 
      imageId: {
        type: DataTypes.INTEGER, 
        field: 'image_id',
        allowNull: false, 
      }, 
    }, 
    { 
      freezeTableName: true, 
      tableName: 'category_image',
      timestamps: true, 
      underscored: true,
    }, 
  ); 
  categoryImage.associate = (model) => {
    categoryImage.belongsTo(model.category, {
      foreignKey: 'categoryId',
    });
    categoryImage.belongsTo(model.fileUpload, {
      foreignKey: 'imageId',
      as: 'imageDetails',
    });
  };
  return categoryImage; 
}; 
