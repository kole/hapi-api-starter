import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import checkVerified from '../../../../actions/users/checkVerified.js';

chai.use(chaiAsPromised);

describe('The user verified promise should resolve or reject based on the user object containing a truthy verified key', () => {
    it('should successfully resolve if verified is true', () => {
        return expect(checkVerified({ verified: true })).to.be.fulfilled;
    });
    it('should be rejected if verified is false', () => {
        return expect(checkVerified({ verified: false })).to.be.rejected;
    });
    it('should be rejected if verified is undefined', () => {
        return expect(checkVerified({})).to.be.rejected;
    });
});
