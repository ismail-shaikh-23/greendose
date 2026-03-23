module.exports = (sequelize, DataTypes) => { 
  const appSetting = sequelize.define('appSetting', { 
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true, 
      field: 'id',
    }, 
    key: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      field: 'key',
    }, 
    value: { 
      type: DataTypes.TEXT,
      allowNull: false, 
      field: 'value',
    }, 
    isActive: {
      type: DataTypes.BOOLEAN,
      // allowNull: false,
      field: 'is_active',
      default: true,
    },
  }, { 
    freezeTableName: true, 
    paranoid: true, 
    tableName: 'app_setting',
    underscored: true, 
  }); 

  return appSetting; 
};