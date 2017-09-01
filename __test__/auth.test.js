/* eslint-env jest */

import config from 'config';

const server = require('~/index.js');

describe('The API requires client-based basic authentication - apart from user authentication', () => {
    beforeAll((done) => {
        server.on('app-initialized', () => {
            console.log('======================================================================================');
            done();
        });
    });

    afterAll((done) => {
        server.on('stop', () => {
            console.log('STOP');
            done();
        });
        server.stop();
    });

    test('should reject access to an endpoint that does not require user authentication', (done) => {
        server.inject({
            method: 'POST',
            url: '/signup'
        }, (response) => {
            expect(response.statusCode).toEqual(401);
            done();
        });
    });
    test('should reject access to an endpoint that does require user authentication', (done) => {
        server.inject({
            method: 'GET',
            url: '/users/self'
        }, (response) => {
            expect(response.statusCode).toEqual(401);
            done();
        });
    });
    test('should allow access to an endpoint when the correct basic auth token is passed', (done) => {
        const basicAuth = config.get('API_AUTH');
        server.inject({
            method: 'POST',
            url: '/session',
            headers: {
                basic: basicAuth
            }
        }, (response) => {
            // expect access to the API to be granted, but payload valiation will fail
            // hence the 400 response (not a 401 or 200)
            expect(response.statusCode).toEqual(400);
            done();
        });
    });
});
