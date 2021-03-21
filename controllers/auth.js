const User = require("../models/user")
const bcrypt = require('bcrypt')
const {validationResult} = require('express-validator')


exports.signup = async (req, res, next) => {
	const errors = validationResult(req)
	if(!errors.isEmpty()){
		const error = new Error('Username is not available')
		error.statusCode = 422
		error.data = 'Username is not available'
		return next(error)
	}

	const {username, password, confirmPassword} = req.body
	if(password !== confirmPassword){
		const error = new Error('Passwords must match.')
		error.statusCode = 422
		return next(error)
	}
	try {
		const hashedPassword = await bcrypt.hash(password, 12)
		const user = new User({
			username,
			password: hashedPassword
		})
		await user.save()
		res.status(200).json({message: "User created",success: true})
	} catch (err) {
		next(err)
	}
}

exports.login = async (req,res,next) => {
	const {username, password} = req.body
	try {
		const user = await User.findOne({username})
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
		res.status(200).json({success: true})
	}
	catch (err) {
		next(err)
	}
}