const { LoginDeveloper } = require("../controllers/developer/login")
const { RegisterDeveloper } = require("../controllers/developer/register")

const routesConfig = [
    {
        method: 'post',
        path: '/registerDeveloper',
        controller: RegisterDeveloper,
        middlewares: [],
        description: 'Register user'
    },
    {
        method: 'post',
        path: '/loginDeveloper',
        controller: LoginDeveloper,
        middlewares: [],
        description: 'Login user'
    }
]

module.exports = routesConfig