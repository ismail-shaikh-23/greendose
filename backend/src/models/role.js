module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define('role', {
    id: {
      type: DataTypes.INTEGER,
      field: 'id',
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      field: 'name',
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      field: 'description',
    },
  },
  {
    freezeTableName: true,
    tableName: 'role',
    paranoid: true,
    timestamps: true,
    underscored: true,
  });

  role.associate = (model) => { 
    role.belongsToMany(model.permission, { 
      foreignKey: 'roleId', 
      through: 'rolePermission', 
    }); 
  }; 

  // hook for fetching the active records
  role.addHook('beforeFind', (options) => {
    options.where = options.where || {};
    if (options.where.deletedAt === undefined) {
      options.where.deletedAt = null;
    }
  });

  return role; 
}; 
