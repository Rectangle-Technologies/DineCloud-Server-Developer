const { LoginDeveloper } = require("../controllers/developer/login")
const { RegisterDeveloper } = require("../controllers/developer/register")
const authenticateUserMiddleware = require("../middlewares/authenticate")

const routesConfig = [
    {
        method: 'post',
        path: '/register',
        controller: RegisterDeveloper,
        middlewares: [
            authenticateUserMiddleware
        ],
        description: 'Register user'
    },
    {
        method: 'post',
        path: '/login',
        controller: LoginDeveloper,
        middlewares: [],
        description: 'Login user'
    }
]

module.exports = routesConfig