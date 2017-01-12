// $lab:coverage:off$
import Config from 'config';
import Hapi from 'hapi';
import Inert from 'inert';
import HapiMongoModels from 'hapi-mongo-models';
import HapiSwagger from 'hapi-swagger';
import Vision from 'vision';
import globalAuth from './auth/global';
import userAuth from './auth/users';

import Routes from './routes';

// instatiate global var dependencies
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// run local dev configuration if env is development
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    // eslint-disable-next-line global-require
    const env = require('dotenv');
    env.config();
}

if (process.env.NODE_ENV === 'test') {
    process.env.API_AUTH = Config.get('API_AUTH');
}

// Configure hapi-mongo-models
const MongoModels = {
    register: HapiMongoModels,
    options: {
        mongodb: {
            uri: process.env.MONGODB_URI
        },
        autoIndex: true,
        models: {
            Accounts: './actions/accounts',
            Invitations: './actions/invite',
            Passwords: './actions/password',
            Users: './actions/users'
        }
    }
};

const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: process.env.PORT || 9090
});

server.register([userAuth, MongoModels, Vision, Inert, HapiSwagger], (err) => {
    if (err) { throw new Error(err); }

    server.auth.strategy('user', 'user', true);

    // load array of routes
    server.route(Routes);

    // process all requests to confirm API access (different than user authentication)
    server.ext('onPreAuth', globalAuth);

    if (!module.parent.parent) {
        // start the server
        server.start((e) => {
            if (e) { throw new Error(e); }

            console.log(`Super hapi to be on port ${server.info.port} in ${process.env.NODE_ENV} mode on Node.js version ${process.versions.node}`);
        });
    } else {
        // used for kicking off tests
        server.emit('start');
    }
});

module.exports = server;
// $lab:coverage:on$
