// eslint-disable-next-line max-lines-per-function
module.exports = (sequelize, DataTypes) => { 
  const product = sequelize.define('product', { 
    id: { 
      type: DataTypes.INTEGER, 
      field: 'id',
      primaryKey: true, 
      autoIncrement: true, 
    }, 
    brand: {
      type: DataTypes.STRING, 
      field: 'brand',
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      field: 'tags',
    },
    name: { 
      type: DataTypes.STRING, 
      field: 'name',
      allowNull: false, 
    }, 
    description: { 
      type: DataTypes.TEXT, 
      field: 'description',
      allowNull: false
    }, 
    price: {
      type: DataTypes.NUMERIC(12, 2),
      field: 'price',
      allowNull: false,
    },
    expiryDate: { 
      type: DataTypes.DATE, 
      field: 'expiry_date',
      allowNull: false, 
    }, 
    subCategoryId: {
      type: DataTypes.INTEGER, 
      field: 'sub_category_id',
      allowNull: false,
    },
    isPrescriptionRequired: {
      type: DataTypes.BOOLEAN, 
      field: 'is_prescription_required',
      allowNull: false,
    },
    vendorId: {
      type: DataTypes.INTEGER, 
      field: 'vendor_id',
    },
    quantity: {
      type: DataTypes.INTEGER, 
      field: 'quantity',
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, { 
    freezeTableName: true, 
    paranoid: true, 
    tableName: 'product', 
    underscored: true, 
  }); 

  product.associate = (model) => { 
    product.hasMany(model.offerProduct, {
      foreignKey: 'productId',
      as: 'offerProducts',
    });
    product.belongsTo(model.vendor, {
      foreignKey: 'vendorId',
      as: 'vendor',
    });
    product.belongsTo(model.subCategory, {
      foreignKey: 'subCategoryId',
      as: 'subCategory',
    });
    product.hasMany(model.productImage, {
      foreignKey: 'productId',
      as: 'images',
    });
    product.hasMany(model.orderDetail, {
      foreignKey: 'productId',
      as: 'productOrder',
    });
    product.hasMany(model.offerProduct, {
      foreignKey: 'productId',
      as: 'productDiscount',
    });
    product.hasMany(model.productReview, {
      foreignKey: 'productId',
      as: 'productReviews',
    }),
    product.hasOne(model.wishList, {
      foreignKey: 'productId',
      as: 'wishList'
    })
  }; 

  product.addHook('beforeFind', (options) => {
    options.where = options.where || {};
    if (options.where.deletedAt === undefined) {
      options.where.deletedAt = null;
    }
  });
  return product; 
};
