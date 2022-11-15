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

if ($_SESSION['role'] == 'Giám đốc') {
    die(json_encode(array('status' => false, 'errorMessage' => 'Chức vụ hiện tại không thể sử dụng chức năng này')));
}


if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    http_response_code(405);
    die(json_encode(array('status' => false, 'errorMessage' => 'API này chỉ hỗ trợ phương thức POST')));
};

if ($_SESSION['role'] != "Trưởng phòng" || !isset($_POST['action'])) {
    header("/app/forbidden.php");
    exit();
}

$taskID = isset($_POST['TaskID']) ? $_POST['TaskID'] : "";

if ($taskID == "") {
    die(json_encode(array('status' => false, 'errorMessage' => 'Không tìm thấy Mã nhiệm vụ cần hủy')));
}

require_once '../../DAO/DepartmentDAO.php';
require_once '../../DAO/TaskDAO.php';

// Check phải leader hay không
$checkIsLeader = isLeader($_SESSION['userID']);

if (!$checkIsLeader['status']) {
    die(json_encode($checkIsLeader));
}

$checkTaskStatus = getTaskByTaskID($taskID);

if (!$checkTaskStatus['status']) {
    die(json_encode($checkTaskStatus));
}

if ($checkTaskStatus['result']['Status'] != 'New') {
    die(json_encode(array('status' => false, 'errorMessage' => 'Trưởng phòng không thể hủy Nhiệm vụ ở trạng thái ' . $checkTaskStatus['result']['Status'])));
}

die(json_encode(cancelTask($taskID)));
