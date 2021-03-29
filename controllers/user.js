const User = require("../models/user")

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
	const files = req.files
	const {city, country, job, workDescription, introduction, hobbyDescription} = req.body
	let backgroundImage, profileImage
	if (files && files[0]) {
		backgroundImage = req.files[0].path.replace("\\", "/")
	}
	if (files && files[1]) {
		profileImage = req.files[1].path.replace("\\", "/")
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