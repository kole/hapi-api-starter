import Boom from 'boom';
import moment from 'moment';
import MongoModels from 'mongo-models';
import uuid from 'uuid/v4';

import UsersCollection from './users';
import findUserByEmail from './users/getUserByEmail';

export default class Passwords extends MongoModels {
    // locate user in users collection,
    // then store a record in the temp password-reset collection
    static initiate(user, cb) {
        if (user.email) {
            return findUserByEmail(UsersCollection, user.email).then((usr) => {
                const doc = {
                    _id: uuid(),
                    email: usr.email,
                    createdAt: moment(moment()).unix()
                };
                return this.insertOne(doc, (err, result) => {
                    if (err) { throw new Error(err); }

                    if (!result[0]._id) {
                        return cb(Boom.badRequest('Database error'));
                    }

                    return cb({ status: 'pending' });
                });
            }).catch((err) => {
                return cb(Boom.badRequest(err));
            });
        }

        return cb({ status: 'pending' });
    }
}

Passwords.indexes = [
    { key: { email: 1 } }
];

Passwords.collection = 'Passwords';
