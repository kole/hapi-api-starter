const Handler = require('../handlers/session');
const Validation = require('../validation/users');

module.exports = [
    {
        method: 'POST',
        path: '/session/new',
        config: {
            auth: false,
            handler: Handler.new,
            validate: Validation.login
        }
    },
    {
        method: ['DELETE', 'GET', 'POST'],
        path: '/session/destroy',
        config: {
            handler: Handler.destroy
        }
    }
];
