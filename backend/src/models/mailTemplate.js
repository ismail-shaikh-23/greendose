module.exports = (sequelize, DataTypes) => {
  const mailTemplate = sequelize.define('mailTemplate', {
    event: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subjectLine: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
  },
  {
    freezeTableName: true,
    tableName: 'mail_template',
    paranoid: true,
    timestamps: true,
    underscored: true,
  });

  return mailTemplate; 
}; 