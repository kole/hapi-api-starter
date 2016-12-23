import Handler from '../handlers/session';
import Response from '../responses/session';
import Validation from '../validation/users';

export default [
    {
        method: 'POST',
        path: '/session',
        config: {
            auth: false,
            handler: Handler.new,
            response: { schema: Response.newSession },
            validate: Validation.login
        }
    },
    {
        method: 'DELETE',
        path: '/session',
        config: {
            handler: Handler.destroy,
            response: { schema: Response.destroySession }
        }
    }
];
