const router = require('express').Router()

const { getFormDataToRequestMiddleware } = require('../middlewares/multiparty.middleware');
const { registerController } = require('../controllers/register.controller');

router.post('/', getFormDataToRequestMiddleware, registerController);

module.exports = router