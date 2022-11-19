<?php
require_once 'databaseConnection.php';

function getUserInfo($UID)
{
    $sql_Statement = "SELECT * FROM user WHERE user.UserID = ?";

    $connection = createConnection();

    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('s', $UID);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Lỗi thực thi");
    };

    $result = $statement->get_result();

    if ($result->num_rows == 0) {
        return array('status' => false, 'errorMessage' => "Mã nhân viên không tồn tại.");
    };

    $data = $result->fetch_assoc();

    return array('status' => true, 'result' => $data);
}

function getAccountDetails($username)
{
    $sql_Statement = 'SELECT * FROM account, user, department WHERE user.UserID = account.UserID 
        AND user.DepartmentID = department.DepartmentID AND account.Username = ?';

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

    require_once "UserDAO.php";
    $leader = getUserInfo($data['LeaderID']);
    if (!$leader['status']) {
        $data['LeaderID'] = "Chưa có thông tin";
        $data['LeaderName'] = "Chưa có thông tin";
        $data['LeaderEmail'] = "Chưa có thông tin";
        $data['LeaderPhone'] = "Chưa có thông tin";
    } else {
        $leader = $leader['result'];
        $data['LeaderName'] = $leader['FullName'];
        $data['LeaderEmail'] = $leader['Email'];
        $data['LeaderPhone'] = $leader['PhoneNumber'];
    }

    return array('status' => true, 'result' => $data);
}

function getDirectorDetails($username)
{
    $sql_Statement = 'SELECT * FROM account, user WHERE user.UserID = account.UserID 
        AND account.Username = ?';

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

    return array('status' => true, 'result' => $data);
}

// Đổi avatar : Nhận mã nhân viên + tên hình và lưu vào db roòi lưu tên mới vào session
function changeAvatar($userID, $avatarName)
{
    $sql_Statement = 'UPDATE user SET Avatar = ? WHERE user.UserID = ?';
    $connection = createConnection();

    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('ss', $avatarName, $userID);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Can't execute command !");
    };

    // Vi luon trung ten avatar nen co the khong update 
    if ($statement->affected_rows == 0) {
        return array('status' => true, 'message' => 'Đổi avatar thành công');
    };

    $_SESSION['avatar'] = "./app/users/" . $userID . "/" . $avatarName;
    return array('status' => true, 'message' => 'Đổi avatar thành công');
}

// Check nhân viên có tồn tại hay không dựa trên email và sđt
function checkExistsUserByPhoneNumberAndEmail($email, $phoneNumber)
{
    $sql_Statement = 'SELECT * FROM user WHERE Email = ? AND PhoneNumber = ?';
    $connection = createConnection();

    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('ss', $email, $phoneNumber);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Can't execute command !");
    };

    $result = $statement->get_result();

    if ($result->num_rows == 0) {
        return array('status' => false, 'errorMessage' => "Không tìm được thông tin nhân viên !!!");
    };

    $userID = $result->fetch_assoc()['UserID'];

    return array('status' => true, 'result' => $userID);
}
#endregion

function generateUserID()
{
    $prefix = 'US';
    $prefixLike = $prefix . '%';
    $sql = "SELECT * FROM user ORDER BY UserID DESC LIMIT 1";
    $conn = createConnection();
    $result = $conn->query($sql);
    if (!$result) {

        return json_encode(array('code' => 0, 'message' => $conn->error));
    }
    $data = $result->fetch_all();
    if (count($data) > 0) {
        $id = $data[0][0];
        $id =  substr($id, -3);
        $id = (int)$id;
    } else {
        $id = 0;
    }
    $id = $id + 1;
    if ($id < 10) {
        $body = "00" . "$id";
    } else if ($id < 100) {
        $body = "0" . "$id";
    } else {
        $body = "$id";
    }
    $newDepartmentID = $prefix . $body;
    return $newDepartmentID;
}

function isExistUser($ID)
{
    $sql = 'select * from user where UserID = ?';
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

function isRequested($UID)
{
    $sql = "select * from account where UserID = ? and RequestResetPassword = 0";
    $conn = createConnection();

    $stm = $conn->prepare($sql);
    $stm->bind_param('s', $UID);

    if (!$stm->execute()) {
        return false;
    }

    $result = $stm->get_result();
    if ($result->num_rows == 0) {
        return true;
    }
    return false;
}

function getAllUsers()
{
    $sql = "SELECT * FROM user WHERE user.Role != 'Giám đốc' ORDER BY user.Role desc";

    $conn = createConnection();
    $stm = $conn->prepare($sql);

    if (!$stm->execute()) {
        return json_encode(array('status' => false, 'errorMessage' => 'Lỗi thực thi.'));
    }

    $result = $stm->get_result();

    if ($result->num_rows == 0) {
        return array('status' => false, 'errorMessage' => "Không tìm thấy nhân viên nào.");
    };

    $users = array();

    while ($row = $result->fetch_assoc()) {
        array_push($users, $row);
    }

    return array('status'=> true,'result'=> $users );
}

function getEmployeeByLeaderID($LeaderID)
{
    $sql = "SELECT DepartmentID FROM user WHERE UserID = ? and user.Role = 'Trưởng phòng'";

    $conn = createConnection();
    $stm = $conn->prepare($sql);
    $stm->bind_param('s', $LeaderID);

    if (!$stm->execute()) {
        return json_encode(array('status' => false, 'errorMessage' => 'Lỗi thực thi.'));
    }

    $result = $stm->get_result();
    if ($result->num_rows == 0) {
        return json_encode(array('status' => false, 'errorMessage' => 'Trưởng phòng không tồn tại.'));
    }

    $departmentID = $result->fetch_assoc()['DepartmentID'];

    $sql = "SELECT * FROM user WHERE DepartmentID = ? and user.Role = 'Nhân viên'";

    $stm = $conn->prepare($sql);
    $stm->bind_param('s', $departmentID);

    if (!$stm->execute()) {
        return json_encode(array('status' => false, 'errorMessage' => 'Lỗi thực thi.'));
    }

    $result = $stm->get_result();
    if ($result->num_rows == 0) {
        return json_encode(array('status' => false, 'errorMessage' => 'Phòng ban này không có nhân viên nào ngoài Trưởng phòng.'));
    }

    $data  = array();

    while ($row = $result->fetch_assoc()) {
        array_push($data, $row);
    }

    return json_encode(array('status' => true, 'result' => $data));
}

function updateSalary($UID, $salary) {
    $sql_Statement = 'UPDATE user SET Salary = ? WHERE UserID = ?';
    $connection = createConnection();

    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('is', $salary, $UID);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Lỗi thực thi. Vui lòng thử lại.");
    };

    // Vi luon trung ten avatar nen co the khong update 
    if ($statement->affected_rows == 0) {
        return array('status' => false, 'errorMessage' => 'Lương mới trùng lương cũ.');
    };

    return array('status' => true, 'message' => 'Update Lương Nhân viên thành công.');
}

