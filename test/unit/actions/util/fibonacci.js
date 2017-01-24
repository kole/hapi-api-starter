import { expect } from 'chai';

import fib from '../../../../actions/util/fibonacci.js';

describe('Fibonacci sequence', () => {
    it('should return the correct value, given an index as an argument', () => {
        return expect(fib(10)).to.equal(89);
    });
    it('should protect against too much recursion', () => {
        // passing an index too high should revert the index back to a reasonable number (currently 30, resulting in a fibonacci value of 1346269)
        return expect(fib(1000)).to.equal(1346269);
    });
});
