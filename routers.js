const routers = [
    {
        path: '/developer',
        router: require('./routes/developer')
    },
    {
        path: '/client',
        router: require('./routes/client')
    },
    {
        path: '/token',
        router: require('./routes/token')
    }
]

module.exports = routers;