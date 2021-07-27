const express = require('express');
const router = express.Router();
const {Register,ActivateAccount} = require('../Controllers/Auth/Register')
const {Login,isLoggedIn} = require('../Controllers/Auth/Login')
const ForgotPassword = require('../Controllers/Auth/ForgotPassword')
const ResetPassword = require('../Controllers/Auth/ResetPassword')

router.post('/register',Register)

router.get('/activate-account/:activateToken',ActivateAccount)

router.post('/login',Login)

router.get('/isLoggedIn',isLoggedIn)

router.post('/forgot-password',ForgotPassword)

router.put('/reset-password/:resetToken',ResetPassword)

module.exports = router