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
}

exports.editUser = async (req,res,next) => {
	const files = req.files
	const {city, country, job, workDescription, introduction, hobbyDescription} = req.body
	let backgroundImage, profileImage
	if(files[0]){
		backgroundImage = req.files[0].path.replace("\\","/")
	}
	if(files[1]){
		profileImage = req.files[1].path.replace("\\","/")
	}

	try {
		const user = await User.findById(req.userId)

		if(!user){
			console.log(city)

			const error = new Error("User not found.")
			error.statusCode = 404
			return next(error)

		}

		user.city = city
		user.country = country
		user.job = job
		user.workDescription = workDescription
		user.introduction = introduction
		user.hobbyDescription = hobbyDescription
		user.backgroundImage = backgroundImage ? backgroundImage : user.backgroundImage
		user.profileImage = profileImage ? profileImage : user.profileImage
		await user.save()
	} catch(err){
		next(err)
	}
}