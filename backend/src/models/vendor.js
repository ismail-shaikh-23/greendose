/* eslint-disable max-lines-per-function */
module.exports = (sequelize, DataTypes) => {
  const vendor = sequelize.define(
    'vendor',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.ENUM('cosmetic store', 'pharmacy', 'other'),
        field: 'type',
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING,
        field: 'user_name',
      },
      email: {
        type: DataTypes.STRING,
        field: 'email',
      },
      mobileNumber: {
        type: DataTypes.STRING,
        field: 'mobile_number',
      },
      organizationName: {
        type: DataTypes.STRING,
        field: 'organization_name',
        allowNull: false,
      },
      licenseId: {
        type: DataTypes.INTEGER,
        field: 'license_id',
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('approved', 'pending', 'rejected'),
        field: 'status',
        defaultValue: 'pending',
      },
      addressName: {
        type: DataTypes.STRING,
        field: 'address_name',
        allowNull: false,
      },
      addressStreet: {
        type: DataTypes.STRING,
        field: 'address_street',
        allowNull: false,
      },
      addressZipcode: {
        type: DataTypes.STRING,
        field: 'address_zipcode',
        allowNull: false,
      },
      addressState: {
        type: DataTypes.STRING,
        field: 'address_state',
        allowNull: false,
      },
      addressCity: {
        type: DataTypes.STRING,
        field: 'address_city',
        allowNull: false,
      },
      addressCountry: {
        type: DataTypes.STRING,
        field: 'address_country',
        allowNull: false,
      },
      rejectionReason: {
        type: DataTypes.STRING,
        field: 'rejection_reason',
        defaultValue: null,
      },
      approvedDate: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      underscored: true,
    },
  );

  vendor.associate = (model) => {
    vendor.hasMany(model.product, {
      foreignKey: 'vendorId',
      as: 'products',
    });
    vendor.hasMany(model.user, {
      foreignKey: 'vendorId',
      as: 'users',
    });
  };

  vendor.addHook('beforeFind', (options) => {
    options.where = options.where || {};
    if (options.where.deletedAt === undefined) {
      options.where.deletedAt = null;
    }
  });
  
  return vendor;
};
