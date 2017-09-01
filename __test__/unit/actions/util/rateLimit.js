/* eslint-env jest */
// limit these tests because they are SLOW

import rateLimit from '../../../../actions/util/rateLimit.js';

describe('Rate Limit delay function', () => {
    it('should delay a response based on the count it gets passed', () => {
        return expect(rateLimit({ count: 1 })).to.be.fulfilled;
    });
    it('should successfully auto-assign a default value if no count is passed', () => {
        return expect(rateLimit({})).to.be.fulfilled;
    });
});
