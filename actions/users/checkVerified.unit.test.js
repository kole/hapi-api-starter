/* eslint-env jest */

import checkVerified from './checkVerified.js';

describe('The user verified promise should resolve or reject based on the user object containing a truthy verified key', () => {
    test('should successfully resolve if verified is true', () => {
        expect(checkVerified({ verified: true })).resolves.toEqual();
    });
    test('should be rejected if verified is false', () => {
        expect(checkVerified({ verified: false })).rejects.toBeDefined();
    });
    test('should be rejected if verified is undefined', () => {
        expect(checkVerified({})).rejects.toBeDefined();
    });
});
