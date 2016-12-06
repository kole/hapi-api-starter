const accountActions = require('../actions/accounts');
const userActions = require('../actions/users');

module.exports = {
    signup: (request, reply) => {
        const payload = request.payload;

        // create a user
        userActions.create(payload, (user) => {
            // create an account for the user
            accountActions.create(user, (account) => {
                // eslint-disable-next-line no-underscore-dangle
                userActions.addAccountId(user, account._id, (updatedUser) => {
                    reply(updatedUser);
                });
            });
        });
    }
};
