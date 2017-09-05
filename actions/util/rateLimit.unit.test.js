/* eslint-env jest */
import rateLimit from './rateLimit.js';

describe('Rate Limit delay function', () => {
    test('should return a promise', () => {
        expect(rateLimit({ count: 1 })).resolves.toBeDefined();
    });
});
