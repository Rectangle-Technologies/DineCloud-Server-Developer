const axios = require('axios');
const urls = require('../../constants/urls/domainModel')

const updateDomainModel = async (body, token, headers = {}) => {
    const domainModelBaseUrl = process.env.DINECLOUD_DOMAINMODEL_SERVER_URL;
    const url = `${domainModelBaseUrl}${urls.updateDomainModel}`;

    return axios.post(url, body, {
        headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json",
            ...headers
        }
    });
}

const getDomainModelsByFilter = async (body, token, headers = {}) => {
    const domainModelBaseUrl = process.env.DINECLOUD_DOMAINMODEL_SERVER_URL;
    const url = `${domainModelBaseUrl}${urls.getDomainModelsByFilter}`;

    return axios.post(url, body, {
        headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json",
            ...headers
        }
    });
}

module.exports = {
    updateDomainModel,
    getDomainModelsByFilter
}