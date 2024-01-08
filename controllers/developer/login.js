const { errorResponse, successResponse } = require("../../utils/response")
const jwt = require('@netra-development-solutions/utils.crypto.jsonwebtoken');
const Developer = require("../../models/developer")
const bcrypt = require('bcryptjs');

exports.LoginDeveloper = async (req, res) => {
    try {
        const data = req.body

        // Validate request
        if (!data.email || !data.password) {
            return errorResponse(res, { error: 'Validation error', message: "Please provide email and password" }, 403)
        }

        // Check if developer exists
        const developer = await Developer.findOne({ email: data.email })
        if (!developer) {
            return errorResponse(res, { error: 'Not found', message: "Developer not found" }, 404)
        }

        // Check if password is correct
        const validPassword = await bcrypt.compare(data.password, developer.password);
        if (!validPassword) {
            return errorResponse(res, { error: 'Authentication error', message: "Invalid password" }, 401)
        }

        // Generate token
        const token = jwt.sign({ email: data.email }, process.env.AES_GCM_ENCRYPTION_KEY, process.env.JWT_TOKEN_SECRET, process.env.AES_GCM_ENCRYPTION_IV);

        return successResponse(res, { email: data.email, token }, "Developer logged in successfully")
    } catch (error) {
        const errorObject = error?.response?.data || error
        return errorResponse(res, errorObject, error?.response?.status || 500)
    }
}