const { login, register, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const express = require('express');
const validate = require('../middlewares/validate.schema');
const { joiUserSchema: schema } = require('../models/User.schema');

const router = express();

router.post('/register', validate(schema), register);

router.post('/login', login);

router.post('/forgot-password', forgotPassword);

router.put('/reset-password/:id/:tokenResetPassword', resetPassword);

module.exports = router;