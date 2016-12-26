import Handler from '../handlers/invite';
import Response from '../responses/invite';
import Validation from '../validation/invite';

export default [
    {
        method: 'POST',
        path: '/invite',
        config: {
            auth: {
                scope: 'admin' // you must be an admin to invite someone to the logged-in account
            },
            handler: Handler.new,
            response: { schema: Response.newInvite },
            validate: Validation.invite
        }
    }
];
