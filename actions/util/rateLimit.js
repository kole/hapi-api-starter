import moment from 'moment';
import fib from './fibonacci';

export default function rateLimit(doc, allowedTimeBetweenRequests) {
    const now = moment(moment()).unix();
    const ellapsed = (now - doc.last_requested_at) || (allowedTimeBetweenRequests + 1);
    const tooSoon = ellapsed < allowedTimeBetweenRequests;
    const count = doc.count || 1;

    // the delay algorithm is determined by the Fibonacci sequence
    let delay = fib(count) * 1000; // convert to ms

    // 3 free tries (within the allowed time limit) before we start rate limiting
    if (count < 4 && !tooSoon) {
        delay = 0;
    }

    return new Promise((resolve) => {
        return setTimeout(() => {
            resolve();
        }, delay);
    });
}
