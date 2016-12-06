const moment = require('moment');
const MongoModels = require('mongo-models');

class Accounts extends MongoModels {
    // create a new account document in the database
    static create(user, cb) {
        const usr = user;
        // eslint-disable-next-line no-underscore-dangle
        const userId = [usr._id];
        const document = {
            _id: user.accounts[0],
            createdAt: moment(moment()).unix(),
            users: userId
        };

        this.insertOne(document, (err, result) => {
            if (err) { throw new Error(err); }

            return cb(result[0]);
        });
    }
}

Accounts.indexes = [
    { key: { _id: 1 } }
];

Accounts.collection = 'Accounts';
module.exports = Accounts;
