const express = require('express');
const router = express.Router();
const isAuthorized = require('../middleware/isAuthorized')
const WelcomePage = require('../Controllers/Private/WelcomePage')
const {Shortner,RedirectShortUrl} = require('../Controllers/Private/Shortner')
const YearlyDashboard = require('../Controllers/Private/Dashboard/YearlyDashboard')
const MonthlyDashboard = require('../Controllers/Private/Dashboard/MonthlyDashboard')
const AllURL = require('../Controllers/Private/AllURL')

router.get('/authorized',isAuthorized,WelcomePage)

router.get('/allurl',isAuthorized,AllURL)

router.post('/shorten',isAuthorized,Shortner)

router.get('/:shortcode',RedirectShortUrl)

router.get('/dashboard-year/:year',isAuthorized,YearlyDashboard)

router.get('/dashboard-month/:year/:month',isAuthorized,MonthlyDashboard)



module.exports = router