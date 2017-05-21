import { SphereClient } from 'sphere-node-sdk';

export default (config) => {
  return new SphereClient({
    config: {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      project_key: config.projectKey,
    },
    host: config.host,
    oauth_host: config.oauthHost,
  });
};
