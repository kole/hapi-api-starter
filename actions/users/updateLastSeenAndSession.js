import Boom from 'boom';
import moment from 'moment';

export default function updateLastSeenAndSession(db, userId, sessId) {
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
        db.findOneAndUpdate(query, update, (err, userUpdated) => {
            if (err) { throw new Error(err); }

            if (userUpdated._id) {
                return resolve(userUpdated);
            }
            return reject(Boom.badRequest('Database Error'));
        });
    });
}
