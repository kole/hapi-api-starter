const config = require('config');
const redisClient = require('redis-connection')();
const userActions = require('../actions/users');
const uuid = require('uuid/v4');

module.exports = {
    new: (request, reply) => {
        const email = request.payload.email;
        const password = request.payload.password;

        userActions.login(email, password, (userObj) => {
            const usr = userObj;

            // make sure we are working with a user object...
            // errors and such will not have a '_id' key
            if (usr._id) {
                const sessionId = uuid();

                // create the session in Redis
                redisClient.set(sessionId, usr._id);
                redisClient.expire(sessionId, config.get('session_length_in_seconds'));

                // add session ID to user object
                usr.session = sessionId;
            }
            // send updated user object to client
            return reply(usr);
        });
    },
    destroy: (request, reply) => {
        const sessionId = request.headers.authorization;
        redisClient.del(sessionId);
        reply({ status: 'success' });
    }
};
