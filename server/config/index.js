'use strict';

const path = require('path');

const getDbConfig = function(nodeEnv) {
  return nodeEnv === 'test' ? process.env.DATABASE_TEST_URL : process.env.DATABASE_URL;
};

const config = {
  root: path.normalize(__dirname + '/../processes/web'),
  env: process.env.NODE_ENV,

  ip: process.env.IP || undefined,
  port: process.env.PORT || 3000,

  proxy: process.env.PROXY === 'true',
  noSslEnforce: process.env.NO_SSL_ENFORCE === 'true',

  escher: {
    keyPool: process.env.ESCHER_KEY_POOL,
    credentialScope: process.env.ESCHER_CREDENTIAL_SCOPE
  },

  flippers: {
  },

  bigQuery: {
    projectId: process.env.GCLOUD_PROJECT_ID,
    credentials: {
      private_key: process.env.GCLOUD_PRIVATE_KEY,
      client_email: process.env.GCLOUD_CLIENT_EMAIL
    }
  },

  databaseUrl: getDbConfig(process.env.NODE_ENV)
};

module.exports = config;
