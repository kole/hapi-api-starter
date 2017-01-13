import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import comparePasswords from '../../../../actions/users/comparePasswords.js';
import hashPassword from '../../../../actions/users/hashPassword.js';

chai.use(chaiAsPromised);
const databasePassword = 'myP@ssw0rd{/';
const correctPassword = databasePassword;
const wrongPassword = 'foo';

describe('Comparing hashed passwords should work', () => {
    it('should return a resolved promise', () => {
        hashPassword(databasePassword).then((result) => {
            return expect(comparePasswords(correctPassword, result)).to.be.fulfilled;
        });
    });
    it('same passwords should match', () => {
        hashPassword(databasePassword).then((result) => {
            return expect(comparePasswords(correctPassword, result)).to.eventually.equal(true);
        });
    });
    it('different passwords should be rejected', () => {
        hashPassword(databasePassword).then((result) => {
            return expect(comparePasswords(wrongPassword, result)).to.be.rejected;
        });
    });
});
