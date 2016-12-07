const redisClient = require('redis-connection')();

const validateSession = (decoded, request, callback) => {
    redisClient.get(decoded.id, (rediserror, reply) => {
        if (rediserror) { throw new Error(rediserror); }

        let session = {};
        if (reply) {
            session = JSON.parse(reply);
        } else {
            return callback(rediserror, false);
        }

        if (session.valid === true) {
            return callback(rediserror, true);
        }
        return callback(rediserror, false);
    });
};

module.exports = validateSession;
