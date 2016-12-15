import userActions from '../actions/users';

export default {
    getSelf: (request, reply) => {
        const sessId = request.headers.authorization;
        userActions.getSelf(sessId).then((user) => {
            return reply(user);
        }).catch((err) => { return reply(err); });
    },
    getUserById: (request, reply) => {
        const userId = request.params.id;
        userActions.getUserById(userId).then((user) => {
            return reply(user);
        }).catch((err) => { return reply(err); });
    },
    getUsersForAccount: (request, reply) => {
        reply('get all users on account');
    }
};
