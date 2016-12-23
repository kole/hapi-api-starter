// all clients are required to pass general ('basic') API access
// authentication in headers for each request

import Boom from 'boom';

export default function isAuthenticated(request, reply) {
    const auth = request.headers.basic;

    // docs route shouldn't require global auth
    if (request.path.indexOf('/documentation') >= 0 || request.path.indexOf('swagger') >= 0) {
        return reply.continue();
    }

    if (!auth || auth !== process.env.API_AUTH) {
        return reply(Boom.unauthorized('Access Denied'));
    }
    return reply.continue();
}
