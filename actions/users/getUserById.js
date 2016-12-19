import Boom from 'boom';

export default function getUserById(db, id) {
    const _id = id;
    return new Promise((resolve, reject) => {
        db.findOne({ _id }, (err, user) => {
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
