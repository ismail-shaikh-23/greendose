/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        field: 'first_name',
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        field: 'last_name',
        allowNull: true,
      },
      userName: {
        type: DataTypes.STRING,
        field: 'user_name',
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        field: 'email',
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        field: 'password',
        allowNull: false,
      },
      mobileNumber: {
        type: DataTypes.STRING,
        field: 'mobile_number',
      },
      roleId: {
        type: DataTypes.INTEGER,
        field: 'role_id',
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        field: 'is_active',
        defaultValue: true,
      },
      vendorId: {
        type: DataTypes.INTEGER,
        field: 'vendor_id',
      },
    },
    { // added pertial unique indexing for unique mobile, email and user name for the active users
      indexes: [
        {
          name: 'unique_mobile_number_on_active_users',
          unique: true,
          fields: ['mobile_number'],
          where: {
            deleted_at: null, 
          },
        },
        {
          name: 'unique_email_on_active_users',
          unique: true,
          fields: ['email'],
          where: {
            deleted_at: null, 
          },
        },
        {
          name: 'unique_user_name_on_active_users',
          unique: true,
          fields: ['user_name'],
          where: {
            deleted_at: null, 
          },
        },
      ],
      freezeTableName: true,
      timestamps: true,
      paranoid: true,
      tableName: 'user',
      underscored: true,
    },
  ); 

  user.associate = (model) => {
    user.hasOne(model.userToken, {
      foreignKey: 'userId',
    });
    user.hasMany(model.vendor, {
      foreignKey: 'vendorId',
      as: 'vendors'
    });
    user.hasOne(model.offer, {
      foreignKey: 'approvedBy',
    });
    user.hasOne(model.offer, {
      foreignKey: 'createdBy',
    });
    user.hasOne(model.offer, {
      foreignKey: 'rejectedBy',
    });
  };

  user.beforeCreate(async(user) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
    }
  });

  user.beforeUpdate(async(user) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
    }
  });
  user.prototype.comparePassword = function(passw) {
    return bcrypt.compare(passw, this.password);
  };

  // hook for fetching the active records
  user.addHook('beforeFind', (options) => {
    options.where = options.where || {};
    if (options.where.deletedAt === undefined) {
      options.where.deletedAt = null;
    }
  });

  return user;
};
