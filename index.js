import Config from 'config';
import Hapi from 'hapi';
import Inert from 'inert';
import HapiMongoModels from 'hapi-mongo-models';
import HapiSwagger from 'hapi-swagger';
import Redis from 'hapi-redis-connection';
import Vision from 'vision';
import globalAuth from './auth/global';
import userAuth from './auth/users';
import globalRateLimiting from './globalRateLimiting';

import Routes from './routes';

// instantiate global var dependencies
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

server.register([userAuth, MongoModels, Vision, Inert, HapiSwagger, Redis], (err) => {
    if (err) { throw new Error(err); }

    server.auth.strategy('user', 'user', true);

    // load array of routes
    server.route(Routes);

    // process on all requests to confirm API access (different than user authentication)
    server.ext('onPreAuth', globalAuth);

    // run all basic-auth'd requests through rate limiting deterence logic
    // this should stay after onPreAuth because basic auth requirements are the first level of defense
    server.ext('onPostAuth', globalRateLimiting);

    // start the server
    server.start((e) => {
        if (e) { process.exit(1); }
        console.log(`Super hapi to be on port ${server.info.port} in ${process.env.NODE_ENV} mode on Node.js version ${process.versions.node}`);
    });
});

module.exports = server;
