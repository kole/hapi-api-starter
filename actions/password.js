import MongoModels from 'mongo-models';

import findPendingPasswordReset from './passwords/findPendingPasswordReset';
import createPasswordResetRecord from './passwords/createPasswordResetRecord';
import trackAttempt from './passwords/trackAttempt';
// import rateLimit from './util/rateLimit';

export default class Passwords extends MongoModels {
    // locate user in users collection,
    // then store a record in the temp password-reset collection
    static initiate(request, cb) {
        // use async/await for easy waterfall control flow
        (async () => {
            // look for pending password reset requests for this email
            const existingRequest = await findPendingPasswordReset(request);

            // create the password reset record if it doesn't already exist
            if (!existingRequest) {
                await createPasswordResetRecord(request);
            }

            // trigger rate limiting
            // await rateLimit(pendingResetRequest);

            // track password reset attempt
            await trackAttempt(request);

            return cb({ status: 'pending' });
        })();
    }
}

Passwords.indexes = [
    { key: { email: 1 } }
];

Passwords.collection = 'Passwords';
