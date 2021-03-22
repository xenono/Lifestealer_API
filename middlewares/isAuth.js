const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

exports.isAuth = (req,res,next) => {
	const token = req.cookies.token
	let decodedToken
	try {
		decodedToken = jwt.verify(token, process.env.SECRET_JWT_KEY)
	} catch(err){
		err.statusCode = 500
		return next(err)
	}
	if(!decodedToken){
		const error = new Error("Not authenticated!")
		error.statusCode = 401
		return next(error)
	}
	req.userId = decodedToken.userId
	next()
}