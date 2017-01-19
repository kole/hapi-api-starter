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

export default fib;
