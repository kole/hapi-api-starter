// instatiate global var dependencies
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// run local dev configuration if env is development
if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line global-require
    const env = require('dotenv');
    env.config();
}

const Hapi = require('hapi');
const HapiMongoModels = require('hapi-mongo-models');
const hapiAuthJWT = require('hapi-auth-jwt2');
const redisClient = require('redis-connection')();
const validateSession = require('./utils/session_validator');

const Routes = require('./routes');

redisClient.set('redis', 'working');
redisClient.get('redis', (rediserror, reply) => {
    if (rediserror) {
        console.log(rediserror);
    }
    console.log(`redis is ${reply.toString()}`);
});

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
            Users: './actions/users'
        }
    }
};

const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 9090
});

server.register([MongoModels, hapiAuthJWT], (err) => {
    if (err) { throw new Error(err); }

    server.auth.strategy('jwt', 'jwt', true, {
        key: process.env.JWT_SECRET,
        validateFunc: validateSession
    });

    // load array of routes
    server.route(Routes);

    // start the server
    server.start((e) => {
        if (e) { throw new Error(e); }

        console.log(`Super hapi to be on port ${server.info.port} in ${process.env.NODE_ENV} mode on Node.js version ${process.versions.node}`);
    });
});
