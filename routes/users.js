import Handler from '../handlers/users';
import Validation from '../validation/users';

export default [
    {
        method: 'GET',
        path: '/user/{id}',
        config: {
            auth: {
                scope: ['admin', 'user']
            },
            handler: Handler.getUser,
            validate: Validation.getUser
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
