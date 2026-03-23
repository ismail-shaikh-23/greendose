// models/offerSlab.js
module.exports = (sequelize, DataTypes) => {
  const offerSlab = sequelize.define('offerSlab', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
    },
    offerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    minPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    maxPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    minDiscount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    maxDiscount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'ACTIVE',
    },
    description: {
      type: DataTypes.STRING,
      field: 'description',
    },
  }, {
    tableName: 'offer_slab',
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

  offerSlab.associate = (model) => {
    offerSlab.belongsTo(model.offer, {
      foreignKey: 'offerId',
      as: 'offer',
    });
  };

  return offerSlab;
};
