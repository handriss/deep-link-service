'use strict';

const fs = require('fs');
const path = require('path');

const environmentVariables = {
  DEBUG: 'app,suite-sdk,suiterequest',
  PORT: 9100,
  BASE_URL: 'http://localhost:9100',
  NODE_ENV: 'development',
  NO_SSL_ENFORCE: 'true'
};

module.exports = {
  server: {
    filePattern: ['!server/**/*.factory.*', '!server/**/*.spec.*', 'server/**/*.{jade,js,css,json}', '.npmrc', 'package.json', 'trace.config.js', 'Procfile'],
    environmentVariables: environmentVariables,
    runnable: 'dist/processes/web/index.js',
    test: {
      environmentVariables: {
        NODE_ENV: 'test',
        NO_SSL_ENFORCE: 'true',
        SUITE_API_KEY_POOL: JSON.stringify([{'keyId':'medata_push_v1','secret':'5x7Zn2TY2ZNCwFHbM4qIcW6Bn7ILAgbU','acceptOnly':0}])
      }
    }
  }
};
