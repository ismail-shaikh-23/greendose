module.exports = (sequelize, DataTypes) => { 
  const rolePermission = sequelize.define('rolePermission', 
    { 
      id: { 
        type: DataTypes.INTEGER, 
        field: 'id', 
        primaryKey: true, 
        autoIncrement: true, 
      }, 
      roleId: { 
        type: DataTypes.INTEGER, 
        field: 'role_id', 
        allowNull: false, 
      }, 
      permissionId: { 
        type: DataTypes.INTEGER, 
        field: 'permission_id', 
        allowNull: false, 
      }, 
    }, 
    { 
      freezeTableName: true, 
      tableName: 'role_permission', 
      paranoid: true, 
      timestamps: true, 
      underscored: true,
    }, 
  ); 
  rolePermission.associate = (models) => {
    rolePermission.belongsTo(models.permission, {
      foreignKey: 'permissionId',
      as: 'permission',
    });

    rolePermission.belongsTo(models.role, {
      foreignKey: 'roleId',
      as: 'role',
    });
  };

  rolePermission.addHook('beforeFind', (options) => {
    options.where = options.where || {};
    if (options.where.deletedAt === undefined) {
      options.where.deletedAt = null;
    }
  });

  return rolePermission; 
}; 
