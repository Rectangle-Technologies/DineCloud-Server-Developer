const { CreateClient } = require("../controllers/client/create")
const { FetchAllClient } = require("../controllers/client/fetchAll")
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
    },
    {
        method: 'get',
        path: '/fetchClients',
        controller: FetchAllClient,
        middlewares: [],
        description: 'Fetch all clients'
    }
]

module.exports = routesConfig