import config from 'config';
import MongoModels from 'mongo-models';

import findPendingPasswordReset from './passwords/findPendingPasswordReset';
import createPasswordResetRecord from './passwords/createPasswordResetRecord';
import trackAttempt from './passwords/trackAttempt';
import rateLimit from './util/rateLimit';

export default class Passwords extends MongoModels {
    // locate user in users collection,
    // then store a record in the temp password-reset collection
    static initiate(request, cb) {
        // use async/await for easy waterfall control flow
        (async () => {
            const rl = config.get('password_reset.rate_limiting.active');

            // look for pending password reset requests for this email
            let existingRequest = await findPendingPasswordReset(request);

            // create the password reset record if it doesn't already exist
            if (!existingRequest) {
                existingRequest = await createPasswordResetRecord(request);
            }

            // track (record) password reset attempt
            await trackAttempt(request);

            // trigger rate limiting
            if (rl) {
                const allowedTimeBetweenRequests = config.get('password_reset.required_time_between_repeat_requests_in_seconds');
                await rateLimit(existingRequest, allowedTimeBetweenRequests);
            }

            return cb({ status: 'pending' });
        })();
    }
}

Passwords.indexes = [
    { key: { email: 1 } }
];

Passwords.collection = 'Passwords';
