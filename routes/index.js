// concat all routes and export them as a single array

const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f !== 'index.js' && path.extname(f) === '.js');
const routesArr = [];

files.map((file) => {
    // eslint-disable-next-line
    const routes = require(`./${file}`);
    return routes.map(oneRoute => routesArr.push(oneRoute));
});

module.exports = routesArr;
