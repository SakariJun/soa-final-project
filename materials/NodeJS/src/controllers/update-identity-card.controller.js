const updateIdentityCardService = require('../services/update-identity-card.service')

const updateIdentityCardController = async (req, res, next) => {
	// Gọi hàm validate input từ service
	const isInputValid = await updateIdentityCardService.validateUserInformation(req.files)

	if (!isInputValid.status) {
		return res.status(400).json(isInputValid);
	}

	// Validate thành công -> Tiến hành thao tác đăng ký
	const updateIdentityCardResult = await updateIdentityCardService.updateIdentityCard(req.files, req.payload);

	if (!updateIdentityCardResult.status) {
		return res.status(400).json(updateIdentityCardResult);
	}

	return res.status(201).json(updateIdentityCardResult);
}

module.exports = { updateIdentityCardController }
