/* eslint-env jest */

import bcrypt from 'bcrypt';
import hashPassword from './hashPassword.js';

const str = 'myP@ssw0rd{/';

describe('A plain text password should be encrypted with brcrypt', () => {
    test('should return a resolved promise', () => {
        expect(hashPassword(str)).resolves.toBeDefined();
    });
    test('should not match the string that was passed in', () => {
        return bcrypt.hash(str, 10).then(() => {
            expect(hashPassword(str)).resolves.not.toEqual(str);
        });
    });
    test('should be a length of 60 characters', () => {
        // this isn't fool-proof, but if it isn't 60, something is wrong
        return bcrypt.hash(str, 10).then((hash) => {
            expect(hash.length).toEqual(60);
        });
    });
});
