import path from 'path';
import loggerMod from './logger';
import configMod from './config';
import ctClientMod from './ct-client';
import utils from './utils';

// Config
function getConfigFiles() {
  return [
    path.join(__dirname, `../../../config/${process.env.NODE_ENV || 'development'}.json`),
    path.join(__dirname, '../../../config/defaults.json'),
  ];
}

const config = configMod(getConfigFiles());

// Logger
const logger = loggerMod(config.get('LOGGER:LEVEL'));

// CommerceTools client
const ctClient = ctClientMod({
  clientId: config.get('COMMERCE_TOOLS:CLIENT_ID'),
  clientSecret: config.get('COMMERCE_TOOLS:CLIENT_SECRET'),
  projectKey: config.get('COMMERCE_TOOLS:PROJECT_KEY'),
  host: config.get('COMMERCE_TOOLS:API_HOST'),
  oauthHost: config.get('COMMERCE_TOOLS:OAUTH_URL'),
});

export default {
  config,
  logger,
  ctClient,
  utils,
};
