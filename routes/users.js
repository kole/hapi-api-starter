import Handler from '../handlers/users';
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
