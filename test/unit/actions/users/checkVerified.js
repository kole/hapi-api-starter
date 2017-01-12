const Code = require('code');
const Lab = require('lab');

const expect = Code.expect;
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;

const checkVerified = require('../../../../actions/users/checkVerified.js').default;

describe('The user verified promise should resolve or reject based on the user object containing a truthy verified key', () => {
    it('promise should successfully resolve if verified is true', (done) => {
        checkVerified({ verified: true }).then(() => {
            // if we got to this point, it worked
            expect(true).to.be.true();
            done();
        }).catch((error) => {
            // this should not happen, so throw an error
            expect(true).to.be.false();
            done(error);
        });
    });
    it('promise should reject if verified is false', (done) => {
        checkVerified({ verified: false }).then(() => {
            // this should not happen, fail the test
            expect(false).to.be.true();
            done();
        }).catch(() => {
            // the promise should be rejected, so this is a passing test if this hits
            expect(true).to.be.true();
            done();
        });
    });
    it('promise should reject if verified is undefined', (done) => {
        checkVerified({}).then(() => {
            // this should not happen, fail the test
            expect(false).to.be.true();
            done();
        }).catch(() => {
            // the promise should be rejected, so this is a passing test if this hits
            expect(true).to.be.true();
            done();
        });
    });
});
