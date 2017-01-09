import Actions from '../actions/password';

export default {
    initiate: (request, reply) => {
        const emailOrUsername = request.payload;
        Actions.initiate(emailOrUsername, (err, result) => {
            if (err) { return reply(err); }
            return reply(result);
        });
    }
};
