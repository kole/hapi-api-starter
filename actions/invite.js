import Boom from 'boom';
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

        this.findInvitation(doc.invitedBy, doc.invitedTo).then((existingInv) => {
            if (existingInv) {
                return cb(Boom.conflict('Invitiation already exists in database'));
            }

            return this.insertOne(doc, (err, result) => {
                if (err) { throw new Error(err); }

                if (!result[0]._id) {
                    return cb(Boom.badRequest('Database error'));
                }

                return cb({ status: 'pending' });
            });
        }).catch(err => cb(err));
    }

    static findInvitation(invitedBy, invitedTo) {
        return new Promise((resolve, reject) => {
            this.findOne({ invitedBy, invitedTo }, (err, inv) => {
                if (err) {
                    return reject(Boom.badRequest(err));
                }

                return resolve(inv);
            });
        });
    }
}

Invitations.indexes = [
    { key: { email: 1 } }
];

Invitations.collection = 'Invitations';
