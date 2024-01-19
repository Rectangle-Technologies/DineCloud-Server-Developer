const { updateDomainModel, getDomainModelsByFilter } = require("../../utils/comms/domainModel")
const { saveDataByModel, getModelDataByFilter } = require("../../utils/comms/modelData")
const { errorResponse, successResponse } = require("../../utils/response")
const { generateBranchCode, generateUserCode } = require("../../utils/generateClientCode")
const bcrypt = require('bcryptjs');
const { getSchemasByFilter } = require("../../utils/comms/validationEngine")
const { saveSchema } = require("../../utils/comms/validationEngine")
const registerClient = require("../../models/registerClient")

exports.CreateClient = async (req, res) => {
    try {
        // Check if client code exists in register client
        const registerUser = await registerClient.findOne({ code: req.body.code })
        if (!registerUser) {
            return errorResponse(res, { error: 'Not exists error', message: 'Client is not registered' }, 403)
        }

        // Check if client already exists
        const existingClient = await getModelDataByFilter('Client', { email: req.body.email }, req.headers.authorization, {
            'Bypass-Key': process.env.BYPASS_KEY,
            'Client-Code': process.env.BASE_CLIENT_CODE,
        })
        if (existingClient?.data?.data[0].Client?.length > 0) {
            return errorResponse(res, { error: 'Duplication error', message: 'Client already exists' }, 403)
        }

        // Create all domain models for the client
        const domainModelsResponse = await getDomainModelsByFilter({ clientCode: process.env.BASE_CLIENT_CODE }, req.headers.authorization, {
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
                'Client-Code': req.body.code,
                'Bypass-Key': process.env.BYPASS_KEY
            })
            newModels.push(newModelResponse?.data?.data)
        }

        // Create client
        const clientResponse = await saveDataByModel('Client', req.body, req.headers.authorization, {
            'ByPass-Key': process.env.BYPASS_KEY,
            'Client-Code': req.body.code
        })
        const client = clientResponse?.data?.data[0]?.Client

        // Update clientId in domain models
        for (const model of newModels) {
            await updateDomainModel(model, req.headers.authorization, {
                'Client-Code': req.body.code,
                'Client-Id': client._id,
                'Bypass-Key': process.env.BYPASS_KEY
            })
        }

        // Create a branch for the client
        req.body.branchInfo.code = generateBranchCode().toUpperCase()
        const branchResponse = await saveDataByModel('Branch', req.body.branchInfo, req.headers.authorization, {
            'ByPass-Key': process.env.BYPASS_KEY,
            'Client-Code': req.body.code,
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
            'Client-Code': req.body.code,
            'Client-Id': client._id,
        })
        const user = userResponse?.data?.data[0]?.User
        delete user.hashedPassword

        // Create JSON Schema Cores
        const schemaCoresResponse = await getSchemasByFilter({}, req.headers.authorization, {
            'Bypass-Key': process.env.BYPASS_KEY,
            'Client-Code': process.env.BASE_CLIENT_CODE,
        })
        const schemaCores = schemaCoresResponse?.data?.data
        for (const schemaCore of schemaCores) {
            const shcemaCoreData = {
                name: schemaCore.name,
                key: schemaCore.key,
                description: schemaCore.description,
                version: schemaCore.version,
                schema: schemaCore.schema,
            }
            await saveSchema(shcemaCoreData, req.headers.authorization, {
                'Bypass-Key': process.env.BYPASS_KEY,
                'Client-Code': req.body.code,
                'Client-Id': client._id
            })
        }

        // Delete client from register client
        await registerClient.deleteOne({ code: req.body.code })

        successResponse(res, { client, user }, 'Client created successfully')
    } catch (error) {
        const errorObject = error?.response?.data || error
        console.log(errorObject)
        return errorResponse(res, errorObject, error?.response?.status || 500)
    }
}