import productsService from './products-service';
import core from '../core';

const controller = {};
const logger = core.logger;

controller.byId = (event, context, res) => {
  if (event.source === 'serverless-plugin-warmup') {
    logger.info('Warm up call');
    return res(null, 'Lambda warm up!');
  }
  const id = event.pathParameters.id;

  productsService
    .byId(id)
    .then((product) => {
      res(null, {
        statusCode: 200,
        body: JSON.stringify(product),
      });
    })
    .catch(() => {
      res(new Error('Error getting product. Please try again'));
    });
};

module.exports = controller;
