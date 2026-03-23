 
module.exports = (sequelize, DataTypes) => { 
  const subCategory = sequelize.define('subCategory',{ 
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true, 
    }, 
    name: { 
      type: DataTypes.STRING, 
      allowNull: false, 
    }, 
    categoryId: { 
      type: DataTypes.INTEGER, 
      field: 'category_id',
    },
  }, { 
    freezeTableName: true, 
    paranoid: true, 
    underscored: true, 
    tableName: 'sub_category', 
  }); 
  subCategory.associate = (model) => { 
    subCategory.belongsTo(model.category, {
      foreignKey: 'categoryId',
      as: 'category',
    });
    subCategory.hasMany(model.product, {
      foreignKey: 'subCategoryId',
      as: 'products',
    });
    subCategory.hasMany(model.subCategoryImage, {
      foreignKey: 'subCategoryId',
      as: 'images',
    });
  }; 

  subCategory.addHook('beforeFind', (options) => {
    options.where = options.where || {};
    if (options.where.deletedAt === undefined) {
      options.where.deletedAt = null;
    }
  });
  
  return subCategory; 
}; 
