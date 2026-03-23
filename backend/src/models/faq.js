module.exports = (sequelize, DataTypes) => {
  const faq = sequelize.define('faq', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true, 
      field: 'id',
    },
    question: {
      type: DataTypes.STRING,
      field: 'question',
    },
    answer: {
      type: DataTypes.TEXT,
      field: 'answer',
    },

  }, {
    freezeTableName: true, 
    timestamps: true, 
    tableName: 'faq', 
    underscored: true,
    paranoid: true,
  });

  return faq;
};