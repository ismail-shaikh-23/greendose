module.exports = (sequelize, DataTypes) => { 
  const customerToken = sequelize.define('customerToken', 
    { 
      id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        field: 'id',
      }, 
      customerId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        field: 'customer_id',
      }, 
      token: { 
        type: DataTypes.TEXT, 
        allowNull: false, 
        field: 'token',
      }, 
    }, 
    { 
      freezeTableName: true, 
      timestamps: true, 
      tableName: 'customer_token', 
      underscored: true,
      paranoid: true,
    }, 
  ); 

  customerToken.associate = (model) => { 
    customerToken.belongsTo(model.customer, { 
      foreignKey: 'customerId', 
    }); 
  }; 

  customerToken.addHook('beforeFind', (options) => {
    options.where = options.where || {};
    if (options.where.deletedAt === undefined) {
      options.where.deletedAt = null;
    }
  });
  
  return customerToken; 
};
