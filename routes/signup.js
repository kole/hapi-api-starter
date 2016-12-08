const Validation = require('../validation/signup');
const Handler = require('../handlers/signup');

module.exports = [
    {
        method: 'POST',
        path: '/signup',
        config: {
            auth: 'global',
            handler: Handler.signup,
            validate: Validation.signup
        }
    }
];
