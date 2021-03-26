const express = require('express')
const router = express.Router()
const {body} = require("express-validator")

const dotenv = require('dotenv').config()

const User = require("../models/user")

const {isAuth} = require('../middlewares/isAuth')

const userController = require('../controllers/user')

router.get('/user', isAuth, userController.getUser)

router.post('/editUser', isAuth, userController.editUser)

module.exports = router