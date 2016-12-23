import Handler from '../handlers/users';
import Response from '../responses/users';
import Validation from '../validation/users';

export default [
    {
        method: 'GET',
        path: '/users/{id}',
        config: {
            auth: {
                scope: ['admin', 'user']
            },
            handler: Handler.getUserById,
            response: { schema: Response.getUserById },
            validate: Validation.getUserById
        }
    },
    {
        method: 'GET',
        path: '/users/self',
        config: {
            auth: {
                scope: ['admin', 'user', 'guest']
            },
            handler: Handler.getSelf,
            response: { schema: Response.getUserById },
            validate: Validation.getUserById
        }
    },
    {
        method: 'GET',
        path: '/users',
        config: {
            auth: {
                scope: 'admin'
            },
            handler: Handler.getUsersForAccount
        }
    }
];
