import sessionActions from '../sessions';
import getUserById from './getUserById';

export default function getSelf(sessId) {
    let userId = '';
    let user = {};
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                userId = await sessionActions.getSelfId(sessId);
            } catch (err) { return reject(err); }

            try {
                user = await getUserById(userId);
            } catch (err) { return reject(err); }

            return resolve(user);
        })();
    });
}
