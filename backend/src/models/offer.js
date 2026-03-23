/* eslint-disable max-lines-per-function */
module.exports = (sequelize, DataTypes) => {
  const offer = sequelize.define('offer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'name',
    },
    type: {
      type: DataTypes.ENUM('product', 'cart'),
      allowNull: false,
      field: 'type',
    },
    discountType: {
      type: DataTypes.ENUM('percentage', 'flat'),
      allowNull: false,
      field: 'discount_type',
    },
    discountValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'discount_value',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'end_date',
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'created_by',
    },
    approvedBy: {
      type: DataTypes.INTEGER,
      field: 'approved_by',
    },
    approvalStatus: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      field: 'approval_status',
      defaultValue: 'pending'
    },
    rejectReason: {
      type: DataTypes.TEXT,
      field: 'reject_reason',
    },
    rejectedBy: {
      type: DataTypes.INTEGER,
      field: 'rejected_by',
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'inactive'),
      defaultValue: 'inactive',
      field: 'status',
    },
    minQuantity: {
      type: DataTypes.INTEGER,
      field: 'min_quantity',
      default: 1
    },
    isVendor: {
      type: DataTypes.BOOLEAN,
      field: 'is_vendor',
    },
    vendorId: {
      type: DataTypes.INTEGER,
      field: 'vendor_id',
    },
  }, {
    freezeTableName: true,
    paranoid: true,
    tableName: 'offer',
    underscored: true,
  });

  offer.associate = ((model) => {
    offer.hasMany(model.offerSlab, { 
      foreignKey: 'offerId', 
      as: 'offerSlabs', 
    });
    offer.belongsTo(model.user, {
      foreignKey: 'createdBy',
      as: 'creator',
    });
    offer.belongsTo(model.user, {
      foreignKey: 'approvedBy',
      as: 'approver',
    });
    offer.belongsTo(model.user, {
      foreignKey: 'rejectedBy',
      as: 'rejecter',
    });
    offer.hasMany(model.offerProduct, {
      foreignKey: 'offerId',
      as: 'offerProducts',
    });
    offer.hasMany(model.campaignOffer, {
      foreignKey: 'offerId',
      as: 'campaignProducts',
    });
    offer.belongsTo(model.vendor, {
      foreignKey: 'vendorId',
      as: 'offerVendor',
    });
    offer.hasOne(model.offerMedia, {
      foreignKey: 'offerId',
      as: 'offerMedia',
    });
  });
  return offer;
};