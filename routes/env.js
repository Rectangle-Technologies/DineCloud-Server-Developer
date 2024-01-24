const { GetEnv } = require("../controllers/env/get");

const routes = [
    {
        path: '/getEnv',
        method: 'post',
        controller: GetEnv,
        middlewares: [],
        description: 'Get environment variables',
    }
]

module.exports = routes