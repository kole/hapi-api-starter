import Boom from 'boom';
import moment from 'moment';
import MongoModels from 'mongo-models';
import sessionActions from './sessions';

// import user methods
import comparePasswords from './users/comparePasswords';
import hashPassword from './users/hashPassword';
import uniqueEmailCheck from './users/uniqueEmailCheck';
import uniqueUsernameCheck from './users/uniqueUsernameCheck';

export default class Users extends MongoModels {
    // as part of signup, create a new user in the database
    static create(user, cb) {
        const usr = user;

        // asyncronous actions (happen in parallel)
        const signupFunctions = [
            uniqueUsernameCheck(this, usr.username),
            uniqueEmailCheck(this, usr.email),
            hashPassword(usr.password)
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
                await comparePasswords(password, user.password);
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

    static getSelf(sessId) {
        let userId = '';
        let user = {};
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    userId = await sessionActions.getSelfId(sessId);
                } catch (err) { return reject(err); }

                try {
                    user = await this.getUserById(userId);
                } catch (err) { return reject(err); }

                return resolve(user);
            })();
        });
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
}

Users.indexes = [
    { key: { _id: 1 } },
    { key: { email: 1 } }
];

Users.collection = 'Users';
