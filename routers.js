const routers = [
    {
        path: '/developer',
        router: require('./routes/developer')
    },
    {
        path: '/client',
        router: require('./routes/client')
    }
]

module.exports = routers;