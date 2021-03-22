const express = require('express')
const router = express.Router()

const { isAuth } = require('../middlewares/isAuth')

const dashBoardController = require('../controllers/dashboard')

router.get('/posts', isAuth, dashBoardController.getPosts)
router.post('/createPost', isAuth, dashBoardController.createPost)

module.exports = router