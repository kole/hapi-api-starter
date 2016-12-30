import uuid from 'uuid/v4';
import accountActions from '../actions/accounts';
import emailActions from '../actions/email';
import userActions from '../actions/users';

export default {
    signup: (request, reply) => {
        const payload = request.payload;

        // create user ID and account ID now to limit DB queries on signup
        // and use uuid/v4 as a more unique ID that isn't reverse engineerable
        payload.userId = uuid();
        payload.accounts = [{
            aid: uuid(),
            role: 'admin',
            default: true
        }];

        // create a user
        userActions.create(payload, (user) => {
            // if there is no user id, there was an error
            // eslint-disable-next-line no-underscore-dangle
            if (!user._id) { return reply(user); }

            // create an account for the user
            return accountActions.create(user, () => {
                emailActions.sendWelcome(user);
                return reply(user);
            });
        });
    }
};
