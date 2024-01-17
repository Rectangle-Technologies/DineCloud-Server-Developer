const { decodeToken } = require("../controllers/token")

const routesConfig = [
    {
        method: 'post',
        path: '/decodeToken',
        controller: decodeToken,
        middlewares: [],
        description: 'Decode a token'
    }
]

module.exports = routesConfig