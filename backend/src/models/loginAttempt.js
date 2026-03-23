module.exports = (sequelize, DataTypes) => { 
  const loginAttempt = sequelize.define('loginAttempt', 
    { 
      id: { 
        type: DataTypes.INTEGER, 
        field: 'id', 
        primaryKey: true, 
        autoIncrement: true, 
      }, 
      customerId: {
        type: DataTypes.INTEGER,
        field: 'customer_id',
        allowNull: true,
      },
      totalAttempts: { 
        type: DataTypes.STRING, 
        field: 'total_attempts', 
        allowNull: false, 
      }, 
      blockedUntil: {
        type: DataTypes.DATE,
        field: 'blocked_until',
        allowNull: true,
      },
      mobileNumber: {
        type: DataTypes.STRING,
        field: 'mobile_number',
      },
    }, 
    { 
      freezeTableName: true, 
      timestamps: true, 
      tableName: 'login_attempt', 
      underscored: true,
      paranoid: true,
    }, 
  ); 
  loginAttempt.associate = (model) => { 
    loginAttempt.belongsTo(model.customer, { 
      foreignKey: 'customerId', 
    }); 
  }; 

  loginAttempt.addHook('beforeFind', (options) => {
    options.where = options.where || {};
    if (options.where.deletedAt === undefined) {
      options.where.deletedAt = null;
    }
  });
  
  return loginAttempt; 
}; 
