const User = require("../models/user")
const { validationResult } = require("express-validator")

exports.getUser = async (req, res, next) => {
	try {
		const user = await User.findById(req.userId)
		const {
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
		} = user
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
		if (!err.statusCode)
			err.statusCode = 500
		next(err)
	}
}

exports.editUser = async (req, res, next) => {
	const errors = validationResult(req)
	if(!errors.isEmpty()){
		const error = new Error(errors.array()[0].msg)
		error.statusCode = 422
		return next(error)
	}
	const files = req.files
	const {city, country, job, workDescription, introduction, hobbyDescription} = req.body
	let backgroundImage, profileImage
	if (files['backgroundImage'] && files['backgroundImage'][0]) {
		backgroundImage = "/" + files['backgroundImage'][0].path.replace("\\", "/")
	}
	if (files['profileImage'] && files['profileImage'][0]) {
		profileImage = "/" + files['profileImage'][0].path.replace("\\", "/")
	}

	try {
		const user = await User.findById(req.userId)

		if (!user) {
			const error = new Error("User not found.")
			error.statusCode = 404
			return next(error)

		}

		user.city = city ? city : user.city
		user.country = country ? country : user.country
		user.job = job ? job : user.job
		user.workDescription = workDescription ? workDescription : user.workDescription
		user.introduction = introduction ? introduction : user.introduction
		user.hobbyDescription = hobbyDescription ? hobbyDescription : user.hobbyDescription
		user.backgroundImage = backgroundImage ? backgroundImage : user.backgroundImage
		user.profileImage = profileImage ? profileImage : user.profileImage
		await user.save()
		res.json({
			city: user.city,
			country: user.country,
			job: user.job,
			workDescription: user.workDescription,
			hobbyDescription: user.hobbyDescription,
			profileImage: user.profileImage,
			backgroundImage: user.backgroundImage,
			introduction: user.introduction
		})
	} catch (err) {
		next(err)
	}
}

exports.getProfile = async (req, res, next) => {
	const {userId} = req.params
	try {
		const user = await User.findById(userId)
		if (!user) {
			const error = new Error("User not found!")
			error.statusCode = 404
			next(error)
		}
		const {
			name,
			lastname,
			job,
			workDescription,
			hobbyDescription,
			profileImage,
			backgroundImage,
			introduction,
			city,
			country
		} = user
		res.json({
			name,
			lastname,
			job,
			workDescription,
			hobbyDescription,
			profileImage,
			backgroundImage,
			introduction,
			city,
			country
		})
	} catch (err) {
		next(err)
	}

}

exports.findProfile = async (req, res, next) => {
	const {searchFilter} = req.body
	try {
		const users = await User.find()
		const matchUsers = users
			.filter(user => (user.name+ user.lastname).toLowerCase()
				.includes(searchFilter.toLowerCase()))
			.map(user => {
				return {
					id: user._id,
					name: user.name,
					lastname: user.lastname,
					profileImage: user.profileImage
				}
			})
		res.json(matchUsers)
	} catch (err) {
		next(err)
	}
}