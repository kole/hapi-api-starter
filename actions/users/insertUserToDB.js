import Boom from 'boom';
import moment from 'moment';

export default function insertUser(db, user, password) {
    // insert new user in database
    return new Promise((resolve, reject) => {
        // prep doc for insertion
        const doc = Object.assign(user, {
            _id: user.userId,
            password,
            createdAt: moment(moment()).unix(),
            verified: false,
            verifyToken: Math.random().toString().replace('.', '').substring(1, 5) // 4 digit verification code sent to signup email
        });

        // userId was moved to '_id', so we don't need it here anymore
        delete doc.userId;

        return db.insertOne(doc, (err, result) => {
            if (err) { return reject(Boom.badRequest('Database error')); }

            const userFromDB = result[0];

            // ssshhh, the  user can't know this yet :P
            delete userFromDB.verifyToken;

            // don't return the password to the requesting function
            delete userFromDB.password;

            return resolve(userFromDB);
        });
    });
}
