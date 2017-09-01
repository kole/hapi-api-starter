/* eslint-env jest */
import routesCompiler from '../../../routes/index.js';

describe('The route array compiler should return an array of routes given an array of filenames', () => {
    it('should return an array of valid route objects', (done) => {
        expect(routesCompiler).to.be.instanceOf(Array);
        expect(routesCompiler.length).to.be.above(0);

        // loop through routes to make sure they all contain the basic components
        for (let i = 0, len = routesCompiler.length; i < len; i++) {
            const route = routesCompiler[i];
            expect(route).to.be.instanceOf(Object);
            expect(route).to.have.all.keys('path', 'method', 'config');
            expect(route).to.have.deep.property('config.tags');
        }
        done();
    });
});
