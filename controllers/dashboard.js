const Post = require('../models/post')
const User = require('../models/user')


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
	const {title, image, content, background}  = req.body
	try {
		const user = await User.findById(req.userId)
		if (!user) {
			const error = new Error("User does not exist.")
			error.statusCode = 404
			next(error)
		}
		const post = new Post({
			title,
			image,
			content,
			background,
			creator: {
				userId: user._id,
				name: user.name ,
				lastname: user.lastname
			}
		})
		await post.save()
		res.json({success: true})
	}catch(err) {
		next(err)
	}
}