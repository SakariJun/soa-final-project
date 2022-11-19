<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

if (!isset($_SESSION['username']) || !isset($_SESSION['role']) || !isset($_SESSION['userID'])) {
    die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng đăng nhập trước khi thực hiện chức năng này !!!')));
}

if ($_SESSION['activated'] == 0) {
    die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng đổi mật khẩu trước khi thực hiện chức năng này !!!')));
}

if ($_SESSION['role'] == 'Giám đốc') {
    die(json_encode(array('status' => false, 'errorMessage' => 'Giám đốc không thể sử dụng chức năng này !!!')));
}

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    http_response_code(405);
    die(json_encode(array('status' => false, 'errorMessage' => 'API chỉ hỗ trợ phương thức POST')));
};

$action = isset($_POST['action']) ? $_POST['action'] : "";

if ($action == "") {
    header("/app/forbidden.php");
    exit();
}

$taskID = isset($_GET['id']) ? $_GET['id'] : "";

if ($taskID == "") {
    die(json_encode(array('status' => false, 'errorMessage' => 'Mã Nhiệm vụ không tồn tại')));
}

require_once '../../DAO/TaskDAO.php';

if( $action == "get-task") {
    die(json_encode(getTaskByTaskID($taskID)));
}

if( $action == "rate-task") {
    die(json_encode(getRateTaskByTaskID($taskID)));
}