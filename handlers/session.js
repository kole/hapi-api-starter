import userActions from '../actions/users';
import sessionActions from '../actions/sessions';

export default {
    new: (request, reply) => {
        const email = request.payload.email;
        const password = request.payload.password;

        userActions.login(email, password, (userObj) => {
            return reply(userObj);
        });
    },
    destroy: (request, reply) => {
        const sessionId = request.headers.authorization;
        sessionActions.destroy(sessionId, (result) => {
            return reply(result);
        });
    }
};
