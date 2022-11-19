const { getAccountRoleByUsername } = require('../repos/get-personal-information.repos');
const DB_CONSTANTS = require('../utils/database-constant-number.utils');

// Xác thực quyền admin
const verifyAdminRoleMiddleware = async (req, res, next) => {
	// Check if the request is called by AJAX - Fetch and expect to receive JSON Response
	const accountRole = await getAccountRoleByUsername(req.payload.username);

    let accountRoleResult = accountRole[0];

    // Not found any account with Username
    if (accountRoleResult.length === 0) {
        return res.status(403).json({
            status: false,
            message: "Tên tài khoản không tồn tại ! Vui lòng thử lại !"
        });
    }

    accountRoleResult = accountRoleResult[0];

    if (accountRoleResult.role !== DB_CONSTANTS.ACCOUNT_ROLE_ADMIN 
        && req.payload.role !== DB_CONSTANTS.ACCOUNT_ROLE_ADMIN) {
        return res.status(403).json({
            status: false,
            message: "Bạn không có quyền sử dụng tính năng này !"
        });
    }
    next();
}

module.exports = { verifyAdminRoleMiddleware }