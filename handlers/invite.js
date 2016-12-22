import Boom from 'boom';
import inviteActions from '../actions/invite';
import sessionActions from '../actions/sessions';

export default {
    new: (request, reply) => {
        const payload = request.payload;
        sessionActions.getSelfId(request.headers.authorization).then((userId) => {
            if (!userId) { return reply(Boom.badRequest('Please log in to invite someone')); }
            payload.invitedBy = userId;

            return inviteActions.create(payload, (invitation) => {
                return reply(invitation);
            });
        });
    }
};
