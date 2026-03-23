// models/emailLog.js
module.exports = (sequelize, DataTypes) => {
  const emailLog = sequelize.define('emailLog', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'id',
    },
    to: {
      type: DataTypes.STRING,
      field: 'to',
    },
    subject: {
      type: DataTypes.STRING,
      field: 'subject',
    },
    errorMessage: {
      type: DataTypes.TEXT,
      field: 'error_message',
    },
    stackTrace: {
      type: DataTypes.TEXT,
      field: 'stack_trace',
    },
    time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'time',
    },
    referenceId: {
      type: DataTypes.INTEGER,
      field: 'reference_id',
    },
  }, {
    tableName: 'email_logs',
    freezeTableName: true, 
    timestamps: true, 
    underscored: true,
  });

  return emailLog;
};
