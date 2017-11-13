'use strict';

const path = require('path');

const config = {
  root: path.normalize(__dirname + '/../processes/web'),
  env: process.env.NODE_ENV,

  port: process.env.PORT || 3000,

  noSslEnforce: process.env.NO_SSL_ENFORCE === 'true'

};

module.exports = config;
