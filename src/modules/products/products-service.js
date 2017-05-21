import core from '../core';

const service = {};
const logger = core.logger;
const ctClient = core.ctClient;

service.isProductAvailable = (product) => {
  const variants = [product.masterVariant, ...product.variants];

  return variants.some((variant) => {
    return variant.availability && variant.availability.isOnStock;
  });
};

service.byId = (id) => {
  return ctClient.products.byId(id).fetch().then(res => res.body).catch((err) => {
    const errMessage = `Error getting product ${id}, Error: ${err}`;
    logger.error(errMessage);
    return Promise.reject(errMessage);
  });
};

export default service;
