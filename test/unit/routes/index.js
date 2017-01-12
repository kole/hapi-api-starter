const Code = require('code');
const Lab = require('lab');

const expect = Code.expect;
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;

const routesCompiler = require('../../../routes/index.js').default;

describe('The route array compiler should return an array of routes given an array of filenames', () => {
    it('should return an array of valid route objects', (done) => {
        expect(routesCompiler).to.be.an.array();
        expect(routesCompiler.length).to.be.above(0);

        for (let i = 0, len = routesCompiler.length; i < len; i++) {
            const route = routesCompiler[i];
            expect(route).to.be.an.object();
            expect(route.path).to.exist();
            expect(route.method).to.exist();
            expect(route.config).to.exist();
            expect(route.config.tags).to.exist();
        }
        done();
    });
});
