const Handler = require('../handlers/session');
const Validation = require('../validation/users');

module.exports = [
    {
        method: 'POST',
        path: '/session',
        config: {
            auth: false,
            handler: Handler.new,
            validate: Validation.login
        }
    },
    {
        method: 'DELETE',
        path: '/session',
        config: {
            handler: Handler.destroy
        }
    }
];
