const { generateClientCode } = require("../../utils/generateClientCode")
const RegisterClient = require("../../models/registerClient")
const { errorResponse, successResponse } = require("../../utils/response")

exports.RegisterClient = async (req, res) => {
    try {
        const data = req.body

        // Check if user exists
        const existingUser = await RegisterClient.findOne({
            $or: [{
                email: data.email
            }, {
                contact: data.contact
            }]
        })
        if (existingUser) {
            return errorResponse(res, { error: "Already exists", message: "User already exists" }, 403)
        }
        // Generate client code
        data.code = generateClientCode().toUpperCase()

        // Create user
        const user = await RegisterClient.create(data)
        successResponse(res, user, "Register user created successfully")
    } catch (error) {
        const errorObject = error?.response?.data || error
        return errorResponse(res, errorObject, error?.response?.status || 500)
    }
}