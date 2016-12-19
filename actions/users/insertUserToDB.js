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
            role: 'admin'
        });

        // userId was moved to '_id', so we don't need it here anymore
        delete doc.userId;

        return db.insertOne(doc, (err, result) => {
            if (err) { return reject(Boom.badRequest('Database error')); }

            const userFromDB = result[0];

            // don't return the password to the requesting function
            delete userFromDB.password;

            return resolve(userFromDB);
        });
    });
}
