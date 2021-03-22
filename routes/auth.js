const express = require('express')
const router = express.Router()

const User = require("../models/user")

const { isAuth } = require('../middlewares/isAuth')


const {body} = require("express-validator")

const authController = require('../controllers/auth')

router.post('/signup', [
		body('email').isEmail().trim()
			.custom((value, {req}) => {
				return User.findOne({email: value})
					.then(user => {
						if (user) {
							return Promise.reject("Email is already used.")
						}
					})
			}),
		body('name').not().isEmpty().trim().withMessage("Name is required"),
		body('lastname').not().isEmpty().trim().withMessage("Last name is required")
	],
	authController.signup)

router.post('/login', authController.login)
router.get('/logout', isAuth, authController.logout)

module.exports = router