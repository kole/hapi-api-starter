const Code = require('code');
const Lab = require('lab');

const expect = Code.expect;
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
// const after = lab.after;

const server = require('../index.js');

// make sure the server fully loads before running tests
lab.before((done) => {
    server.on('start', done);
});

describe('The API requires client-based basic authentication - apart from user authentication', () => {
    it('should do something', (done) => {
        server.inject({
            method: 'POST',
            url: '/signup'
        }, (response) => {
            expect(response.statusCode).to.equal(401);
            done();
        });
    });
});
