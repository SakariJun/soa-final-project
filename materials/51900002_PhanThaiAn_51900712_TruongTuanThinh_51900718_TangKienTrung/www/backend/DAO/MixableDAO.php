<?php
require_once 'databaseConnection.php';

// API nào gọi function này bắt buộc phải mở session trước
function SetSession($username)
{
    $sql_Statement = 'SELECT account.UserID, user.FullName, account.Activated, user.Role, user.Avatar, user.Gender FROM account, user WHERE user.UserID = account.UserID AND account.Username = ?';

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

    $_SESSION['username'] = $username;
    $_SESSION['user'] = $data['FullName'];
    $_SESSION['role'] = $data['Role'];
    $_SESSION['activated'] = $data['Activated'];
    $_SESSION['userID'] = $data['UserID'];
    $_SESSION['gender'] = $data['Gender'];

    if ($data['Avatar'] != null) {
        $_SESSION['avatar'] = "../app/users/" . $data['UserID'] . "/" . $data['Avatar'];
    } else {
        $_SESSION['avatar'] = "/assets/images/users/DefaultAvatar/" . ($data['Gender'] == "Nam" ? "Male_Default.png" : "Female_Default.png");
    }

    return array('status' => true, 'message' => 'STORE USER INFO TO SESSION COMPLETE !!!');
}

function loadAllAccounts()
{
    $sql = "select account.UserID, user.Fullname, account.Username, user.Role, user.Email, account.Activated, account.RequestResetPassword from account, user where account.UserID = user.UserID order by account.RequestResetPassword desc,  FIELD(user.Role,N'Giám đốc',N'Trưởng phòng',N'Nhân viên')";
    $conn = createConnection();

    $result = $conn->query($sql);
    if (!$result) {
        return json_encode(array('status' => 0, 'message' => $conn->error));
    }
    $data = $result->fetch_all();
    return json_encode(array('status' => 1, 'message' => 'Success.', 'data' => $data));
}

function getAccountByIDAdmin($id)
{
    $sql = 'select user.UserID, user.FullName, user.Role, user.Email, user.DOB, user.PhoneNumber
        , department.DepartmentName, account.Username, account.Activated, user.Gender, user.Avatar 
        from department, account, user 
        where account.UserID = user.UserID and user.DepartmentID = department.DepartmentID 
        and user.UserID = ?';

    $conn = createConnection();

    $stm = $conn->prepare($sql);
    $stm->bind_param('s', $id);
    if (!$stm->execute()) {
        return json_encode(array('status' => 0, 'message' => 'Can not execute command.'));
    }
    $result = $stm->get_result();
    if ($result->num_rows == 0) {
        return json_encode(array('status' => 0, 'message' => 'This account does not exist.'));
    }
    $data = $result->fetch_all();
    return json_encode(array('status' => 1, 'message' => 'Success.', 'data' => $data));
}

function statisticsStatus()
{
    // Tổng nhân viên
    $sql = 'SELECT * FROM user';
    $conn = createConnection();
    $stmt = $conn->prepare($sql);

    if (!$stmt->execute()) {
        return array('status' => false, 'errorMessage' => 'Lỗi thực thi');
    }
    $result = $stmt->get_result();
    $data['users'] = $result->num_rows;

    // Tổng Task đã giao trừ việc đã hủy
    $sql = 'SELECT * FROM task WHERE Status != "Canceled"';
    $stmt = $conn->prepare($sql);

    if (!$stmt->execute()) {
        return array('status' => false, 'errorMessage' => 'Lỗi thực thi');
    }
    $result = $stmt->get_result();
    $data['tasks'] = $result->num_rows;

    // Tổng phòng ban
    $sql = 'SELECT * FROM department';
    $stmt = $conn->prepare($sql);

    if (!$stmt->execute()) {
        return array('status' => false, 'errorMessage' => 'Lỗi thực thi');
    }
    $result = $stmt->get_result();
    $data['departments'] = $result->num_rows;

    // Số task hoàn thành
    $sql = 'SELECT * FROM task WHERE Status = "Completed"';
    $stmt = $conn->prepare($sql);

    if (!$stmt->execute()) {
        return array('status' => false, 'errorMessage' => 'Lỗi thực thi');
    }
    $result = $stmt->get_result();
    $data['tasks-completed'] = $result->num_rows;

    // Nhân viên đang nghỉ phép
    $sql = 'SELECT * FROM absence_request WHERE Status = "Approved" AND CURDATE() BETWEEN DateBegin and DateEnd';
    $stmt = $conn->prepare($sql);

    if (!$stmt->execute()) {
        return array('status' => false, 'errorMessage' => 'Lỗi thực thi');
    }
    $result = $stmt->get_result();
    $data['users-absence'] = $result->num_rows;

    return array('status' => true, 'result' => $data);
}
