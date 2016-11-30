module.exports = [
    {
        method: 'GET',
        path: '/session',
        handler: (request, reply) => {
            reply('hello world session');
        }
    }
];
