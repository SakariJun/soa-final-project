const router = require('express').Router();

const { getPersonalInformationController } = require('../controllers/get-personal-information.controller');
const {verifyAccessTokenMiddleware} = require('../middlewares/json-web-token.middleware');

router.get('/',verifyAccessTokenMiddleware, getPersonalInformationController);

module.exports = router
