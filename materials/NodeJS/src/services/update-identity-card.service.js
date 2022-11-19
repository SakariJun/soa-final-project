const DB_CONSTANTS = require('../utils/database-constant-number.utils');
const updateIdentityCardRepos = require('../repos/update-identity-card.repos');
const uniqueFilename = require('unique-filename');
const path = require('path');
const fs = require('fs');

async function updateIdentityCard(files, payload) {
    const account = await updateIdentityCardRepos.getUpdateIdentityCardUserByUsername(payload.username);

    let accountResult = account[0];

    // Not found any account with Username
    if (accountResult.length === 0) {
        return {
            status: false,
            message: "JWT lỗi không tìm thấy tài khoản !" // Không ghi rõ là sai tên tài khoản để bảo mật + hạn chế dò tên tài khoản
        }
    }

    accountResult = accountResult[0];

    if (accountResult.state !== DB_CONSTANTS.ACCOUNT_STATE_WAITING_UPDATE) {
        return {
            status: false,
            message: "User chỉ được thay đổi ảnh CMND khi Admin yêu cầu upload lại ảnh CMND mới !" // Không ghi rõ là sai tên tài khoản để bảo mật + hạn chế dò tên tài khoản
        }
    }

    const replaceIdentityCardImageResult = replaceIdentityCardImage(files, payload.username, accountResult.identity_card_front, accountResult.identity_card_back);
    if (!replaceIdentityCardImageResult.status) {
        return {
            status: false,
            message: "Có lỗi trong quá trình cập nhật ảnh CMND ! Vui lòng thử lại sau !" // Không ghi rõ là sai tên tài khoản để bảo mật + hạn chế dò tên tài khoản
        }
    }

    const updateIdentityCardResult = await updateIdentityCardRepos.updateIdentityCardUserByUsername(payload.username, replaceIdentityCardImageResult.image_name[0], replaceIdentityCardImageResult.image_name[1]);

    if (updateIdentityCardResult[0].affectedRows === 0) {
        // Generate JWT and send back to client
        return {
            status: false,
            message: "Cập nhật ảnh CMND không thành công ! Vui lòng thử lại sau !"
        };
    }

    return {
        status: true,
        message: "Cập nhật ảnh CMND thành công ! Vui lòng đợi admin duyệt tài khoản !"
    };
}

// Validate đầu vào
async function validateUserInformation(files) {
    // Validate đuôi mở rộng + độ lớn file ảnh upload có hợp lệ không
    const validateIdentityCardResult = validateIdentityCard(files);

    if (!validateIdentityCardResult.status) {
        return validateIdentityCardResult;
    }

    return { status: true, message: "Oke" };
}

function validateIdentityCard(files) {
    // Validate file format and size then save it to user folder
    if (!files.identity_card_front || !files.identity_card_back) {
        return {
            status: false,
            message: "Vui lòng upload ảnh mặt trước và ảnh mặt sau CMND !",
        };
    }

    const identity_card_front = files.identity_card_front[0];
    const identity_card_back = files.identity_card_back[0];

    if (!identity_card_front.originalFilename.trim() === "" || identity_card_front.originalFilename.trim() === "") {
        return {
            status: false,
            message: "Vui lòng upload ảnh mặt trước và ảnh mặt sau CMND !",
        };
    }

    const identity_card_front_file_name = path.parse(
        identity_card_front.originalFilename
    );
    const identity_card_back_file_name = path.parse(
        identity_card_back.originalFilename
    );

    if (!isFileImage(identity_card_front_file_name.ext) ||
        !isFileImage(identity_card_back_file_name.ext)
    ) {
        return {
            status: false,
            message: "Định dạng ảnh CMND không hỗ trợ ! Chỉ hỗ trợ các định dạng (.gif, .jpg, .png, .bmp, .jpeg) !",
        };
    }

    const TEN_MEGABYTE = 10 * 1024 * 1024;

    if (
        identity_card_front.size > TEN_MEGABYTE ||
        identity_card_front.size > TEN_MEGABYTE
    ) {
        return { status: false, message: "Vui lòng upload ảnh dưới 10MB !" };
    }

    return { status: true, message: "Oke" };
}

function isFileImage(fileExtension) {
    const acceptedImageTypes = [".gif", ".jpg", ".png", ".bmp", ".jpeg"];
    return acceptedImageTypes.includes(fileExtension);
}

function replaceIdentityCardImage(files, username, old_identity_card_front, old_identity_card_back) {
    // Lấy SĐT + Email + thời gian hiện tại => hash => Tạo ra thư mục lưu thông tin user
    try {
        const identity_card_front = files.identity_card_front[0];
        const identity_card_back = files.identity_card_back[0];

        const identity_card_front_file_name = path.parse(
            identity_card_front.originalFilename
        );
        const identity_card_back_file_name = path.parse(
            identity_card_back.originalFilename
        );

        const userDir = path.join(__dirname, "..", "..", "public", "uploads", username);

        fs.unlinkSync(path.join(userDir, old_identity_card_front));
        fs.unlinkSync(path.join(userDir, old_identity_card_back));

        // Tạo hash để tạo tên ảnh
        const uniqueNameFront = uniqueFilename(userDir + "Front");
        const uniqueNameBack = uniqueFilename(userDir + "Back");

        // Nối hash với extension của ảnh
        const new_identity_card_front_file_name = uniqueNameFront.split('\\').pop() + identity_card_front_file_name.ext;
        const new_identity_card_back_file_name = uniqueNameBack.split('\\').pop() + identity_card_back_file_name.ext;

        // Đường dẫn mà ảnh sẽ được lưu
        const new_identity_card_front_path = path.join(
            userDir,
            new_identity_card_front_file_name
        );
        const new_identity_card_back_path = path.join(
            userDir,
            new_identity_card_back_file_name
        );

        fs.copyFileSync(identity_card_front.path, new_identity_card_front_path);
        fs.copyFileSync(identity_card_back.path, new_identity_card_back_path);

        return {
            status: true,
            message: "Upload ảnh thành công",
            image_name: [
                new_identity_card_front_file_name,
                new_identity_card_back_file_name,
            ],
        };
    } catch (err) {
        return { status: false, message: err.message };
    }
}

module.exports = { updateIdentityCard, validateUserInformation }