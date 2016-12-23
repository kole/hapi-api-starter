import Boom from 'boom';
import inviteActions from '../actions/invite';
import sessionActions from '../actions/sessions';

export default {
    new: (request, reply) => {
        const payload = request.payload;
        const sessId = request.headers.authorization;
        const inviteFunctions = [
            sessionActions.getSelfId(sessId),
            sessionActions.getLoggedInAccount(sessId)
        ];

        Promise.all(inviteFunctions).then((results) => {
            payload.invitedBy = results[0];
            payload.invitedTo = results[1];

            return inviteActions.create(payload, (invitation) => {
                return reply(invitation);
            });
        }).catch(err => reply(Boom.badRequest(err)));
    }
};
