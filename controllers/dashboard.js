const Post = require('../models/post')
const User = require('../models/user')
const { validationResult } =  require('express-validator')

exports.getPosts = async (req,res,next) => {

	try {
		let posts = await Post.find()

		posts = posts.map(({creator,title,content,image,background,usersBlood,createdAt,updatedAt, _id,comments}) => {
			return {
				creator,title,content,image,background,createdAt,updatedAt,_id,comments,
				usersBlood: usersBlood.length,
				isUserBlood: usersBlood.includes(req.userId)
			}
		})
		res.json({posts})
	} catch(err) {
		console.log(err)
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

exports.dropABlood = async (req, res, next) => {
	const { postId,isActive } = req.body
	try {
		const post = await Post.findById(postId)
		if(!post){
			return next(new Error("Post not found!"))
		}
		if(isActive){
			if(post.usersBlood.includes(req.userId)){
				return next(new Error("There already is a blood of this user."))
			}
			post.usersBlood.push(req.userId)
		} else {
			post.usersBlood = post.usersBlood.filter(id => 	id !== req.userId.toString())
		}
		await post.save()
		res.json({})

	} catch (err){
		next(err)
	}
}

exports.addComment = async (req,res,next) => {
	const {postId,text} = req.body

	const post = await Post.findById(postId)
	if(!post){
		return next(new Error("Post not found!"))
	}
	if(!text){
		return next(new Error("Comment cannot be empty!"))
	}
	const author = await User.findById(req.userId)
	const comment = {
		text,
		author : {
			userId: author._id,
			name: author.name,
			lastname: author.lastname,
			profileImage: author.profileImage
		}
	}
	post.comments.push(comment)
	await post.save()
	res.json(comment)
}