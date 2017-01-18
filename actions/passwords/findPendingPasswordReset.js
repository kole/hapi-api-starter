import createPasswordResetRecord from './createPasswordResetRecord';

export default function getRecordByEmail(req) {
    return new Promise((resolve) => {
        req.redis.hgetall(`pwdres:${req.payload.email}`, (err, result) => {
            if (result) {
                return resolve(result);
            }

            // create the password reset record since it doesn't already exist
            return createPasswordResetRecord(req).then((record) => {
                return resolve(record);
            });
        });
    });
}
