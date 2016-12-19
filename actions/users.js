import MongoModels from 'mongo-models';
import sessionActions from './sessions';

// import user methods
import comparePasswords from './users/comparePasswords';
import hashPassword from './users/hashPassword';
import getUserByEmail from './users/getUserByEmail';
import getUserById from './users/getUserById';
import getSelf from './users/getSelf';
import insertUserToDB from './users/insertUserToDB';
import uniqueEmailCheck from './users/uniqueEmailCheck';
import uniqueUsernameCheck from './users/uniqueUsernameCheck';
import updateLastSeenAndSession from './users/updateLastSeenAndSession';


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
            insertUserToDB(this, usr, password).then((userObj) => {
                return cb(userObj);
            });
        }).catch((err) => {
            return cb(err);
        });
    }

    static login(email, password, cb) {
        // use async/await for easy waterfall control flow
        (async () => {
            let user = {};
            let sessId = '';

            // pull user out of db by email
            try {
                user = await getUserByEmail(this, email);
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
                user = await updateLastSeenAndSession(this, user._id, sessId);
            } catch (err) { return cb(err); }

            // don't return password to the client
            delete user.password;
            return cb(user);
        })();
    }

    // expose method to handler
    static getSelf(sessId) { return getSelf(this, sessId); }

    // expose method to handler
    static getUserById(id) { return getUserById(this, id); }
}

Users.indexes = [
    { key: { _id: 1 } },
    { key: { email: 1 } }
];

Users.collection = 'Users';
