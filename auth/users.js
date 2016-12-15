// user authentication will allow users (regardless of client)
// authenticated access to protected routes

import Boom from 'boom';
import config from 'config';
import redisClientModule from 'redis-connection';

const redisClient = redisClientModule();

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

                const sess = JSON.parse(result);

                if (!sess) {
                    return reply(Boom.unauthorized('Please log in to access this resource'));
                }

                // refresh session exp
                redisClient.expire(authorization, config.get('redis_expire'));

                const credentials = {
                    Authorization: authorization,
                    scope: sess.role
                };

                return reply.continue({ credentials });
            });
        }
    };

    return scheme;
};
