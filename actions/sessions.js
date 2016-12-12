const config = require('config');
const redisClient = require('redis-connection')();
const uuid = require('uuid/v4');

module.exports = {
    create: (usr) => {
        // create new session
        const redisExp = config.get('redis_expire');
        const sessionId = uuid();
        const user = {
            uid: usr._id,
            role: usr.role || 'guest' // (admin, user, guest)
        };

        return new Promise((resolve) => {
            // create the session in Redis
            redisClient.set(sessionId, JSON.stringify(user));
            redisClient.expire(sessionId, redisExp);

            return resolve(sessionId);
        });
    }
};
