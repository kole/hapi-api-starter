/* eslint-env jest */
import routesCompiler from './index.js';

describe('The route array compiler should return an array of routes given an array of filenames', () => {
    it('should return an array of valid route objects', (done) => {
        expect(routesCompiler.length).toBeGreaterThan(0);

        // loop through routes to make sure they all contain the basic components
        for (let i = 0, len = routesCompiler.length; i < len; i++) {
            const route = routesCompiler[i];
            expect(route).toEqual(expect.objectContaining({
                path: expect.any(String),
                method: expect.any(String),
                config: expect.any(Object)
            }));
        }
        done();
    });
});
