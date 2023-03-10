const { Schema, model } = require('mongoose');
const Joi = require('joi');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 35
    },
    email: {
        type: String,
        required: true,
        maxLength: 60
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 60
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Non-Binarie'],
        required: true
    },
    tokenResetPassword:{
        type: String,
        default: ''
    }
});

const User = model('User', userSchema);

const joiUserSchema = Joi.object({
    email: Joi.string().required().email().max(60),
    password: Joi.string().required().empty('').min(8).max(60),
    name: Joi.string().required().min(4).max(35),
    gender: Joi.string().required().min(4).max(11)
});

module.exports = { User, joiUserSchema };