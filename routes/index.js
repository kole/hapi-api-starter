// concat all routes and export them as a single array

const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f !== 'index.js' && path.extname(f) === '.js');
const routesArr = [];

files.map((file) => {
    // eslint-disable-next-line
    const routes = require(`./${file}`).default;
    return routes.map((oneRoute) => {
        const rte = oneRoute;

        // tag each route for swagger docs
        if (rte.config.tags && typeof rte.config.tags === 'object') {
            rte.config.tags.push('api');
        } else {
            rte.config.tags = ['api'];
        }

        return routesArr.push(rte);
    });
});

export default routesArr;
