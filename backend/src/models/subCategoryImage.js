module.exports = (sequelize, DataTypes) => { 
  const subCategoryImage = sequelize.define('subCategoryImage', 
    { 
      id: { 
        type: DataTypes.INTEGER, 
        field: 'id', 
        primaryKey: true, 
        autoIncrement: true, 
      }, 
      subCategoryId: {
        type: DataTypes.INTEGER, 
        field: 'sub_category_id',
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
      tableName: 'sub_category_image',
      timestamps: true, 
      underscored: true,
    }, 
  ); 
  subCategoryImage.associate = (model) => {
    subCategoryImage.belongsTo(model.subCategory, {
      foreignKey: 'subCategoryId',
    });
    subCategoryImage.belongsTo(model.fileUpload, {
      foreignKey: 'imageId',
      as: 'imageDetails',
    });
  };
  return subCategoryImage; 
}; 
