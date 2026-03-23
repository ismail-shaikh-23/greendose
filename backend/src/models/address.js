/* eslint-disable max-lines-per-function */
 
module.exports = (sequelize, DataTypes) => {
  const address = sequelize.define('address',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
      },
      customerId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'customer',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      name:{
        type: DataTypes.STRING,
      },
      mobileNumber: {
        type: DataTypes.STRING,
        field: 'mobile_number',
      },
      latitude: {
        type: DataTypes.STRING,
        field: 'location',
      },
      longitude: {
        type: DataTypes.STRING,
        field: 'longitude',
      },
      mainAddress1: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'main_address_1',
      },
      mainAddress2: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'main_address_2',
      },
      landmark: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'landmark',
      },

    },
    {
      freezeTableName: true,
      timestamps: true,
      paranoid: true,
      tableName: 'address',
      underscored: true,
    },
  );
  address.associate = (model) => {
    address.belongsTo(model.customer, {
      foreignKey: 'customerId',
    });
  };

  address.addHook('beforeFind', (options) => {
    options.where = options.where || {};
    if (options.where.deletedAt === undefined) {
      options.where.deletedAt = null;
    }
  });
  return address;
};
