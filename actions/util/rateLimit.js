import fib from './fibonacci';

export default function rateLimit(doc) {
    const count = doc.count || 1;

    // the delay algorithm is determined by the Fibonacci sequence
    const delay = Math.floor(fib(count) * 1000); // convert to ms

    return new Promise((resolve) => {
        return setTimeout(() => {
            resolve();
        }, delay);
    });
}
