export default function trackAttempt(request) {
    const now = new Date().getTime();
    return new Promise((resolve) => {
        request.redis.hmset(`pwdres:${request.payload.email}`, 'last_requested_at', now, () => {
            request.redis.hincrby(`pwdres:${request.payload.email}`, 'count', 1, () => {
                request.redis.hgetall(`pwdres:${request.payload.email}`, (err, result) => {
                    return resolve(result);
                });
            });
        });
    });
}
