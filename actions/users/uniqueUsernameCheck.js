import Boom from 'boom';

export default function uniqueUsernameCheck(db, username) {
    // make sure username is unique and not already used in database
    return new Promise((resolve, reject) => {
        db.findOne({ username }, (err, result) => {
            if (result) {
                return reject(Boom.conflict('Username is already in use'));
            }
            return resolve(result);
        });
    });
}
