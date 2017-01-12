const config = require('config');
const Code = require('code');
const Lab = require('lab');

const expect = Code.expect;
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
// const after = lab.after;

const server = require('../../index.js');

// make sure the server fully loads before running tests
lab.before((done) => {
    server.on('start', done);
});

describe('The API requires client-based basic authentication - apart from user authentication', () => {
    it('should reject access to an endpoint that does not require user authentication', (done) => {
        server.inject({
            method: 'POST',
            url: '/signup'
        }, (response) => {
            expect(response.statusCode).to.equal(401);
            done();
        });
    });
    it('should reject access to an endpoint that does require user authentication', (done) => {
        server.inject({
            method: 'GET',
            url: '/users/self'
        }, (response) => {
            expect(response.statusCode).to.equal(401);
            done();
        });
    });
    it('should allow access to an endpoint when the correct basic auth token is passed', (done) => {
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
            expect(response.statusCode).to.equal(400);
            done();
        });
    });
});
