// configs for running tests via lab
// more info here: https://github.com/hapijs/lab

module.exports = {
    coverage: true,
    debug: true,
    environment: 'test',
    leaks: false,
    lint: true,
    verbose: true,
    sourcemaps: false,
    threshold: 10,
    transform: './test/config.js'
};
