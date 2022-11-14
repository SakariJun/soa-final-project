const { verifyAccessTokenMiddleware } = require('../middlewares/jwt.middleware');

const router = require('express').Router();
const userController = require('../controllers/user.controller');

router.post('/login', userController.UserLoginController);
router.post('/register', userController.UserRegisterController);
router.put('/update-user-balance', verifyAccessTokenMiddleware, userController.UpdateUserBalanceController);
router.get('/get-user-information', verifyAccessTokenMiddleware, userController.GetUserInformationController);

module.exports = router;
