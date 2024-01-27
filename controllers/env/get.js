const { errorResponse, successResponse } = require('../../utils/response')

exports.GetEnv = async (req, res) => {
    try {
        if (!req.body.serverName || !req.body.serverMode) {
            return errorResponse(res, {
                status: "error",
                data: null,
                error: {
                    name: "Input validation error",
                    message: "serverName and serverMode are required",
                    statusCode: 403
                }
            }, 403)
        }

        var env;
        const { serverName, serverMode } = req.body
        if (serverMode === 'development') {
            env = require('../../constants/env/development')[serverName]
        } else if (serverMode === 'production') {
            env = require('../../constants/env/production')[serverName]
        } else {
            return errorResponse(res, {
                status: "error",
                data: null,
                error: {
                    name: "Input validation error",
                    message: "serverMode must be either development or production",
                    statusCode: 403
                }
            }, 403)
        }

        successResponse(res, env, 'Env retrieved successfully')
    } catch (error) {
        const errorObject = error?.response?.data || error
        errorResponse(res, errorObject, error?.response?.status || 500)
    }
}