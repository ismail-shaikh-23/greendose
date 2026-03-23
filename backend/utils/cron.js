/* eslint-disable no-console */
const cron = require('node-cron');
const { Op } = require('sequelize');
const db = require('../src/models');
const commonFunctions = require('./commonFunctions');
const { offer } = require('./constant');

exports.startOfferCleanup = () => {
  cron.schedule('0 * * * *', async() => {
    console.log('Running cron job for updating offer status to expired');

    try {
      const expiredOffers = await db.offer.findAll({
        where: {
          endDate: { [Op.lte]: new Date() },
          status: {
            [Op.ne]: offer.INAPP_STATUS.EXPIRED,
          },
        },
        attributes: ['id'],
        raw: true,
      });

      if (!expiredOffers.length) {
        console.log('No offers to expire.');
        return;
      }
      const expiredOfferIds = expiredOffers.map(o => o.id);
      await commonFunctions.update(
        'offer',
        { id: { [Op.in]: expiredOfferIds } },
        { status: offer.INAPP_STATUS.EXPIRED },
      );

      await commonFunctions.update(
        'offerProduct',
        { offerId: { [Op.in]: expiredOfferIds } },
        { status: offer.INAPP_STATUS.INACTIVE },
      );

      console.log(`Updated ${expiredOfferIds.length} offers
         to EXPIRED and related products to INACTIVE.`);
    } catch (error) {
      console.error('Error updating offer status to expired:', error);
    }
  });
};
