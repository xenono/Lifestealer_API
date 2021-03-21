const express = require('express')
const router = express.Router()

const User = require("../models/user")


const { body } = require("express-validator")

const dotenv = require('dotenv').config()


const authController = require('../controllers/auth')

router.post('/signup', [
	body('username')
		.custom((value, {req}) => {
			return User.findOne({username:value})
				.then(user => {
					if(user){
						return Promise.reject("Username not available")
					}
				})
		})
	],
	authController.signup)

router.post('/login',authController.login)

module.exports = router