// all clients are required to pass general ('basic') API access
// authentication in headers for each request

const Boom = require('boom');

const isAuthenticated = (request, reply) => {
    const auth = request.headers.basic;
    if (!auth || auth !== process.env.API_AUTH) {
        return reply(Boom.unauthorized('Access Denied'));
    }
    return reply.continue();
};

module.exports = isAuthenticated;
