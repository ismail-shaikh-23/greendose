module.exports = (sequelize, DataTypes) => { 
  const category = sequelize.define('category', { 
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true, 
      field: 'id',
    }, 
    name: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      field: 'name',
    }, 
  }, { 
    freezeTableName: true, 
    paranoid: true, 
    tableName: 'category',
    underscored: true, 
  }); 

  category.associate = (model) => { 
    category.hasMany(model.subCategory, {
      foreignKey: 'categoryId',
      as: 'subCategory',
    });
    category.hasMany(model.categoryImage, {
      foreignKey: 'categoryId',
      as: 'images',
    });
  }; 

  category.addHook('beforeFind', (options) => {
    options.where = options.where || {};
    if (options.where.deletedAt === undefined) {
      options.where.deletedAt = null;
    }
  });
  
  return category; 
};