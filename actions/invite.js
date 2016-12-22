import moment from 'moment';
import MongoModels from 'mongo-models';
import uuid from 'uuid/v4';

export default class Invitations extends MongoModels {
    // create a new invitation document in the database
    static create(invite, cb) {
        const obj = {
            _id: uuid(),
            createdAt: moment(moment()).unix()
        };

        const doc = Object.assign(invite, obj);

        this.insertOne(doc, (err, result) => {
            if (err) { throw new Error(err); }

            return cb(result[0]);
        });
    }
}

Invitations.indexes = [
    { key: { _id: 1 } }
];

Invitations.collection = 'Invitations';
