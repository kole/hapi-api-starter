const Validation = require('../validation/users');
const Handler = require('../handlers/users');

module.exports = [
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
