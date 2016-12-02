const Validation = require('../validation/users');
const Handler = require('../handlers/users');

module.exports = [
    {
        method: 'GET',
        path: '/user/{id}',
        config: {
            validate: Validation.getUser,
            handler: Handler.getUser
        }
    }
];
