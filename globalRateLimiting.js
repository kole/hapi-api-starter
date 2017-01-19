import config from 'config';
import fib from './actions/util/fibonacci';

const globalRateLimiting = config.get('global_rate_limiting.active');

export default function rateLimit(request, reply) {
    if (globalRateLimiting) {
        const ip = request.info.remoteAddress;
        const url = request.url.pathname;
        const k = `globalRateLimit:${ip}:${url}`;
        const expire = config.get('global_rate_limiting.expire_in_seconds');
        let delay = 0;

        return request.redis.hincrby(k, 'count', 1, (err, count) => {
            request.redis.expire(k, expire, () => {
                if (count > 4) {
                    delay = fib(count - 5) * 1000; // set to ms
                    return setTimeout(() => {
                        return reply.continue();
                    }, delay);
                }
                // request is within acceptable parameters, no delay
                return reply.continue();
            });
        });
    }

    // rate limiting is toggled off, just continue through
    return reply.continue();
}
