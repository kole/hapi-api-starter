import Boom from 'boom';
import config from 'config';
import moment from 'moment';
import redisClientModule from 'redis-connection';
import uuid from 'uuid/v4';

const redisClient = redisClientModule();

const createSession = (usr, cb) => {
    const redisExp = config.get('redis_expire');
    const sessionId = uuid();

    // get default login account
    const acct = usr.accounts.filter(account => account.default)[0];
    const user = {
        aid: acct.aid,
        uid: usr._id,
        role: acct.role
    };

    // create the session in Redis
    redisClient.set(sessionId, JSON.stringify(user));
    redisClient.expire(sessionId, redisExp);

    return cb(sessionId);
};

export default {
    destroy: (sessionId, cb) => {
        redisClient.del(sessionId);
        return cb({ status: 'success' });
    },
    getSelfId: (sessId) => {
        return new Promise((resolve, reject) => {
            return redisClient.get(sessId, (err, user) => {
                if (err) { return reject(Boom.badRequest(err)); }
                if (!user) {
                    return reject(Boom.notFound('User ID not found in session'));
                }
                const usr = JSON.parse(user);
                const userId = usr.uid;
                return resolve(userId);
            });
        });
    },
    validate: (usr) => {
        const redisExp = config.get('redis_expire');
        return new Promise((resolve, reject) => {
            if (!usr.sid) {
                // no old session, create a new one
                return createSession(usr, (result) => {
                    return resolve(result);
                });
            }

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
