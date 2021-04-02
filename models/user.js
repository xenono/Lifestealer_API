const mongoose = require("mongoose")

const Schema = mongoose.Schema

const userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
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
	city: {
		type: String,
		default: "Not specified"
	},
	country: {
		type: String,
		default: "Not specified"
	},
	job: {
		type: String,
		default: "Not specified"
	},
	profileImage: {
		type: String,
		required: true,
		default: "/images/defaultProfilePicture.jpg"
	},
	backgroundImage: {
		type: String,
		required: true,
		default: "/images/defaultBackgroundPicture.jpg"
	},
	introduction: {
		type: String,
		default: "Not specified."
	},
	workDescription: {
		type: String,
		default: "Not specified."
	},
	hobbyDescription: {
		type: String,
		default: "Not specified."
	}

})

module.exports = mongoose.model("User", userSchema)