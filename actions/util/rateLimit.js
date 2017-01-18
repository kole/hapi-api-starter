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
    const ellapsed = now - doc.last_requested_at || now - doc.created_at;
    const expires = config.get('constants.seconds.twenty_four_hours');
    const expired = ellapsed > expires;

    const attempts = doc.count;
    const freeRetries = 5;
    const maxDelay = 60000; // the max delayed response time is 60 seconds
    const delayInMilliseconds = attempts * 250;

    return new Promise((resolve) => {
        // let's still assume this is a user and opt to not throttle the reply
        if (attempts < freeRetries) {
            return resolve();
        }
        return setTimeout(() => {
            console.log('delayed');
            resolve('delayed');
        }, 250);
    });
}
