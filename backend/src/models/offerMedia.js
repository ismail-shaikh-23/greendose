module.exports = (sequelize, DataTypes) => { 
  const offerMedia = sequelize.define('offerMedia', { 
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true, 
      field: 'id',
    }, 
    offerId: { 
      type: DataTypes.INTEGER,  
      field: 'offer_id',
    }, 
    fileId: { 
      type: DataTypes.INTEGER,
      field: 'file_id',
    }, 
    type: {
      type: DataTypes.ENUM('banner', 'thumbnail'),
      field: 'type',
    }, 
    displayOrder: {
      type: DataTypes.INTEGER,
      field: 'display_order',
    },
  }, { 
    freezeTableName: true, 
    paranoid: true, 
    tableName: 'offer_media',
    underscored: true, 
  }); 
  offerMedia.associate = (model) => {
    offerMedia.belongsTo(model.fileUpload, {
      foreignKey: 'fileId',
      as: 'offerMediaDetails',
    });
    offerMedia.belongsTo(model.offer, {
      foreignKey: 'offerId',
      as: 'offer',
    });
  };
  return offerMedia; 
};