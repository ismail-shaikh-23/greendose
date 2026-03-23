/* eslint-disable max-lines-per-function */
module.exports = (sequelize, DataTypes) => {
  const campaign = sequelize.define('campaign', {
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
      type: DataTypes.ENUM('dashboard', 'profile', 'category'),
      allowNull: false,
      field: 'type',
    },
    imageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'image_id',
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      field: 'status',
      defaultValue: 'pending'
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
    approvedBy: {
      type: DataTypes.INTEGER,
      field: 'approved_by',
      defaultValue: null
    },
    rejectReason: {
      type: DataTypes.INTEGER,
      field: 'reject_reason',
      defaultValue: null
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'created_by',
    },
    isVendor: {
      type: DataTypes.BOOLEAN,
      field: 'is_vendor',
      default: false
    },
    vendorId: {
      type: DataTypes.INTEGER,
      field: 'vendor_id',
      default: null
    },
  }, 
  {
    freezeTableName: true,
    paranoid: true,
    tableName: 'campaign',
    underscored: true,
  });

  campaign.associate = ((model) => {
    campaign.hasMany(model.campaignOffer, {
      foreignKey: 'campaignId',
      as: 'campaignOffers',
    });
    campaign.belongsTo(model.fileUpload, {
      foreignKey: 'imageId',
      as: 'imageDetails',
    });
  });

  return campaign;
};