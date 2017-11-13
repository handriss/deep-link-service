'use strict';

const controllerFactory = require('boar-server').lib.controllerFactory;
const healthCheckAction = require('./actions/health-check');

module.exports = controllerFactory.create(function(router) {
  router.get('/healthcheck', healthCheckAction);
});
