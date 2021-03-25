const User = require("../models/user")

exports.getUser = async (req,res,next) => {
	try {
		const user = await User.findById(req.userId)
		const {name, lastname, profileImage, job, country, city, backgroundImage, introduction, workDescription, hobbyDescription } = user
		res.json({
			name,
			lastname,
			profileImage,
			job,
			country,
			city,
			backgroundImage,
			introduction,
			workDescription,
			hobbyDescription
		})
	} catch (err) {
		if(!err.statusCode)
			err.statusCode = 500
		next(err)
	}
	next()
}