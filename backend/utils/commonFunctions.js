/* eslint-disable max-len */
const db = require('../src/models');

exports.create = async(model, body, isBulk = false, transaction = null) => {
  const options = transaction ? { transaction } : {};
  return isBulk
    ? await db[model].bulkCreate(body, options)
    : await db[model].create(body, options);
};


exports.findOne = async(model, options = {} ) => {
  const { condition, include, attributes, paranoid, raw = false, distinct = false } = options;

  const fetchedRecord = await db[model].findOne({
    where: condition,
    ...(include && { include: include }),
    ...(attributes && { attributes: attributes }),
    distinct,
    raw,
  });
  return fetchedRecord;
};

exports.update = async(model, condition, updatedBody, returning = false) => {
  const updateRecord = await db[model].update(
    updatedBody,
    {
      where: condition,
      returning,
    },
  );
  return updateRecord;
};

exports.destroy = async(model, condition, force = false) => {
  const deletedRecord = await db[model].destroy({
    where: condition,
    force,
  });
  return deletedRecord;
};

exports.findAll = async(model, options = {}) => {
  const { condition, attributes, include, group, order, limit, offset, transaction, raw = false, distinct = false, subQuery } = options;
  const fetchedRecord = await db[model].findAndCountAll({
    ...(condition && { where: condition }),
    ...(attributes && { attributes }),
    ...(include && { include }),
    ...(group && { group }),
    ...(order && { order }),
    ...(limit !== undefined && { limit }),
    ...(offset !== undefined && { offset }),
    ...(transaction && { transaction }),
    ...(!subQuery && subQuery === false ? { subQuery } : {} ),
    distinct,
    raw,
  });

  return fetchedRecord;
};

exports.findByPk = async(model, id, options= {} ) => {
  const { condition, include, attributes, subQuery } = options;

  const fetchedRecord = await db[model].findByPk(id, {
    ...(condition && { where: condition }),
    ...(include && { include: include }),
    ...(attributes && { attributes: attributes }),
    ...(!subQuery && subQuery === false ? { subQuery } : {} ),
  });
  return fetchedRecord;
};

exports.sum = async(model, field, options= {} ) => {
  const { condition } = options;

  const sum = await db[model].sum(field, {
    where: condition,
  });
  return sum ? sum : 0;
};

exports.count = async(model, options= {} ) => {
  const { condition } = options;

  const count = await db[model].count({
    where: condition,
  });
  return count ? count : 0;
};

exports.updateWithTransaction = async(model, condition, updatedBody, transaction, returning = false) => {
  const updateRecord = await db[model].update(
    updatedBody,
    {
      where: condition,
      returning,
      transaction
    },
  );
  return updateRecord;
};