const { validateEmail, validatePhoneNumber } = require('../utils/validate-helper');
const { randomString } = require('../utils/random-helper');
const registerRepos = require('../repos/register.repos');
const { sendMail } = require('../utils/send-mail-util');
const uniqueFilename = require('unique-filename');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

async function register(req) {
    // Lấy id tự tăng tiếp theo - Không random vì nếu số lượng User nhiều 
    // -> Random sẽ Trùng ID chẳng lẽ cứ random rồi lại query xuống db check 
    // -> nếu trùng lại random hoài tới khi hết trùng ???? -> Giảm performance
    let username = await registerRepos.getMaxID();

    if (username[0]['MAX(account_id)'] == null) {
        username = 1;
    } else {
        username = username[0]['MAX(account_id)'] + 1;
    }

    const password = randomString(6);

    username = username.toString().padStart(10, "0");
    req.body.username = username;
    req.body.password = password;
    req.body.hashPassword = await bcrypt.hash(req.body.password, 10);

    // Insert vào 2 bảng Account và DigitalWallet để lấy khóa ngoại
    // Chạy promise.all để Promise song song tăng performance
    const foreignKeys = await Promise.all([
        registerRepos.insertAccount(req.body.username, req.body.hashPassword),
        registerRepos.insertDigitalWallet(),
    ]);

    const accountID = foreignKeys[0];
    const walletID = foreignKeys[1];

    const uploadIdentityCardResult = uploadIdentityCard(req.files, username);

    if (!uploadIdentityCardResult.status) {
        return { status: false, err: uploadIdentityCardResult.message, message: "Có lỗi trong quá trình upload ảnh CMND ! Vui lòng thử lại sau !" };
    }

    const insertedUser = await registerRepos.insertUserInformation({
        phone_number: req.body.phone_number,
        email: req.body.email,
        full_name: req.body.full_name,
        day_of_birth: req.body.day_of_birth,
        address: req.body.address,
        identity_card_front: uploadIdentityCardResult.image_name[0],
        identity_card_back: uploadIdentityCardResult.image_name[1],
        user_account_id: accountID.id,
        user_wallet_id: walletID.id,
    });

    const insertOTP = await registerRepos.insertOTPData(insertedUser.id.insertId)
        //const sendMailResult = await sendAccountInformationToUserEmail(req.body.email, req.body.username, req.body.password);

    // if (!sendMailResult.status) {
    //     return { status: false, message: "Có lỗi trong quá trình gửi thông tin tài khoản đến mail của người dùng ! Vui lòng thử lại sau !" };
    // }

    return { status: true, message: "Đăng ký thành công ! Vui lòng kiểm tra email để nhận tên tài khoản và mật khẩu !", account: { username: req.body.username, password: req.body.password } };
}

// Validate đầu vào
async function validateUserInformation(req) {
    const fields = req.body;

    if (!fields.phone_number || !fields.email || !fields.full_name || !fields.day || !fields.month || !fields.year || !fields.address) {
        return {
            status: false,
            message: "Vui lòng nhập đầy đủ thông tin được yêu cầu để đăng ký tài khoản !",
        };
    }

    let phone_number = fields.phone_number[0];
    let email = fields.email[0];
    let full_name = fields.full_name[0];
    let day = fields.day[0];
    let month = fields.month[0];
    let year = fields.year[0];
    let address = fields.address[0];


    if (
        phone_number.trim() === "" ||
        email.trim() === "" ||
        full_name.trim() === "" ||
        day.trim() === "" ||
        month.trim() === "" ||
        year.trim() === "" ||
        address.trim() === ""
    ) {
        return {
            status: false,
            message: "Vui lòng nhập đầy đủ thông tin được yêu cầu để đăng ký tài khoản ! Không thể để trống bất kỳ trường nào !",
        };
    }

    if (!validatePhoneNumber(phone_number)) {
        return {
            status: false,
            message: "Số điện thoại không hợp lệ ! Vui lòng nhập lại !",
        };
    }

    if (!validateEmail(email)) {
        return {
            status: false,
            message: "Định dạng email không hợp lệ ! Vui lòng nhập lại !",
        };
    }

    if (isNaN(day) || parseInt(day) <= 0 || parseInt(day) > 31) {
        return {
            status: false,
            message: "Ngày sinh không hợp lệ, chỉ có thể nằm trong khoảng từ 1 đến 31 ! Vui lòng nhập lại !",
        };
    }

    if (isNaN(month) || parseInt(month) <= 0 || parseInt(month) > 12) {
        return {
            status: false,
            message: "Tháng sinh không hợp lệ, chỉ có thể nằm trong khoảng từ 1 đến 12 ! Vui lòng nhập lại !",
        };
    }

    if (isNaN(year) || parseInt(year) <= 0 || parseInt(year) >= new Date().getFullYear()) {
        return {
            status: false,
            message: "Năm sinh không hợp lệ ! Vui lòng nhập lại !",
        };
    }

    const day_of_birth = new Date(year, month - 1, day); // Tháng trong JS Date bắt đầu từ 0 -> 11

    if (day_of_birth === "Invalid Date") {
        return {
            status: false,
            message: "Định dạng ngày sinh không hợp lệ ! Vui lòng nhập lại !",
        };
    }

    if (day_of_birth.getTime() >= new Date().getTime()) {
        return {
            status: false,
            message: "Ngày sinh không hợp lệ, ngày sinh không thể lớn hơn ngày hiện tại ! Vui lòng nhập lại !",
        };
    }

    // Gọi tới repos truy vấn CSDL kiểm tra có trùng Email hoặc số điện thoại không
    const validateEmailOrPhone = await registerRepos.isExistEmailOrPhone(email, phone_number);

    if (!validateEmailOrPhone.status) {
        return { status: false, message: "Có lỗi trong quá trình xác thực email và số điện thoại ! Vui lòng thử lại sau !" };
    }

    const result_email = validateEmailOrPhone.result[0][0];
    const result_phone_number = validateEmailOrPhone.result[1][0];

    if (result_phone_number.length !== 0) {
        return {
            status: false,
            message: "Số điện thoại đã tồn tại vui lòng chọn số điện thoại khác !",
        };
    }

    if (result_email.length !== 0) {
        return {
            status: false,
            message: "Địa chỉ email đã tồn tại vui lòng chọn địa chỉ email khác !",
        };
    }

    fields.phone_number[0] = phone_number.trim();
    fields.email[0] = email.trim();
    fields.full_name[0] = full_name.trim();
    fields.day_of_birth = day_of_birth;
    fields.address[0] = address.trim();

    // Validate đuôi mở rộng + độ lớn file ảnh upload có hợp lệ không
    const validateIdentityCardResult = validateIdentityCard(req.files);

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

function uploadIdentityCard(files, username) {
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

        fs.existsSync(userDir) || fs.mkdirSync(userDir);

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

// Truyền Email cần gửi (Của người đăng ký) - Tài khoản - Mật khẩu
function sendAccountInformationToUserEmail(email, username, password) {
    // Xử lý gửi mail trong đây.
    const subject = "Thông tin tài khoản - Hệ thống ví điện tử ABC";
    const mailContent = `Xin cảm ơn bạn đã đăng ký tài khoản hệ thống ví điện tử ABC ! Tên tài khoản của bạn là: ${username} | Mật khẩu của bạn là: ${password} !`

    return sendMail(email, subject, mailContent);
}

module.exports = { register, validateUserInformation }