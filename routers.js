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
        path: '/env',
        router: require('./routes/env')
    },
    {
        path: '/token',
        router: require('./routes/token')
    }
]

module.exports = routers;