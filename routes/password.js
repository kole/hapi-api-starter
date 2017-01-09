import Handler from '../handlers/password';
import Response from '../responses/password';
import Validation from '../validation/password';

export default [
    {
        method: 'POST',
        path: '/password',
        config: {
            auth: false,
            handler: Handler.initiate,
            response: { schema: Response.initiate },
            validate: Validation.initiate
        }
    }
];
