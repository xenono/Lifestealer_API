const User = require("../models/user")
const Chat = require("../models/chat")
const {validationResult} = require("express-validator")
const io = require('../socket')

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        const {
            name,
            lastname,
            profileImage,
            course,
            country,
            city,
            backgroundImage,
            introduction,
            projectsDescription,
            hobbyDescription
        } = user
        res.json({
            name,
            lastname,
            profileImage,
            course,
            country,
            city,
            backgroundImage,
            introduction,
            projectsDescription,
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
    if (!errors.isEmpty()) {
        const error = new Error(errors.array()[0].msg)
        error.statusCode = 422
        return next(error)
    }
    const files = req.files
    const {city, country, course, projectsDescription, introduction, hobbyDescription} = req.body
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
        user.course = course ? course : user.course
        user.projectsDescription = projectsDescription ? projectsDescription : user.projectsDescription
        user.introduction = introduction ? introduction : user.introduction
        user.hobbyDescription = hobbyDescription ? hobbyDescription : user.hobbyDescription
        user.backgroundImage = backgroundImage ? backgroundImage : user.backgroundImage
        user.profileImage = profileImage ? profileImage : user.profileImage
        await user.save()
        res.json({
            city: user.city,
            country: user.country,
            course: user.course,
            projectsDescription: user.projectsDescription,
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
            return next(error)
        }
        if (userId === req.userId) {
            const error = new Error("This is logged user")
            error.statusCode = 422
            return next(error)
        }
        const {
            name,
            lastname,
            course,
            projectsDescription,
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
            course,
            projectsDescription,
            hobbyDescription,
            profileImage,
            backgroundImage,
            introduction,
            city,
            country,
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
            .filter(user => (user.name + user.lastname).toLowerCase()
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
exports.addFriend = async (req, res, next) => {
    const {userId} = req.body
    try {
        const addedUser = await User.findById(userId)
        if (!addedUser) {
            return next(new Error("User not found!"))
        }
        const loggedUser = await User.findById(req.userId)
        const newLoggedUserFriend = {
            _id: addedUser._id,
            name: addedUser.name,
            lastname: addedUser.lastname,
            profileImage: addedUser.profileImage
        }
        const newAddedUserFriend = {
            _id: loggedUser._id,
            name: loggedUser.name,
            lastname: loggedUser.lastname,
            profileImage: loggedUser.profileImage
        }

        loggedUser.friendsList.push(newLoggedUserFriend)
        addedUser.friendsList.push(newAddedUserFriend)
        const newChat = new Chat({
            user_1: loggedUser._id,
            user_2: addedUser._id,
        })
        await newChat.save()
        await loggedUser.save()
        await addedUser.save()
        res.json(newFriend)
    } catch (err) {
        next(err)
    }
}

exports.getFriends = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            return next(new Error("User not found!"))
        }

        res.json(user.friendsList)
    } catch (err) {
        next(err)
    }
}

exports.getChat = async (req,res,next) => {
    const loggedUserId = req.userId
    const userInChatId = req.body.userId
    try{
        const chatDoc = await Chat.findOne({user_1: {$in: [loggedUserId, userInChatId]}, user_2: {$in: [loggedUserId, userInChatId]}})
        if(chatDoc){
            return res.status(200).json(chatDoc.messages)
        }
    } catch(err){
        next(err)
    }
}

exports.addMessage = async (req, res, next) => {
    const loggedUserId = req.userId
    const userInChatId = req.body.userId
    const message = req.body.message
    console.log(message)
    try{
        const chatDoc = await Chat.findOne({user_1: {$in: [loggedUserId, userInChatId]}, user_2: {$in: [loggedUserId, userInChatId]}})
        chatDoc.messages.push({userId: loggedUserId, text:message})
        await chatDoc.save()
        io.getIO().emit("updateChats", {action: "updateChats"})
        console.log('emit')
        return res.status(200)
    } catch(err){
        next(err)
    }
}