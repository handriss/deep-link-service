'use strict';

const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiSubset = require('chai-subset');
const chaiString = require('chai-string');
const EscherAuth = require('escher-auth');
let Logger = require('logentries-logformat').Logger;

require('sinon-as-promised');

chai.use(chaiSubset);
chai.use(sinonChai);
chai.use(chaiString);
global.expect = chai.expect;

beforeEach(function *() {
  this.sinon = sinon;

  this.sandbox = sinon.sandbox.create();
  this.sandbox.stub(EscherAuth.prototype, 'authenticate');
  this.sandbox.stub(Logger.prototype, 'log');
  this.sandbox.stub(Logger.prototype, 'success');
  this.sandbox.stub(Logger.prototype, 'error');
});

afterEach(function *() {
  this.sandbox.restore();

});

