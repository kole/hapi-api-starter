// all clients are required to pass general ('basic') API access
// authentication in headers for each request

const Boom = require('boom');

// Declare internals
const internals = {};

exports.register = (plugin, options, next) => {
    plugin.auth.scheme('global', internals.implementation);
    next();
};

exports.register.attributes = {
    name: 'Global API Authentication',
    version: '1.0.0'
};


internals.implementation = () => {
    const scheme = {
        authenticate: (request, reply) => {
            const req = request.raw.req;
            const authorization = req.headers.basic;
            if (!authorization || authorization !== process.env.API_AUTH) {
                return reply(Boom.unauthorized('Access denied'));
            }

            return reply.continue({ credentials: authorization });
        }
    };

    return scheme;
};
