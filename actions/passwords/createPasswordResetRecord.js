import config from 'config';
import uuid from 'uuid/v4';

import findPendingPasswordReset from './findPendingPasswordReset';

export default function insertResetRecord(request) {
    // insert new record in database
    return new Promise((resolve) => {
        const now = new Date().getTime();
        const k = `pwdres:${request.payload.email}`;
        const expires = config.get('password_reset.expires_in_seconds');

        // insert document into database
        request.redis.hmset(k, 'id', uuid(), 'created_at', now, () => {
            request.redis.expire(k, expires, () => {
                // return the newly created record back to the requestor
                return findPendingPasswordReset(request).then((record) => {
                    return resolve(record);
                });
            });
        });
    });
}
