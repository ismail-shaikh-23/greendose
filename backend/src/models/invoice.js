/* eslint-disable max-lines-per-function */
module.exports = (sequelize, DataTypes) => {
  const invoice = sequelize.define("invoice", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        orderDetailsId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        invoiceNumber: {
            type: DataTypes.STRING(100),
            defaultValue: 0,
        },
        customerId: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        vendorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        invoiceDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
      freezeTableName: true,
      timestamps: true,
      paranoid: true,
      tableName: "invoice",
      underscored: true,
    }
  );

  invoice.beforeCreate(async (invoice) => {
    invoice.invoiceDate = new Date();
  });

  invoice.afterCreate(async (invoice, options) => {
    const number = `INV-${String(invoice.id).padStart(6, '0')}`;
    await invoice.update({ invoiceNumber: number }, { transaction: options.transaction });
  })

  return invoice;
};
