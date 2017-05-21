import core from '../core';

const service = {};
const logger = core.logger;
const ctClient = core.ctClient;
const config = core.config;
const customerSequence = config.get('SEQUENCES:CUSTOMERS');

function getCustomerNumber(sequence) {
  return ctClient.customObjects
    .where(`key="${sequence}"`)
    .fetch()
    .then(res => res.body.results)
    .then(results => (results.length > 0 ? results[0] : { value: 1 }))
    .then(lastValue => ({ value: lastValue.value + 1, version: lastValue.version }))
    .then((newValue) => {
      return ctClient.customObjects
        .save({
          container: sequence,
          key: sequence,
          value: newValue.value,
          version: newValue.version,
        })
        .then(res => res.body.value)
        .catch(() => getCustomerNumber(sequence));
    });
}

service.byEmail = (email) => {
  const emailLowerCase = email.toLowerCase();
  return ctClient.customers
    .where(`lowercaseEmail="${emailLowerCase}"`)
    .fetch()
    .then(res => res.body.results[0])
    .catch((err) => {
      const errMessage = `Error getting customer by email. ${email}, Error: ${JSON.stringify(err)}`;
      logger.error(errMessage);
      throw new Error(errMessage);
    });
};

service.signUp = (customer) => {
  return getCustomerNumber(customerSequence)
    .then((customerNumber) => {
      return {
        ...customer,
        customerNumber: customerNumber.toString(),
      };
    })
    .then((customerToSave) => {
      return ctClient.customers.save(customerToSave).then(res => res.body).catch((err) => {
        const errMessage = `Error creating customer ${customer.email}, Error: ${JSON.stringify(err)}`;
        logger.error(errMessage);
        throw new Error(errMessage);
      });
    });
};

export default service;
