const Validation = require('../validation/users');
const Handler = require('../handlers/users');

module.exports = [
    {
        method: 'POST',
        path: '/user',
        config: {
            validate: {
                payload: Validation.createUser
            },
            handler: Handler.createUser
        }
    }
];
