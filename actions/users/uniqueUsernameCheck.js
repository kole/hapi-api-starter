import Boom from 'boom';

// get users model
import UsersCollection from '../users';

export default function uniqueUsernameCheck(username) {
    // make sure username is unique and not already used in database
    return new Promise((resolve, reject) => {
        UsersCollection.findOne({ username }, (err, result) => {
            if (result) {
                return reject(Boom.conflict('Username is already in use'));
            }
            return resolve(result);
        });
    });
}
