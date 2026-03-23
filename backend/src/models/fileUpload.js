module.exports = (sequelize, DataTypes) => { 
  const fileUpload = sequelize.define('fileUpload', 
    { 
      id: { 
        type: DataTypes.INTEGER, 
        field: 'id', 
        primaryKey: true, 
        autoIncrement: true, 
      }, 
      userId: { 
        type: DataTypes.INTEGER, 
        field: 'user_id', 
        allowNull: false, 
      }, 
      path: { 
        type: DataTypes.STRING, 
        field: 'path', 
        allowNull: false, 
      }, 
      mimeType: { 
        type: DataTypes.STRING, 
        field: 'mimetype', 
        allowNull: false, 
      }, 
      extension: { 
        type: DataTypes.STRING, 
        field: 'extension', 
        allowNull: false, 
      }, 
    }, 
    { 
      freezeTableName: true, 
      tableName: 'file_upload', 
      paranoid: true, 
      timestamps: true, 
      underscored: true,
    }, 
  ); 

  fileUpload.associate = (model) => { 
    fileUpload.hasMany(model.productImage, {
      foreignKey: 'fileId',
    });
  }; 

  fileUpload.addHook('beforeFind', (options) => {
    options.where = options.where || {};
    if (options.where.deletedAt === undefined) {
      options.where.deletedAt = null;
    }
  });
  
  return fileUpload; 
};
