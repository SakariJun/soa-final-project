const createError = require('http-errors')
const express = require('express')
require('dotenv').config()

const configs = require('./configs')
const routes = require('./routes')

const PORT = process.env.PORT || 3000
const app = express()

configs(app)
routes(app)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
	// Handle if csrf token is invalid then return json formated error
	if (err.code === 'EBADCSRFTOKEN') {
		return res.status(403).json({ status: false, status_code: 403, message: err.message })
		// OR set status code and error message to req.locals to render on error page
	}

	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(400).json({ status: false, status_code: 400, message: err.message })
})

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
	console.log(`
    PORT
    - api: 46789
    - ui: 46787
    - phpmyadmin: 46786
    - mysql: 46785`)
})
