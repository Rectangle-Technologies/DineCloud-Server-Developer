const { CreateClient } = require("../controllers/client/create")
const { RegisterClient } = require("../controllers/client/register")

const routesConfig = [
    {
        method: 'post',
        path: '/createClient',
        controller: CreateClient,
        middlewares: [],
        description: 'Create a new client'
    },
    {
        method: 'post',
        path: '/registerClient',
        controller: RegisterClient,
        middlewares: [],
        description: 'Register a new client'
    }
]

module.exports = routesConfig