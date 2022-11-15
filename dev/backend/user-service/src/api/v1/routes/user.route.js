const { verifyAccessTokenMiddleware } = require('../middlewares/jwt.middleware');

const { addUserValidator, loginValidator } = require('../validators');

const router = require('express').Router();
const userController = require('../controllers/user.controller');

router.post('/login', loginValidator, userController.LoginController);

module.exports = router;
