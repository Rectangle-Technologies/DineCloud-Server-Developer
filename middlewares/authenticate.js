const Developer = require("../models/developer");
const { errorResponse } = require("../utils/response");
const jwt = require('@netra-development-solutions/utils.crypto.jsonwebtoken');

const authenticateUserMiddleware = async (req, res, next) => {
    try {
        // Extract token
        const token = req.header('Authorization')?.replace('Bearer ', '')
        if (!token) {
            return errorResponse(res, { error: 'Authentication error', message: "Please authenticate" }, 401)
        }

        // Verify token
        if (jwt.verify(token)) {
            const decoded = jwt.decode(token)

            // Check if developer exists
            const developer = await Developer.findOne({ email: decoded.email })
            if (!developer) {
                return errorResponse(res, { error: 'Authentication error', message: "Developer not found" }, 404)
            }

            // Add developer to req
            req.user = developer
        } else {
            return errorResponse(res, { error: 'Authentication error', message: "Invalid token" }, 401)
        }
        next()
    } catch (error) {
        const errorObject = error?.response?.data || error
        return errorResponse(res, errorObject, error?.response?.status || 500)
    }
}

module.exports = authenticateUserMiddleware;