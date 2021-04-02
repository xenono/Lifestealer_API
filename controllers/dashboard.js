const Post = require('../models/post')
const User = require('../models/user')
const { validationResult } =  require('express-validator')

exports.getPosts = async (req,res,next) => {
	try {
		const posts = await Post.find()
		res.json({posts})
	} catch(err) {
		const error = new Error("Error when loading posts.")
		error.statusCode = 404
		next(error)
	}
}

exports.createPost = async (req, res,next) => {
	const errors = validationResult(req)
	if(!errors.isEmpty()){
		const error = new Error(errors.array()[0].msg)
		error.statusCode = 422
		return next(error)
	}
	const imageUrl = req.files['postImage'] ? "/" + req.files['postImage'][0].path.replace("\\","/") : ""
	// if (!image) {
	// 	const error = new Error("No image provided.")
	// 	error.statusCode = 422
	// 	return next(error)
	// }
	const {title, content, background}  = req.body
	// const imageUrl = image ? "/" + image.path.replace("\\","/") : ""
	try {
		const user = await User.findById(req.userId)
		if (!user) {
			const error = new Error("User does not exist.")
			error.statusCode = 404
			next(error)
		}
		const post = new Post({
			title,
			image: imageUrl,
			content,
			background,
			creator: {
				userId: user._id,
				name: user.name ,
				lastname: user.lastname,
				profileImage: user.profileImage
			}
		})
		await post.save()
		res.json(post)
	} catch(err) {
		next(err)
	}
}