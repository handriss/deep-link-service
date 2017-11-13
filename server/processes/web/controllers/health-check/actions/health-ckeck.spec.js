'use strict';

let request = require('supertest');
let createApp = require('../../../index');

describe('Health check', function() {
  it('should respond with success', function* () {
    let response = yield request(createApp().listen())
      .get('/healthcheck')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).to.eql({ success: true });
  });
});
