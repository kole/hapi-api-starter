import Boom from 'boom';

export default function getUserByEmail(db, email) {
    return new Promise((resolve, reject) => {
        db.findOne({ email }, (err, user) => {
            if (err) { throw new Error(err); }

            if (user) {
                return resolve(user);
            }

            return reject(Boom.notFound('Email address not found'));
        });
    });
}
