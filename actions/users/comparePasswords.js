import bcrypt from 'bcrypt';
import Boom from 'boom';

export default function comparePasswords(pass1, pass2) {
    // does password in payload match what's on record in the database?
    return new Promise((resolve, reject) => {
        return bcrypt.compare(pass1, pass2).then((match) => {
            // 'match' is a bool
            if (match) {
                return resolve(match);
            }
            return reject(Boom.unauthorized('Incorrect password'));
        });
    });
}
