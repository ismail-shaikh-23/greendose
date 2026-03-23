/* eslint-disable max-lines-per-function */
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const customer = sequelize.define('customer',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'first_name',
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'last_name',
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'user_name',
      },
      mobileNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'mobile_number',
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
        field: 'email',
      },
      password: {
        type: DataTypes.STRING,
        // allowNull: false,
        field: 'password',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        field: 'is_active',
        default: true,
      },
      roleId: {
        type: DataTypes.INTEGER,
        field: 'role_id',
        allowNull: false,
      },
      categoryPreferences: {
        type: DataTypes.JSONB,
        field: 'category_preferences',
        default: {},
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      paranoid: true,
      tableName: 'customer',
      underscored: true,
    },
  );

  customer.associate = (model) => {
    customer.hasOne(model.customerToken, {
      foreignKey: 'customerId',
    });
    customer.hasMany(model.address, {
      foreignKey: 'customerId',
    });
  };

  customer.beforeCreate(async(customer) => {
    if (customer.password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(customer.password, salt);
      customer.password = hash;
    }
  });

  customer.beforeUpdate(async(customer) => {
    if (customer.password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(customer.password, salt);
      customer.password = hash;
    }
  });

  customer.prototype.comparePassword = function(passw) {
    return bcrypt.compare(passw, this.password);
  };

  customer.addHook('beforeFind', (options) => {
    options.where = options.where || {};
    if (options.where.deletedAt === undefined) {
      options.where.deletedAt = null;
    }
  });
  
  return customer;
};