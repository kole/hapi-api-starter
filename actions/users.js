const bcrypt = require('bcrypt');
const Boom = require('boom');
const moment = require('moment');
const MongoModels = require('mongo-models');

class Users extends MongoModels {
    // as part of signup, create a new user in the database
    static create(user, cb) {
        const usr = user;
        const signupFunctions = [
            this.usernameCheck(usr.username),
            this.emailCheck(usr.email),
            this.passwordHash(usr.password)
        ];

        Promise.all(signupFunctions).then((done) => {
            const password = done[2];
            this.insertUser(usr, password).then((userObj) => {
                return cb(userObj);
            });
        }).catch((err) => {
            return cb(err);
        });
    }

    static emailCheck(email) {
        return new Promise((resolve, reject) => {
            this.findOne({ email }, (err, result) => {
                if (result) {
                    return reject(Boom.conflict('Email is already in use'));
                }
                return resolve(result);
            });
        });
    }

    static insertUser(user, password) {
        return new Promise((resolve, reject) => {
            // prep doc for insertion
            const doc = Object.assign(user, {
                _id: user.userId,
                password,
                createdAt: moment(moment()).unix()
            });

            // userId was moved to '_id', so we don't need it here anymore
            delete doc.userId;

            return this.insertOne(doc, (err, result) => {
                if (err) { return reject(Boom.badRequest('Database error')); }

                const userFromDB = result[0];

                // don't return the password to the requesting function
                delete userFromDB.password;

                return resolve(userFromDB);
            });
        });
    }

    static passwordHash(password) {
        return new Promise((resolve) => {
            return bcrypt.hash(password, 10).then((hash) => {
                resolve(hash);
            });
        });
    }

    static usernameCheck(username) {
        return new Promise((resolve, reject) => {
            this.findOne({ username }, (err, result) => {
                if (result) {
                    return reject(Boom.conflict('Username is already in use'));
                }
                return resolve(result);
            });
        });
    }
}

Users.indexes = [
    { key: { _id: 1 } }
];

Users.collection = 'Users';

module.exports = Users;
