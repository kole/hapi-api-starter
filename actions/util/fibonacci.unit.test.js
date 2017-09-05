/* eslint-env jest */

import fib from './fibonacci.js';

describe('Fibonacci sequence', () => {
    test('should return the correct value, given an index as an argument', () => {
        expect(fib(10)).toEqual(89);
    });
    test('should protect against too much recursion', () => {
        // passing an index too high should revert the index back to a reasonable number (currently 30, resulting in a fibonacci value of 1346269)
        expect(fib(1000)).toEqual(1346269);
    });
});
