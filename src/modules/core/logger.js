import winston from 'winston';

export default (level) => {
  const transports = [new (winston.transports.Console)({
    level,
    json: false,
    timestamp: true,
    colorize: true,
  })];

  const exceptionHandlers = [new (winston.transports.Console)({
    level,
    json: false,
    timestamp: true,
    colorize: true,
    silent: false,
    prettyPrint: true,
  })];

  const logger = new (winston.Logger)({
    transports,
    exceptionHandlers,
    exitOnError: false,
  });

  return logger;
};
