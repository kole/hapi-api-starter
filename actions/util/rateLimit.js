import config from 'config';
import moment from 'moment';

// Fibonacci sequence for increased delay algorithm
// return number in sequence at given index
const fib = (a) => {
    const arr = [0, 1];
    let i = a;
    if (i > 30) { i = 30; } // safeguard against recursion
    for (let n = 0; n < i; n++) {
        const last = arr[arr.length - 1];
        const nextToLast = arr[arr.length - 2];
        const sum = nextToLast + last;
        arr.push(sum);
    }
    return arr.pop();
};

// Redis store should track requests based on
//  - IP + route (global rate limiting)
//  - email + route (user rate limiting)

export default function rateLimit(doc) {
    const now = moment(moment()).unix();
    const allowedTimeBetweenRequests = config.get('password_reset.allowed_time_between_requests_in_seconds');
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
