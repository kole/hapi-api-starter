import Handler from '../handlers/invite';
import Validation from '../validation/invite';

export default [
    {
        method: 'POST',
        path: '/invite',
        config: {
            handler: Handler.new,
            validate: Validation.invite
        }
    }
];
