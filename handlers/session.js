const redisClient = require('redis-connection')();
const userActions = require('../actions/users');

module.exports = {
    new: (request, reply) => {
        const email = request.payload.email;
        const password = request.payload.password;

        userActions.login(email, password, (userObj) => {
            return reply(userObj);
        });
    },
    destroy: (request, reply) => {
        const sessionId = request.headers.authorization;
        redisClient.del(sessionId);
        reply({ status: 'success' });
    }
};
