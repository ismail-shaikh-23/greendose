module.exports = (sequelize, DataTypes) => { 
  const campaignOffer = sequelize.define('campaignOffer', { 
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true, 
      field: 'id',
    }, 
    campaignId: { 
      type: DataTypes.INTEGER,  
      field: 'campaign_id',
    }, 
    offerId: { 
      type: DataTypes.INTEGER,
      field: 'offer_id',
    }, 
    status: { 
      type: DataTypes.ENUM('active', 'inactive'),
      field: 'status',
    }, 
  }, { 
    freezeTableName: true, 
    paranoid: true, 
    tableName: 'campaign_offer',
    underscored: true, 
  }); 

  campaignOffer.associate = (model) => {
    campaignOffer.belongsTo(model.campaign, {
      foreignKey: 'campaignId',
      as: 'campaign',
    });
    campaignOffer.belongsTo(model.offer, {
      foreignKey: 'offerId',
      as: 'offer',
    });
  };

  return campaignOffer; 
};