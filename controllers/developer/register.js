const { errorResponse, successResponse } = require("../../utils/response")
const Developer = require("../../models/developer")
const jwt = require('@netra-development-solutions/utils.crypto.jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.RegisterDeveloper = async (req, res) => {
    try {
        const data = req.body

        // Validate request
        if (!data.email || !data.password) {
            return errorResponse(res, { error: 'Validation error', message: "Please provide email and password" }, 403)
        }

        // Check if developer exists
        const developer = await Developer.findOne({ email: data.email })
        if (developer) {
            return errorResponse(res, { error: 'Duplication error', message: "Developer already exists" }, 403)
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        data.password = hashedPassword;

        // Create developer
        await Developer.create(data)

        // Generate token
        const token = jwt.sign({ email: data.email }, process.env.AES_GCM_ENCRYPTION_KEY, process.env.JWT_TOKEN_SECRET, process.env.AES_GCM_ENCRYPTION_IV);

        return successResponse(res, { email: data.email, token }, "Developer registered successfully")
    } catch (error) {
        const errorObject = error?.response?.data || error
        return errorResponse(res, errorObject, error?.response?.status || 500)
    }
}