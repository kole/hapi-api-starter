const accountActions = require('../actions/accounts');
const userActions = require('../actions/users');
const uuid = require('uuid/v4');

module.exports = {
    signup: (request, reply) => {
        const payload = request.payload;

        // create user ID and account ID now to limit DB queries on signup
        // and use uuid/v4 as a more unique ID that isn't reverse engineerable
        payload.userId = uuid();
        payload.accounts = [uuid()];

        // create a user
        userActions.create(payload, (user) => {
            // if there is no user id, there was an error
            // eslint-disable-next-line no-underscore-dangle
            if (!user._id) { return reply(user); }

            // create an account for the user
            return accountActions.create(user, () => {
                return reply(user);
            });
        });
    }
};
