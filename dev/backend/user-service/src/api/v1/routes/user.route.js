const { verifyAccessTokenMiddleware } = require('../middlewares/jwt.middleware');

const { addUserValidator, loginValidator } = require('../validators');

const router = require('express').Router();
const userController = require('../controllers/user.controller');

router.post('/login', loginValidator, userController.LoginController);

// router.post('/add-user', verifyAccessTokenMiddleware, addUserValidator, userController.AddUserController);
router.post('/add-user', addUserValidator, userController.AddUserController);

// router.get('/get-user-information', verifyAccessTokenMiddleware, userController.GetUserInformationController);

module.exports = router;
