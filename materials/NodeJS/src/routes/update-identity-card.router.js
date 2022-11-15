const router = require('express').Router()

const { getFormDataToRequestMiddleware } = require('../middlewares/multiparty.middleware');
const { updateIdentityCardController } = require('../controllers/update-identity-card.controller');

router.put('/', getFormDataToRequestMiddleware, updateIdentityCardController);

module.exports = router