const express = require('express')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const dotenv = require('dotenv').config()
const mongoose = require("mongoose")


const app = express()

const authRoutes = require('./routes/auth')
const dashboardRoutes = require('./routes/dashboard')

// Middlewares
app.use(bodyParser.json())
app.use(cookieParser())

app.use((req,res,next) => {
	res.setHeader('Access-Control-Allow-Methods', '*')
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization,X-CSRF-Token, csrf-token')
	res.setHeader("Access-Control-Allow-Credentials", "true");

	next()
})

// Routes
app.use(authRoutes)
app.use(dashboardRoutes)

app.use((error,req,res,next) => {
	const statusCode = error.statusCode || 500
	const message = error.message
	const data = error.data
	res.status(statusCode).json({message, success: false})
})

mongoose.connect(process.env.MONGODB_CONNECTION, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
	.then(() => {
		app.listen(8080)
	})
	.catch(err => {
		console.log(err)
	})

