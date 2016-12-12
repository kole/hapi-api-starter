// user authentication will allow users (regardless of client)
// authenticated access to protected routes

const Boom = require('boom');
const config = require('config');
const redisClient = require('redis-connection')();

// Declare internals
const internals = {};


exports.register = (plugin, options, next) => {
    plugin.auth.scheme('user', internals.implementation);
    next();
};

exports.register.attributes = {
    name: 'User Authentication',
    version: '1.0.0'
};

internals.implementation = () => {
    const scheme = {
        authenticate: (request, reply) => {
            const req = request.raw.req;
            const authorization = req.headers.authorization;
            if (!authorization) {
                return reply(Boom.unauthorized('Please log in to access this resource'));
            }

            return redisClient.get(authorization, (rediserror, result) => {
                if (rediserror) {
                    return reply(Boom.badRequest(rediserror));
                }

                if (!result) {
                    return reply(Boom.unauthorized('Please log in to access this resource'));
                }

                // refresh session exp
                redisClient.expire(authorization, config.get('redis_expire'));

                return reply.continue({ credentials: authorization });
            });
        }
    };

    return scheme;
};
