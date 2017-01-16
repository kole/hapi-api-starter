import Boom from 'boom';

// get users model
import UsersCollection from '../users';

export default function getUserById(id) {
    const _id = id;
    return new Promise((resolve, reject) => {
        UsersCollection.findOne({ _id }, (err, user) => {
            if (err) { return reject(Boom.badRequest(err)); }

            if (user) {
                const usr = user;
                delete usr.password;
                return resolve(usr);
            }

            return reject(Boom.notFound('User not found'));
        });
    });
}
