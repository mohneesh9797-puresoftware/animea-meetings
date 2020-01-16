const request = require('supertest');
const Meeting = require('../src/models/meeting');
const app = require('../server');
const nock = require('nock');
const authResponses = require('./authResponses');
const BASE_API_PATH = '/api/v1';

beforeEach(() => {
  nock(`https://animea-gateway.herokuapp.com`)
      .get('/auth/api/v1/auth/me')
      .reply(200, JSON.stringify(authResponses.verifyToken));
});

describe('Get all meetings', () => {
  it('Should return a list of 15 meetings', (done) => {
    request(app)
        .get(BASE_API_PATH + '/meetings')
        .expect((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.body.length).toEqual(15);
        })
        .expect(200, done);
  });
});