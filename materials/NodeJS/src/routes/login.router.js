const router = require('express').Router()

const { validateLoginController } = require('../controllers/login.controller')
const validatorLogin = require('../validators/login.validator')

router.post('/', validatorLogin, validateLoginController)

module.exports = router
