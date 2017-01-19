export default function getRecordByEmail(req) {
    return new Promise((resolve) => {
        req.redis.hgetall(`pwdres:${req.payload.email}`, (err, result) => {
            if (result) {
                return resolve(result);
            }

            return resolve(false);
        });
    });
}
