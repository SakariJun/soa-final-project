const { getPersonalInformationService } = require('../services/get-personal-information.service')

const getPersonalInformationController = async(req, res, next) => {
    const getPersonalInformationResult = await getPersonalInformationService(req.payload);

    if (!getPersonalInformationResult.status) {
        return res.status(400).json(getPersonalInformationResult);
    }

    return res.status(200).json(getPersonalInformationResult);
}

module.exports = { getPersonalInformationController }