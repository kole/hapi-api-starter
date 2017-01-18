import sessionActions from '../sessions';
import getUserById from './getUserById';

export default function getSelf(request, sessId) {
    let userId = '';
    let user = {};
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                userId = await sessionActions.getSelfId(request, sessId);
            } catch (err) { return reject(err); }

            try {
                user = await getUserById(request, userId);
            } catch (err) { return reject(err); }

            return resolve(user);
        })();
    });
}
