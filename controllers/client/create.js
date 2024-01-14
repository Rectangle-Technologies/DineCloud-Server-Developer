const { updateDomainModel, getDomainModelsByFilter } = require("../../utils/comms/domainModel")
const { saveDataByModel } = require("../../utils/comms/modelData")
const { errorResponse, successResponse } = require("../../utils/response")
const { generateBranchCode, generateUserCode } = require("../../utils/generateClientCode")
const bcrypt = require('bcryptjs')

exports.CreateClient = async (req, res) => {
    try {
        // Create all domain models for the client
        const domainModelsResponse = await getDomainModelsByFilter({ clientCode: req?.user?.clientCode }, req.headers.authorization, {
            'ByPass-Key': process.env.BYPASS_KEY,
        })
        const domainModels = domainModelsResponse?.data?.data
        var newModels = []
        for (const model of domainModels) {
            const data = {
                name: model.name,
                description: model.description,
                version: model.version,
                schema: model.schema,
            }
            const newModelResponse = await updateDomainModel(data, req.headers.authorization, {
                'Client-Code': req.body.clientCode,
                'Bypass-Key': process.env.BYPASS_KEY
            })
            newModels.push(newModelResponse?.data?.data)
        }

        // Create client
        const clientResponse = await saveDataByModel('Client', req.body, req.headers.authorization, {
            'ByPass-Key': process.env.BYPASS_KEY,
            'Client-Code': req.body.clientCode
        })
        const client = clientResponse?.data?.data[0]?.Client

        // Update clientId in domain models
        for (const model of newModels) {
            await updateDomainModel(model, req.headers.authorization, {
                'Client-Code': req.body.clientCode,
                'Client-Id': client._id,
                'Bypass-Key': process.env.BYPASS_KEY
            })
        }

        // Create a branch for the client
        req.body.branchInfo.code = generateBranchCode().toUpperCase()
        const branchResponse = await saveDataByModel('Branch', req.body.branchInfo, req.headers.authorization, {
            'ByPass-Key': process.env.BYPASS_KEY,
            'Client-Code': req.body.clientCode,
            'Client-Id': client._id
        })
        const branch = branchResponse?.data?.data[0]?.Branch

        // Create a user for the client
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash("Password0", salt)
        const userResponse = await saveDataByModel('User', {
            firstName: 'Admin',
            lastName: 'User',
            email: req.body.email,
            code: generateUserCode().toUpperCase(),
            hashedPassword,
            branchId: branch._id,
            branchCode: branch.code,
        }, req.headers.authorization, {
            'ByPass-Key': process.env.BYPASS_KEY,
            'Client-Code': req.body.clientCode,
            'Client-Id': client._id,
        })

        successResponse(res, client, 'Client created successfully')
    } catch (error) {
        console.log('error', error)
        const errorObject = error?.response?.data || error
        return errorResponse(res, errorObject, error?.response?.status || 500)
    }
}