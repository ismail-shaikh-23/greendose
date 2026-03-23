module.exports = (sequelize, DataTypes) => {
  const errorLogger = sequelize.define('errorLogger', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true, 
      field: 'id',
    },
    message: {
      type: DataTypes.STRING,
      field: 'message',
    },
    stackTrace: {
      type: DataTypes.TEXT,
      field: 'stack_trace',
    },
    url: {
      type: DataTypes.STRING,
      field: 'url',
    },
    method: {
      type: DataTypes.STRING,
      field: 'method',
    },
    ipAddress: {
      type: DataTypes.STRING,
      field: 'ip_address',
    },
    userAgent: {
      type: DataTypes.STRING,
      field: 'user_agent',
    },
    actorId: {
      type: DataTypes.INTEGER,
      field: 'actor_id',
    },
    actorType: {
      type: DataTypes.ENUM('super-admin', 'admin', 'vendor-user', 'customer'),
      field: 'actor_type',
    },
  }, {
    freezeTableName: true, 
    timestamps: true, 
    tableName: 'error_logger', 
    underscored: true,
    paranoid: true,
  });

  return errorLogger;
};