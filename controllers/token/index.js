const jwt = require('@netra-development-solutions/utils.crypto.jsonwebtoken');
const { successResponse, errorResponse } = require('../../utils/response');

const decodeToken = (req, res) => {
    const { env, token } = req.body;

    if (!token) return errorResponse(res, "Token is required", 400);

    try {
        if (env === 'production') {
            const key = process.env.PROD_AES_GCM_ENCRYPTION_KEY;
            const iv = process.env.PROD_AES_GCM_ENCRYPTION_IV;
            const secretToken = process.env.PROD_JWT_TOKEN_SECRET;

            const decodedToken = jwt.decode(token, secretToken, key, iv);
            return successResponse(res, decodedToken, "Token decoded successfully");
        } else if (env === 'development') {
            const decodedToken = jwt.decode(token);
            return successResponse(res, decodedToken, "Token decoded successfully");
        
        }
        else {
            return errorResponse(res, "Invalid environment", 400);
        }
    } catch (err) {
        return errorResponse(res, err, 500);
    }
};

module.exports = {
    decodeToken
};