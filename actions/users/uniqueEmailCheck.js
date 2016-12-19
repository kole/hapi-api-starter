import Boom from 'boom';

export default function uniqueEmailCheck(db, email) {
    // confirm that the email is not already in the db
    return new Promise((resolve, reject) => {
        db.findOne({ email }, (err, result) => {
            if (result) {
                return reject(Boom.conflict('Email is already in use'));
            }
            return resolve(result);
        });
    });
}
