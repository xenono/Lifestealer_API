const mongoose = require("mongoose")

const Schema = mongoose.Schema

const chatSchema = new Schema({
    user_1: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    user_2: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    messages: [{
        userId: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        }
    }]
})

module.exports = mongoose.model("Chat", chatSchema)