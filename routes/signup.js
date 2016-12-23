import Handler from '../handlers/signup';
import Response from '../responses/signup';
import Validation from '../validation/signup';

export default [
    {
        method: 'POST',
        path: '/signup',
        config: {
            auth: false,
            handler: Handler.signup,
            response: { schema: Response.signup },
            validate: Validation.signup
        }
    }
];
