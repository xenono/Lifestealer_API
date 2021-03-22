const express = require('express')
const router = express.Router()

const User = require("../models/user")

const {isAuth} = require('../middlewares/isAuth')

const {body} = require("express-validator")

const dotenv = require('dotenv').config()


module.exports = router