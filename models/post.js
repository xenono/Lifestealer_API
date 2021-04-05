const mongoose = require("mongoose")

const Schema = mongoose.Schema

const postSchema = new Schema({
	creator: {
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		name: {
			type: String,
			required: true,

		},
		lastname: {
			type: String,
			required: true,
		},
		profileImage:{
			type: String,
			required: true
		}

	},
	comments: [{
		text: {
			type: String,
			required: true,
		},
		author: {
			userId: {
				type: Schema.Types.ObjectId,
				ref: "User",
				required: true
			},
			name: {
				type: String,
				required: true,

			},
			lastname: {
				type: String,
				required: true,
			},
			profileImage:{
				type: String,
				required: true
			}
		}
	}],
	title: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	image: {
		type: String,
	},
	background: {
		type: String,
		required: true,
	},
	usersBlood: [ { type: String}]
},{timestamps: true})

module.exports = mongoose.model("Post", postSchema)