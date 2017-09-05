/* eslint-env jest */

import comparePasswords from './comparePasswords.js';
import hashPassword from './hashPassword.js';

const databasePassword = 'myP@ssw0rd{/';
const correctPassword = databasePassword;
const wrongPassword = 'foo';

describe('Comparing hashed passwords should work', () => {
    test('same passwords should match', () => {
        hashPassword(databasePassword).then((result) => {
            expect(comparePasswords(correctPassword, result)).resolves.toEqual(true);
        });
    });
    test('different passwords should be rejected', () => {
        hashPassword(databasePassword).then((result) => {
            expect(comparePasswords(wrongPassword, result)).rejects.toBeDefined();
        });
    });
});
