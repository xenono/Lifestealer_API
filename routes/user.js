const express = require('express')
const router = express.Router()
const {body} = require("express-validator")

const dotenv = require('dotenv').config()

const User = require("../models/user")

const {isAuth} = require('../middlewares/isAuth')

const userController = require('../controllers/user')

router.get('/user', isAuth, userController.getUser)

router.get('/getProfile/:userId', isAuth, userController.getProfile)

router.post('/findProfile', isAuth, userController.findProfile)

router.post('/addFriend', isAuth, userController.addFriend)
router.get('/getFriends', isAuth, userController.getFriends)

router.post('/editUser', isAuth,[
	body('city').not().isEmpty().withMessage("City is required!"),
	body('country').not().isEmpty().withMessage("Country is required!"),
	body('job').not().isEmpty().withMessage("Job is required!"),
	body('workDescription').not().isEmpty().withMessage("workDescription is required!"),
	body('introduction').not().isEmpty().withMessage("Introduction is required!"),
	body('hobbyDescription').not().isEmpty().withMessage("hobbyDescription is required!"),
],userController.editUser)

module.exports = router