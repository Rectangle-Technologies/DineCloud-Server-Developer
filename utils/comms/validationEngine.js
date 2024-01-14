const axios = require('axios');
const urls = require('../../constants/urls/validationEngine');

const getSchemasByFilter = async (body, token, headers = {}) => {
    const validationEngineBaseUrl = process.env.DINECLOUD_VALIDATIONENGINE_SERVER_URL;
    const url = `${validationEngineBaseUrl}${urls.getSchemasByFilter}`;

    return axios.post(url, body, {
        headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json",
            ...headers
        }
    });
}

const saveSchema = async (body, token, headers = {}) => {
    const validationEngineBaseUrl = process.env.DINECLOUD_VALIDATIONENGINE_SERVER_URL;
    const url = `${validationEngineBaseUrl}${urls.saveSchema}`;

    return axios.post(url, body, {
        headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json",
            ...headers
        }
    });
}

module.exports = {
    getSchemasByFilter,
    saveSchema
}