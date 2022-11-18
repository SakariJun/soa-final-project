<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

header('Content-Type: application/json; charset=UTF-8');

if (!isset($_SESSION['username']) || !isset($_SESSION['role']) || !isset($_SESSION['userID'])) {
    die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng đăng nhập trước khi thực hiện chức năng này')));
}

if ($_SESSION['activated'] == 0) {
    die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng đổi mật khẩu trước khi thực hiện chức năng này')));
}

if ($_SESSION['role'] == 'Giám đốc' || $_SESSION['role'] == 'Trưởng phòng') {
    die(json_encode(array('status' => false, 'errorMessage' => 'Chỉ có nhân viên mới được sử dụng chức năng này')));
}

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    http_response_code(405);
    die(json_encode(array('status' => false, 'errorMessage' => 'API chỉ hỗ trợ phương thức POST')));
};

if (!isset($_POST['action'])) {
    header("/app/forbidden.php");
    exit();
}

$taskID = isset($_POST['TaskID']) ? $_POST['TaskID'] : "";

if ($taskID == "") {
    die(json_encode(array('status' => false, 'errorMessage' => 'Mã Nhiệm vụ không tồn tại')));
}

require_once '../../DAO/TaskDAO.php';

die(json_encode(acceptTask($taskID)));
