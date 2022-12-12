const { tokenSign } = require('../helpers/handleJwt');
const { User } = require('../models/User.schema');
const { compare, hash } = require('bcrypt');
const nodemailer = require('nodemailer');
const strongPassword = require('../middlewares/validate.password');

module.exports = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            if(!email || !password) return res.status(400).json('INSERT_CREDENTIALS');
            
            const findedUser = await User.findOne({ email });
            console.log(findedUser)
            const checkPassword = await compare(password, findedUser.password);
            if(!checkPassword) return res.status(418).json('INCORRECT_CREDENTIALS');

            const token = await tokenSign(findedUser);

            const userNoPassword = findedUser.toJSON();
            delete userNoPassword.password;

            res.status(200).json({ success: true, user: { ...userNoPassword, token } })
        } catch(error) {
            res.status(404).json({ success: false, error });
        }
    },
    register: async (req, res) => {
        if(!strongPassword.test(req.body.password)) return res
        .status(400)
        .json('The password is at least 8 characters long, one uppercase letter, one lowercase letter, one digit and one special character.');

        try {
            if(await User.findOne({ email:req.body.email })) return res.status(404).json('EXIST_USER_IN_DB');

            await User.create({
                password: await hash(req.body.password, 10), name: req.body.name, email: req.body.email
            }) && res.status(200).json({ success: true, message: 'Registered successfully.'});
        } catch (error) {
            res.status(401).json({ success: false, error });
        }
    },
    forgotPassword: async (req, res) => {
        if(!req.body.email) return res.status(400).json('INSERT_CREDENTIALS');

        try {
            const user = await User.findOne({ email:req.body.email });
            if(!user) return res.status(400).json('EMAIL_UNKNOWN');

            const token = await tokenSign(user);
            await user.update({
                tokenResetPassword: token
            });
            await user.save();

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: `${process.env.EMAIL_ADDRESS}`,
                    pass: `${process.env.GENERATED_EMAIL_APP_PASSWORD}`
                }
            });

            const emailPort = process.env.EMAIL_PORT || 3001;
            const mailOptions = {
                from: `${process.env.EMAIL_ADDRESS}`,
                to: `${user.email}`,
                subject: 'Password Recovery Link (expiration in 1h)',
                text: `Click for password recovery: ${emailPort}/reset-password/${user._id}/${token}`
            };

            transporter.sendMail(mailOptions, (err, response) => {
                if(err) {
                    console.error('Something went wrong', err);
                } else {
                    res.status(200).json('Email sent for password recovery successfully.')
                }
            })
        } catch (error) {
            res.status(500).json(error);
        }
    },
    resetPassword: async (req, res) => {
        if(!strongPassword.test(req.body.inputsResetPassword.newPassword)) return res
        .status(400)
        .json('The password is at least 8 characters long, one uppercase letter, one lowercase letter, one digit and one special character.')
        try {
            const userReset = await User.findOne({ _id: req.body.userId, tokenResetPassword: req.body.tokenResetPassword });
            if(!userReset) return res.status(400).json('USER_NOT_FOUND');

            req.body.inputsResetPassword.newPassword = await hash(req.body.inputsResetPassword.newPassword, 10);
            
            await User.findOneAndUpdate({ _id: req.body.userId, tokenResetPassword: req.body.tokenResetPassword },  { password: req.body.inputsResetPassword.newPassword })
            
            res.status(200).json('Changed password successfully.');
        } catch (error) {
            res.status(500).json(error);
        }
    }
}