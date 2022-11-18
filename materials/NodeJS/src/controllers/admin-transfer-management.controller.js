const adminTransferManagementService = require('../services/admin-transfer-management.service');

const getAllWaitingTransferController = async(req, res, next) => {

    const getAllWaitingTransferResult = await adminTransferManagementService.getWaitingTransfer(req.params.id)

    if (!getAllWaitingTransferResult.status) {
        return res.status(400).json(getAllWaitingTransferResult);
    }

    return res.status(201).json(getAllWaitingTransferResult);
}

const updateTransferStateController = async(req, res, next) => {

    // Lấy thông tin transaction
    const getAllWaitingTransferResult = await adminTransferManagementService.getWaitingTransfer(req.params.id)

    if (!getAllWaitingTransferResult.status) {
        return res.status(400).json(getAllWaitingTransferResult);
    }

    const updateTransferStateResult = await adminTransferManagementService.updateTransferState(getAllWaitingTransferResult.data, req.path.split("/")[3])

    if (!updateTransferStateResult.status) {
        return res.status(400).json(updateTransferStateResult);
    }

    return res.status(201).json(updateTransferStateResult);
}

const getAllWaitingTransferByUserController = async(req, res, next) => {

    const getAllWaitingTransferResult = await adminTransferManagementService.getWaitingTransferByUser(req.params.id)

    if (!getAllWaitingTransferResult.status) {
        return res.status(400).json(getAllWaitingTransferResult);
    }

    return res.status(201).json(getAllWaitingTransferResult);
}

const getMonthlyTransferByUserController = async(req, res, next) => {

    const getMonthlyTransferResult = await adminTransferManagementService.getMonthlyTransferByUser(req.params.id)

    if (!getMonthlyTransferResult.status) {
        return res.status(400).json(getMonthlyTransferResult);
    }

    return res.status(201).json(getMonthlyTransferResult);
}

module.exports = {
    getAllWaitingTransferController,
    updateTransferStateController,
    getAllWaitingTransferByUserController,
    getMonthlyTransferByUserController
}