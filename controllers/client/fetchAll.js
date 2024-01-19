const registerClient = require("../../models/registerClient")
const { successResponse, errorResponse } = require("../../utils/response");

exports.FetchAllClient = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        if (limit > 100) return errorResponse(res, {error: "Limit should not exceed 100"}, 400);

        const clients = await registerClient.find({}).skip(skip).limit(parseInt(limit));
        const total = await registerClient.countDocuments({});
        return successResponse(res, { clients, total }, 200);
    } catch (error) {
        return errorResponse(res, error, 500)
    }
};
