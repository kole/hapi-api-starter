module.exports = [
    {
        method: 'GET',
        path: '/user',
        handler: (request, reply) => {
            reply('hello world user');
        }
    }
];
