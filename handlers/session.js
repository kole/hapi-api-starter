const config = require('config');
const JWT = require('jsonwebtoken');
const moment = require('moment');
const redisClient = require('redis-connection')();
const userActions = require('../actions/users');
const uuid = require('uuid/v4');

const jwtSecret = process.env.JWT_SECRET;

module.exports = {
    new: (request, reply) => {
        const email = request.payload.email;
        const password = request.payload.password;

        userActions.login(email, password, (userObj) => {
            const usr = userObj;
            const session = {
                valid: true,
                id: uuid(),
                exp: moment(moment()).add('minutes', config.get('session_length_in_minutes')).unix()
            };
            // create the session in Redis
            redisClient.set(session.id, JSON.stringify(session));

            // sign the session as a JWT
            const token = JWT.sign(session, jwtSecret);
            usr.sessionToken = token;

            reply(usr);
        });
    },
    destroy: (request, reply) => {
        // implement your own login/auth function here
        const decoded = JWT.decode(request.headers.authorization, jwtSecret);
        let session = {};
        redisClient.get(decoded.id, (rediserror, redisreply) => {
            session = JSON.parse(redisreply);
            session.valid = false;
            session.ended = moment(moment()).unix();
            redisClient.set(session.id, JSON.stringify(session));

            reply({ session: 'destroyed' });
        });
    }
};
