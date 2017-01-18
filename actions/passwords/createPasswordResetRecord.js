import moment from 'moment';
import uuid from 'uuid/v4';

import findPendingPasswordReset from './findPendingPasswordReset';

export default function insertResetRecord(request) {
    // insert new record in database
    return new Promise((resolve) => {
        const now = moment(moment()).unix();

        // insert document into database
        request.redis.hmset(`pwdres:${request.payload.email}`, 'id', uuid(), 'created_at', now, () => {
            // return the newly created record back to the requestor
            return findPendingPasswordReset(request).then((record) => {
                return resolve(record);
            });
        });
    });
}
