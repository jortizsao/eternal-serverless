import core from '../core';
import { ValidationError } from '../errors';
import customersService from './customers-service';

const controller = {};
const utils = core.utils;
const logger = core.logger;

controller.hasAllRequiredFields = (customer) => {
  const requiredFields = [
    customer.firstName,
    customer.lastName,
    customer.email,
    customer.password,
    customer.confirmPassword,
  ];

  return requiredFields.every(field => !utils.isStringEmpty(field));
};

controller.passwordAndConfirmPasswordMatch = (customer) => {
  return customer.password === customer.confirmPassword;
};

controller.getCleanCustomer = (customer) => {
  return {
    firstName: customer.firstName && customer.firstName.trim(),
    lastName: customer.lastName && customer.lastName.trim(),
    email: customer.email && customer.email.trim(),
    password: customer.password && customer.password.trim(),
    confirmPassword: customer.confirmPassword && customer.confirmPassword.trim(),
  };
};

controller.getValidCustomerToRegister = (customer) => {
  const cleanCustomer = controller.getCleanCustomer(customer);

  if (controller.hasAllRequiredFields(cleanCustomer)) {
    if (controller.passwordAndConfirmPasswordMatch(cleanCustomer)) {
      return cleanCustomer;
    } else {
      throw new ValidationError("Passwords fields don't match");
    }
  } else {
    throw new ValidationError('Please fill all required fields');
  }
};

controller.signUp = (event, context, res) => {
  if (event.source === 'serverless-plugin-warmup') {
    logger.info('Warm up call');
    return res(null, 'Lambda warm up!');
  }
  try {
    const body = JSON.parse(event.body);
    const customer = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
      confirmPassword: body.confirmPassword,
    };
    const validCustomer = controller.getValidCustomerToRegister(customer);
    customersService.byEmail(validCustomer.email).then((existingCustomer) => {
      if (existingCustomer) {
        return res(null, {
          statusCode: 400,
          body: JSON.stringify({
            message: 'Email already registered',
          }),
        });
      } else {
        customersService
          .signUp(validCustomer)
          .then((customerCreated) => {
            return res(null, {
              statusCode: 200,
              body: JSON.stringify({
                ...customerCreated.customer,
                password: '',
              }),
            });
          })
          .catch(() => {
            return res(null, {
              statusCode: 500,
              body: JSON.stringify({
                message: 'Opps! Something went wrong',
              }),
            });
          });
      }
    });
  } catch (err) {
    return res(null, {
      statusCode: 400,
      body: JSON.stringify({
        message: err.message,
      }),
    });
  }
};

module.exports = controller;
