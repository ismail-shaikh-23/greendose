module.exports = (sequelize, DataTypes) => { 
  const customerOtp = sequelize.define('customerOtp', 
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
        allowNull: false, 
      }, 
      otp: { 
        type: DataTypes.STRING, 
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
      tableName: 'customer_otp', 
      underscored: true,
    }, 
  ); 
  customerOtp.associate = (model) => { 
    customerOtp.belongsTo(model.customer, { 
      foreignKey: 'customerId', 
    }); 
  }; 
  
  return customerOtp; 
}; 
