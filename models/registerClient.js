const mongoose = require('mongoose');

const registerClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    contact: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    address: {
        street: {
            type: String,
            trim: true,
            required: true
        },
        city: {
            type: String,
            trim: true,
            required: true
        },
        state: {
            type: String,
            trim: true,
            required: true
        },
        country: {
            type: String,
            trim: true,
            required: true
        },
        pinCode: {
            type: String,
            trim: true,
            required: true
        }
    },
    code: {
        type: String,
        trim: true,
        required: true
    },
    aadhaarNumber: {
        type: String,
        trim: true,
        required: true
    },
    aadhaarImageUrl: {
        type: String,
        trim: true,
        required: true
    },
    panNumber: {
        type: String,
        trim: true,
        required: true
    },
    panImageUrl: {
        type: String,
        trim: true,
        required: true
    },
    branchInfo: {
        name: {
            type: String,
            trim: true,
            required: true
        },
        contact: {
            type: String,
            trim: true,
            required: true
        },
        address: {
            street: {
                type: String,
                trim: true,
                required: true
            },
            city: {
                type: String,
                trim: true,
                required: true
            },
            state: {
                type: String,
                trim: true,
                required: true
            },
            country: {
                type: String,
                trim: true,
                required: true
            },
            pinCode: {
                type: String,
                trim: true,
                required: true
            }
        }
    },
    paymentDetails: {
        type: Object,
    }
})

module.exports = mongoose.model('RegisterClient', registerClientSchema);