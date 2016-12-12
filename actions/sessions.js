const Boom = require('boom');
const config = require('config');
const moment = require('moment');
const redisClient = require('redis-connection')();
const uuid = require('uuid/v4');

const createSession = (usr, cb) => {
    const redisExp = config.get('redis_expire');
    const sessionId = uuid();
    const user = {
        uid: usr._id,
        role: usr.role || 'guest' // (admin, user, guest)
    };

    // create the session in Redis
    redisClient.set(sessionId, JSON.stringify(user));
    redisClient.expire(sessionId, redisExp);

    return cb(sessionId);
};

module.exports = {
    destroy: (sessionId, cb) => {
        redisClient.del(sessionId);
        return cb({ status: 'success' });
    },
    validate: (usr) => {
        const redisExp = config.get('redis_expire');
        return new Promise((resolve, reject) => {
            return redisClient.get(usr.sid, (err, oldSid) => {
                if (err) { return reject(Boom.badRequest(err)); }

                if (!oldSid) {
                    // no old session, create a new one
                    return createSession(usr, (result) => {
                        return resolve(result);
                    });
                }

                // there is an old session
                const now = moment(moment()).unix();
                const lastSeen = usr.last_seen_date || now;
                const expDate = lastSeen + config.get('session_length_in_seconds');
                const expired = now > expDate;

                // the session is expired, create a new one
                if (expired) {
                    return createSession(usr, (result) => {
                        return resolve(result);
                    });
                }

                // update exp date on existing session
                redisClient.expire(usr.sid, redisExp);
                return resolve(usr.sid);
            });
        });
    }
};
