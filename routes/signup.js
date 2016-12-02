const Validation = require('../validation/signup');
const Handler = require('../handlers/signup');

module.exports = [
    {
        method: 'POST',
        path: '/signup',
        config: {
            validate: Validation.signup,
            handler: Handler.signup
        }
    }
];
