import Boom from 'boom';

// get users model
import UsersCollection from '../users';

export default function uniqueEmailCheck(email) {
    // confirm that the email is not already in the db
    return new Promise((resolve, reject) => {
        UsersCollection.findOne({ email }, (err, result) => {
            if (result) {
                return reject(Boom.conflict('Email is already in use'));
            }
            return resolve(result);
        });
    });
}
