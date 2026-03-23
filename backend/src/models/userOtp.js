module.exports = (sequelize, DataTypes) => { 
  const userOtp = sequelize.define('userOtp', 
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
      otp: { 
        type: DataTypes.INTEGER, 
        field: 'otp', 
        allowNull: false, 
      }, 
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'verified', 'expired'),
        field: 'status',
        default: 'pending',
      },
    }, 
    { 
      freezeTableName: true, 
      timestamps: true, 
      tableName: 'user_otp', 
      underscored: true,
    }, 
  ); 
  userOtp.associate = (model) => { 
    userOtp.belongsTo(model.user, { 
      foreignKey: 'userId', 
    }); 
  }; 
  
  return userOtp; 
}; 
