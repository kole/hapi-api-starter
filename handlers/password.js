import Actions from '../actions/password';

export default {
    initiate: (request, reply) => {
        Actions.initiate(request, (err, result) => {
            if (err) { return reply(err); }
            return reply(result);
        });
    }
};
