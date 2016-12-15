import Handler from '../handlers/session';
import Validation from '../validation/users';

export default [
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
