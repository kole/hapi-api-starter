import Boom from 'boom';
import config from 'config';
import moment from 'moment';
import uuid from 'uuid/v4';

const createSession = (request, usr, cb) => {
    const redisExp = config.get('redis_expire');
    const sessId = uuid();

    // get default login account
    const acct = usr.accounts.filter(account => account.default)[0];
    const user = {
        aid: acct.aid,
        uid: usr._id,
        role: acct.role
    };

    // create the session in Redis
    request.redis.set(`sess:${sessId}`, JSON.stringify(user));
    request.redis.expire(`sess:${sessId}`, redisExp);

    return cb(sessId);
};

export default {
    destroy: (request, sessionId, cb) => {
        request.redis.del(`sess:${sessionId}`);
        return cb({ status: 'success' });
    },
    getLoggedInAccount: (request, sessId) => {
        return new Promise((resolve, reject) => {
            return request.redis.get(`sess:${sessId}`, (err, sess) => {
                if (err) { return reject(Boom.badRequest(err)); }
                if (!sess) {
                    return reject(Boom.notFound('Session not found'));
                }
                const sesh = JSON.parse(sess);
                const aid = sesh.aid;
                return resolve(aid);
            });
        });
    },
    getSelfId: (request, sessId) => {
        return new Promise((resolve, reject) => {
            return request.redis.get(`sess:${sessId}`, (err, user) => {
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
    validate: (request, usr) => {
        const redisExp = config.get('redis_expire');
        return new Promise((resolve, reject) => {
            if (!usr.sid) {
                // no old session, create a new one
                return createSession(request, usr, (result) => {
                    return resolve(result);
                });
            }

            return request.redis.get(`sess:${usr.sid}`, (err, oldSid) => {
                if (err) { return reject(Boom.badRequest(err)); }

                if (!oldSid) {
                    // no old session, create a new one
                    return createSession(request, usr, (result) => {
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
                    return createSession(request, usr, (result) => {
                        return resolve(result);
                    });
                }

                // update exp date on existing session
                request.redis.expire(`sess:${usr.sid}`, redisExp);
                return resolve(usr.sid);
            });
        });
    }
};
