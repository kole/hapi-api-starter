import Boom from 'boom';

// get users model
import UsersCollection from '../users';

export default function insertUser(user, password) {
    // insert new user in database
    return new Promise((resolve, reject) => {
        // prep doc for insertion
        const doc = Object.assign(user, {
            _id: user.userId,
            password,
            created_at: new Date().getTime(),
            verified: false,
            verifyToken: Math.random().toString().replace('.', '').substring(1, 5) // 4 digit verification code sent to signup email
        });

        // userId was moved to '_id', so we don't need it here anymore
        delete doc.userId;

        return UsersCollection.insertOne(doc, (err, result) => {
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
