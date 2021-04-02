const express = require('express')
const { body } = require("express-validator")
const router = express.Router()

const { isAuth } = require('../middlewares/isAuth')

const dashBoardController = require('../controllers/dashboard')

router.get('/posts', isAuth, dashBoardController.getPosts)
router.post('/createPost',[
	body("title").trim().not().isEmpty().withMessage("Title is required!"),
	body("content").trim().not().isEmpty().withMessage("Content is required!")
],isAuth, dashBoardController.createPost)

module.exports = router