// make sure user has verified their email address
import Boom from 'boom';

export default function checkVerified(userObj) {
    return new Promise((resolve, reject) => {
        // reject promise if not verified
        if (!userObj.verified) {
            return reject(Boom.unauthorized('Please verify email address'));
        }

        return resolve();
    });
}
