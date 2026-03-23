module.exports = (sequelize, DataTypes) => { 
  const userToken = sequelize.define('userToken', 
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
      token: { 
        type: DataTypes.TEXT, 
        field: 'token', 
        allowNull: false, 
      }, 
    }, 
    { 
      freezeTableName: true, 
      timestamps: true, 
      tableName: 'user_token', 
      underscored: true,
      paranoid: true,
    }, 
  ); 
  userToken.associate = (model) => { 
    userToken.belongsTo(model.user, { 
      foreignKey: 'userId', 
    }); 
  }; 
  userToken.addHook('beforeFind', (options) => {
    options.where = options.where || {};
    if (options.where.deletedAt === undefined) {
      options.where.deletedAt = null;
    }
  });
  
  return userToken; 
}; 
