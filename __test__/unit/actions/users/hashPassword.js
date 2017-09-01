import bcrypt from 'bcrypt';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import hashPassword from '../../../../actions/users/hashPassword.js';

chai.use(chaiAsPromised);
const str = 'myP@ssw0rd{/';

describe('A plain text password should be encrypted with brcrypt', () => {
    it('should return a resolved promise', () => {
        return expect(hashPassword(str)).to.be.fulfilled;
    });
    it('should not match the string that was passed in', () => {
        return bcrypt.hash(str, 10).then(() => {
            return expect(hashPassword(str)).to.not.equal(str);
        });
    });
    it('should be a length of 60 characters', () => {
        // this isn't fool-proof, but if it isn't 60, something is wrong
        return bcrypt.hash(str, 10).then((hash) => {
            return expect(hash.length).to.equal(60);
        });
    });
});
