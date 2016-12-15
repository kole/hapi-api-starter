import bcrypt from 'bcrypt';
import Boom from 'boom';
import moment from 'moment';
import MongoModels from 'mongo-models';
import sessionActions from './sessions';

export default class Users extends MongoModels {
    // as part of signup, create a new user in the database
    static create(user, cb) {
        const usr = user;

        // asyncronous actions (happen in parallel)
        const signupFunctions = [
            this.usernameCheck(usr.username),
            this.emailCheck(usr.email),
            this.passwordHash(usr.password)
        ];

        // promise is processed once all signup functions resolve
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
        // confirm that the email is not already in the db
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

            return this.insertOne(doc, (err, result) => {
                if (err) { return reject(Boom.badRequest('Database error')); }

                const userFromDB = result[0];

                // don't return the password to the requesting function
                delete userFromDB.password;

                return resolve(userFromDB);
            });
        });
    }

    static login(email, password, cb) {
        // use async/await for easy waterfall control flow
        (async () => {
            let user = {};
            let sessId = '';

            // pull user out of db by email
            try {
                user = await this.getUserByEmail(email);
            } catch (err) { return cb(err); }

            // make sure password matches what's in db
            try {
                await this.passwordCompare(password, user.password);
            } catch (err) { return cb(err); }

            // handle session create/update logic
            try {
                sessId = await sessionActions.validate(user);
            } catch (err) { return cb(err); }

            // update last_seen_date and sessionID on user object in db
            try {
                user = await this.updateLastSeenAndSession(user._id, sessId);
            } catch (err) { return cb(err); }

            // don't return password to the client
            delete user.password;
            return cb(user);
        })();
    }

    static getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            this.findOne({ email }, (err, user) => {
                if (err) { throw new Error(err); }

                if (user) {
                    return resolve(user);
                }

                return reject(Boom.notFound('Email address not found'));
            });
        });
    }

    static getUserById(id) {
        const _id = id;
        return new Promise((resolve, reject) => {
            this.findOne({ _id }, (err, user) => {
                if (err) { return reject(Boom.badRequest(err)); }

                if (user) {
                    const usr = user;
                    delete usr.password;
                    return resolve(usr);
                }

                return reject(Boom.notFound('User not found'));
            });
        });
    }

    static passwordCompare(pass1, pass2) {
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

    static passwordHash(password) {
        // bcrypt the password string for safe storage
        return new Promise((resolve) => {
            return bcrypt.hash(password, 10).then((hash) => {
                resolve(hash);
            });
        });
    }

    static updateLastSeenAndSession(userId, sessId) {
        // update stored user object with last login date in unix format
        const query = {
            _id: userId
        };
        const update = {
            $set: {
                last_seen_date: moment(moment()).unix(),
                sid: sessId
            }
        };
        return new Promise((resolve, reject) => {
            this.findOneAndUpdate(query, update, (err, userUpdated) => {
                if (err) { throw new Error(err); }

                if (userUpdated._id) {
                    return resolve(userUpdated);
                }
                return reject(Boom.badRequest('Database Error'));
            });
        });
    }

    static usernameCheck(username) {
        // make sure username is unique and not already used in database
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
    { key: { _id: 1 } },
    { key: { email: 1 } }
];

Users.collection = 'Users';
