const bcrypt = require('bcrypt');
const Boom = require('boom');
const moment = require('moment');
const MongoModels = require('mongo-models');

class Users extends MongoModels {
    // as part of signup, create a new user in the database
    static create(user, cb) {
        const usr = user;

        // enforce unique username
        this.uniqueUsername(usr.username, (existingUser) => {
            if (existingUser) {
                return cb(Boom.conflict('Username is already in use'));
            }

            // enforce unique email address
            return this.uniqueEmail(usr.email, (existingEmail) => {
                if (existingEmail) {
                    return cb(Boom.conflict('Email is already registered'));
                }

                return bcrypt.hash(usr.password, 10).then((hash) => {
                    // prep doc for insertion
                    const doc = Object.assign(usr, {
                        _id: user.userId,
                        password: hash,
                        createdAt: moment(moment()).unix()
                    });

                    // userId was moved to '_id', so we don't need it here anymore
                    delete doc.userId;

                    return this.insertOne(doc, (err, result) => {
                        if (err) { throw new Error(err); }

                        const userFromDB = result[0];

                        // don't return the password to the requesting function
                        delete userFromDB.password;

                        return cb(userFromDB);
                    });
                });
            });
        });
    }

    static uniqueEmail(email, cb) {
        this.findOne({ email }, (err, result) => {
            return cb(result);
        });
    }

    static uniqueUsername(username, cb) {
        this.findOne({ username }, (err, result) => {
            return cb(result);
        });
    }
}

Users.indexes = [
    { key: { _id: 1 } }
];

Users.collection = 'Users';

module.exports = Users;
