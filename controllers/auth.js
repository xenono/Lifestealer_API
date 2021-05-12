const User = require("../models/user")
const bcrypt = require('bcrypt')
const {validationResult} = require('express-validator')
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv').config()

exports.signup = async (req, res, next) => {
	const errors = validationResult(req)
	if(!errors.isEmpty()){
		const error = new Error(errors.array()[0].msg)
		error.statusCode = 422
		return next(error)
	}

	const {email, password, confirmPassword, name, lastname} = req.body
	if(password !== confirmPassword){
		const error = new Error('Passwords must match.')
		error.statusCode = 422
		return next(error)
	}
	try {
		const hashedPassword = await bcrypt.hash(password, 12)
		const user = new User({
			email,
			password: hashedPassword,
			name,
			lastname
		})
		await user.save()
		res.status(200).json({message: "User created",success: true})
	} catch (err) {
		next(err)
	}
}

exports.login = async (req,res,next) => {
	const {email, password} = req.body
	try {
		let user = await User.findOne({email})
		if (!user) {
			const error = new Error("User does not exists.")
			error.statusCode = 404
			return next(error)
		}
		const isEqual = await bcrypt.compare(password,user.password)
		if(!isEqual){
			const error = new Error("Password is incorrect")
			error.statusCode = 404
			return next(error)
		}

		const token = jwt.sign({userId: user._id, }, process.env.SECRET_JWT_KEY,{expiresIn: "1h"})
		res.cookie('token', token, {httpOnly: true})
		res.cookie('isLoggedIn', true)
		res.status(200).json({_id:user._id})
	}
	catch (err) {
		next(err)
	}
}

exports.logout = (req,res,next) => {
	const token = req.cookies.token
	res.cookie('isLoggedIn', false)
	res.cookie('token', token, {httpOnly: true, expires: new Date(Date.now())})
	res.status(200).json()
}