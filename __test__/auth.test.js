/* eslint-env jest */

import config from 'config';
import ps from 'ps-node';

const server = require('~/index.js');

describe('The API requires client-based basic authentication - apart from user authentication', () => {
    beforeAll((done) => {
        server.on('start', () => {
            done();
        });
    });

    afterAll((done) => {
        server.on('stop', () => {
            // kill jest process(es)
            ps.lookup({
                command: 'node',
                arguments: 'jest'
            }, (err, resultList) => {
                resultList.forEach((p) => {
                    if (p) {
                        process.kill(p.pid);
                    }
                });
            });
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
