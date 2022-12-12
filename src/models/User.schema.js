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
        minLength: 7,
        maxLength: 100
    },
    notes: {
        type: Array
    },
    tokenResetPassword:{
        type: String,
        default: ''
    }
});

const User = model('User', userSchema);

const joiUserSchema = Joi.object({
    email: Joi.string().required().max(60),
    password: Joi.string().required().min(8).max(100),
    name: Joi.string().required().min(4).max(35)
});

module.exports = { User, joiUserSchema };