import MongoModels from 'mongo-models';

export default class Accounts extends MongoModels {
    // create a new account document in the database
    static create(user, cb) {
        const usr = user;
        // eslint-disable-next-line no-underscore-dangle
        const userId = [usr._id];
        const doc = {
            _id: user.accounts[0].aid,
            createdAt: new Date().getTime(),
            users: userId
        };

        this.insertOne(doc, (err, result) => {
            if (err) { throw new Error(err); }

            return cb(result[0]);
        });
    }
}

Accounts.indexes = [
    { key: { _id: 1 } }
];

Accounts.collection = 'Accounts';
