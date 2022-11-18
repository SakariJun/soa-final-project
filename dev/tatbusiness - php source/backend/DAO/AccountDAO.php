<?php
require_once 'databaseConnection.php';
require_once 'UserDAO.php';

// Function changePassword: Dùng cho trường hợp khi tài khoản vừa được tạo hoặc vừa được reset password
function changePassword($username, $password)
{
    $sql_Statement = 'SELECT * FROM account WHERE Username = ?';
    $connection = createConnection();

    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('s', $username);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Can't execute command !");
    };

    $result = $statement->get_result();

    if ($result->num_rows == 0) {
        return array('status' => false, 'errorMessage' => "Sai tên tài khoản !!!");
    };

    $password_hashed = password_hash($password, PASSWORD_DEFAULT);

    $sql_Statement = "UPDATE account SET Password = ?, Activated = b'1' WHERE Username = ?";
    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('ss', $password_hashed, $username);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Can't execute command !");
    };

    if ($statement->affected_rows == 0) {
        return array('status' => false, 'errorMessage' => "Đổi mật khẩu thất bại !");
    }

    require_once 'MixableDAO.php';
    SetSession($username);

    return array('status' => true, 'message' => 'Đổi mật khẩu thành công');
}

// Function userChangePassword: Dùng cho trường hợp người dùng đã đăng nhập thành công và có nhu cầu tự đổi mật khẩu
function userChangePassword($username, $oldPassword, $newPassword)
{
    $sql_Statement = 'SELECT Password FROM account WHERE Username = ?';
    $connection = createConnection();

    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('s', $username);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Can't execute command !");
    };

    $result = $statement->get_result();

    if ($result->num_rows == 0) {
        return array('status' => false, 'errorMessage' => "Sai tên tài khoản !!!");
    };

    $data = $result->fetch_assoc();

    $hashed_password = $data['Password'];

    if (!password_verify($oldPassword, $hashed_password)) {
        return array('status' => false, 'errorMessage' => "Mật khẩu cũ không chính xác !!!");
    };

    // Hash password mới và update vào db
    $password_hashed = password_hash($newPassword, PASSWORD_DEFAULT);

    $sql_Statement = 'UPDATE account SET Password = ? WHERE Username = ?';
    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('ss', $password_hashed, $username);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Can't execute command !");
    };

    if ($statement->affected_rows == 0) {
        return array('status' => false, 'errorMessage' => "Đổi mật khẩu thất bại !");
    }

    return array('status' => true, 'message' => 'Đổi mật khẩu thành công');
}

// Function login: Validate login
function login($username, $password)
{
    $sql_Statement = 'SELECT * FROM account WHERE Username = ?';
    $connection = createConnection();

    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('s', $username);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Can't execute command !");
    };

    $result = $statement->get_result();

    if ($result->num_rows == 0) {
        return array('status' => false, 'errorMessage' => "Tài khoản không tồn tại");
    };

    $data = $result->fetch_assoc();

    $hashed_password = $data['Password'];

    if (!password_verify($password, $hashed_password)) {
        return array('status' => false, 'errorMessage' => "Sai tên tài khoản hoặc mật khẩu !!!");
    };

    require_once 'MixableDAO.php';
    SetSession($username);

    if ($data['Activated'] == 0) {
        return array('status' => true, 'errorMessage' => "Bạn cần thay đổi mật khẩu trước khi được phép truy cập vào trang chủ !!!", 'code' => 300);
    };

    // Success
    return array('status' => true, 'result' => $data);
}

// Function Update request reset password: 
// Dùng cho trường hợp nhân viên quên mật khẩu và muốn reset mật khẩu
// Cần gửi tên tài khoản, email và số điện thoại nhân viên
function requestResetPassword($username, $userID)
{
    $sql_Statement = "UPDATE account SET RequestResetPassword = b'1' WHERE Username = ? AND UserID = ?";
    $connection = createConnection();

    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('ss', $username, $userID);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Can't execute command !");
    };

    if ($statement->affected_rows == 0) {
        return array('status' => false, 'errorMessage' => "Không tìm thấy tài khoản tương ứng với thông tin nhân viên Hoặc đã gửi yêu cầu thành công !!!");
    };

    // Success
    return array('status' => true, 'message' => 'Gửi yêu cầu reset mật khẩu thành công');
}

function getAccountByID($id)
{
    $sql = 'select * from account where UserID = ?';
    $conn = createConnection();
    $stm = $conn->prepare($sql);
    $stm->bind_param('s', $id);
    if (!$stm->execute()) {
        return json_encode(array('code' => 0, 'message' => 'Can not execute command.'));
    }
    $result = $stm->get_result();
    if ($result->num_rows == 0) {
        return json_encode(array('code' => 0, 'message' => 'This account does not exist.'));
    }
    $data = $result->fetch_all();
    return json_encode(array('code' => 1, 'message' => 'Success.', 'data' => $data));
}

function createAccount($username, $fullname, $email, $dob, $phonenumber, $salary, $department, $gender)
{
    $userID = generateUserID();

    //check userame
    $sql = 'select * from account where Username = ?';
    $conn = createConnection();
    $stm = $conn->prepare($sql);
    $stm->bind_param('s', $username);
    if (!$stm->execute()) {
        return json_encode(array('status' => 0, 'message' => 'Can not execute command.'));
    }
    $result = $stm->get_result();
    if ($result->num_rows > 0) {
        return json_encode(array('status' => 7, 'message' => 'this username has existed.'));
    }

    //check email
    $sql = 'select * from user where Email = ?';
    $conn = createConnection();
    $stm = $conn->prepare($sql);
    $stm->bind_param('s', $email);
    if (!$stm->execute()) {
        return json_encode(array('status' => 0, 'message' => 'Can not execute command.'));
    }
    $result = $stm->get_result();

    if ($result->num_rows > 0) {
        return json_encode(array('status' => 9, 'message' => 'this email has existed.'));
    }

    //check phonenum
    $sql = 'select * from user where PhoneNumber = ?';
    $conn = createConnection();
    $stm = $conn->prepare($sql);
    $stm->bind_param('s', $phonenumber);
    if (!$stm->execute()) {
        return json_encode(array('status' => 0, 'message' => 'Can not execute command.'));
    }
    $result = $stm->get_result();
    if ($result->num_rows > 0) {
        return json_encode(array('status' => 10, 'message' => 'this Phone number has existed.'));
    }

    $sql = 'insert into user(UserID, FullName, Email, DOB, PhoneNumber, DepartmentID, Gender, Salary) values (?, ?, ?, ?, ?, ?,?, ?)';
    $conn = createConnection();
    $stm = $conn->prepare($sql);
    $stm->bind_param('sssssssi', $userID, $fullname, $email, $dob, $phonenumber, $department, $gender, $salary);
    if (!$stm->execute()) {
        return json_encode(array('status' => 3, 'message' => 'Can not execute command on user.'));
    }

    $hashed_password = password_hash($username, PASSWORD_DEFAULT);

    $sql = 'insert into account(UserID, Username, Password) values (?,?,?)';
    $conn = createConnection();
    $stm = $conn->prepare($sql);
    $stm->bind_param('sss', $userID, $username, $hashed_password);

    if (!$stm->execute()) {
        return json_encode(array('status' => 3, 'message' => 'Can not execute command on account.'));
    }

    $sql_Statement = 'INSERT INTO absence(UserID, MaxAbsenceDay) VALUES(?, ?)';
    $role = 'Nhân viên';
    $connection = createConnection();

    $maxAbsenceDay = 0;
    if ($role == 'Nhân viên') {
        $maxAbsenceDay = 12;
    } else if ($role == 'Trưởng phòng') {
        $maxAbsenceDay = 15;
    } else {
        return json_encode(array('status' => false, 'errorMessage' => "Sai chức vụ !"));
    }

    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('ss', $userID, $maxAbsenceDay);

    if (!$statement->execute()) {
        return json_encode(array('status' => false, 'errorMessage' => "Xảy ra lỗi khi thêm thông tin nghỉ phép hoặc mã nhân viên đã có thông tin nghỉ phép !"));
    };

    if ($statement->affected_rows == 0) {
        return json_encode(array('status' => false, 'errorMessage' => "Thêm thông tin nghỉ phép không thành công !!!"));
    };

    return json_encode(array('status' => 6, 'message' => 'Added successfully.'));
}

function resetPassword($id)
{
    $sql1 = 'select Username from account where UserID = ?';
    $conn = createConnection();
    $stm1 = $conn->prepare($sql1);

    $stm1->bind_param('s', $id);

    if (!$stm1->execute()) {
        return json_encode(array('status' => 0, 'message' => 'Can not execute command.'));
    }
    $result = $stm1->get_result();
    if ($result->num_rows == 0) {
        return json_encode(array('status' => 0, 'message' => 'This account does not exist.'));
    }
    $data = $result->fetch_all();
    $jdata = json_encode($data);
    $data = ltrim($jdata, '[["');
    $username = rtrim($data, '"]]');

    $new_hashed_password = password_hash($username, PASSWORD_DEFAULT);

    $sql2 = "update account set Password = ?, Activated = b'0', RequestResetPassword = 0 where Username = ?";
    $conn = createConnection();
    $stm2 = $conn->prepare($sql2);
    $stm2->bind_param('ss', $new_hashed_password, $username);

    if (!$stm2->execute()) {
        return json_encode(array('code' => 0, 'message' => 'Can not execute command.'));
    }
    return json_encode(array('status' => 1, 'message' => 'success.'));
}

function loadForgotAccountFirst()
{
    $sql = 'select * from account order by RequestResetPassword desc';
    $conn = createConnection();

    $result = $conn->query($sql);
    if (!$result) {
        return json_encode(array('status' => 0, 'message' => $conn->error));
    }
    $data = $result->fetch_all();
    return json_encode(array('status' => 1, 'message' => 'Success.', 'data' => $data));
}

function isExistAccount($ID)
{
    $sql = 'select * from account where UserID = ?';
    $conn = createConnection();
    $stm = $conn->prepare($sql);
    $stm->bind_param('s', $ID);
    if (!$stm->execute()) {
        return false;
    }
    $result = $stm->get_result();
    if ($result->num_rows == 0) {
        return false;
    }
    return true;
}
