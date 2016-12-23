import Handler from '../handlers/invite';
import Response from '../responses/invite';
import Validation from '../validation/invite';

export default [
    {
        method: 'POST',
        path: '/invite',
        config: {
            handler: Handler.new,
            response: { schema: Response.newInvite },
            validate: Validation.invite
        }
    }
];
