const moment = require('moment');
const MongoModels = require('mongo-models');

class Users extends MongoModels {
    // as part of signup, update the user object in the
    // database with the newly created account ID for association
    static addAccountId(user, accountId, cb) {
        const update = {
            accounts: [accountId]
        };
        // eslint-disable-next-line no-underscore-dangle
        this.findByIdAndUpdate(user._id, update, (err, result) => {
            if (err) { throw new Error(err); }

            const accounts = result.accounts;
            const usr = Object.assign(user, { accounts });
            return cb(usr);
        });
    }

    // as part of signup, create a new user in the database
    static create(user, cb) {
        const usr = user;
        const doc = Object.assign(usr, {
            password: this.hashPassword(usr.password),
            createdAt: moment(moment()).unix()
        });

        this.insertOne(doc, (err, result) => {
            if (err) { throw new Error(err); }

            const userFromDB = result[0];

            // don't return the password to the requesting function
            delete userFromDB.password;

            return cb(userFromDB);
        });
    }

    // as part of signup, hash the password for safe storage in the db
    static hashPassword(password) {
        const pwd = password;
        return pwd;
    }
}

Users.collection = 'Users';
module.exports = Users;
