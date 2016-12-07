const userActions = require('../actions/users');
const JWT = require('jsonwebtoken');
const moment = require('moment');
const redisClient = require('redis-connection')();
const uuid = require('uuid/v4');

module.exports = {
    new: (request, reply) => {
        const email = request.payload.email;
        const password = request.payload.password;

        userActions.login(email, password, (userObj) => {
            const usr = userObj;
            const session = {
                valid: true,
                id: uuid(),
                exp: moment(moment()).add('minutes', 30).unix()
            };
            // create the session in Redis
            redisClient.set(session.id, JSON.stringify(session));

            // sign the session as a JWT
            const token = JWT.sign(session, process.env.JWT_SECRET);
            usr.sessionToken = token;

            reply(usr);
        });
    }
};
