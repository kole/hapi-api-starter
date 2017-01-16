import Boom from 'boom';

// get users model
import UsersCollection from '../users';

export default function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        UsersCollection.findOne({ email }, (err, user) => {
            if (err) { throw new Error(err); }

            if (user) {
                return resolve(user);
            }

            return reject(Boom.notFound('Email address not found'));
        });
    });
}
