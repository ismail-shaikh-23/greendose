const { Sequelize } = require('sequelize');
const db = require('../../src/models');
const { sequelize } = require('../../src/models');

exports.incrementCategoryPreference = async(customerId, categoryName) => {
  await db.customer.update(
    {
      categoryPreferences: sequelize.fn(
        'jsonb_set',
        Sequelize.col('categoryPreferences'),
        `{${categoryName}}`,
        sequelize.literal(`(COALESCE(
            "categoryPreferences"->>'${categoryName}', 
            '0')::int + 1)::text::jsonb`,
        ),
      ),
    },
    {
      where: { id: customerId },
    },
  );
};