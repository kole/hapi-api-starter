import Handler from '../handlers/signup';
import Validation from '../validation/signup';

export default [
    {
        method: 'POST',
        path: '/signup',
        config: {
            auth: false,
            handler: Handler.signup,
            validate: Validation.signup
        }
    }
];
