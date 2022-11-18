<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

if (!isset($_SESSION['username']) || !isset($_SESSION['role']) || !isset($_SESSION['userID'])) {
    die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng đăng nhập trước khi thực hiện chức năng này')));
}

if ($_SESSION['activated'] == 0) {
    die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng đổi mật khẩu trước khi thực hiện chức năng này')));
}

if ($_SESSION['role'] != 'Giám đốc') {
    die(json_encode(array('status' => false, 'errorMessage' => 'Chỉ giám đốc có thể truy cập')));
}

if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    http_response_code(405);
    die(json_encode(array('status' => false, 'errorMessage' => 'API chỉ hỗ trợ phương thức GET')));
};

if(!isset($_GET['id']) || empty($_GET['id'])) {
    die(json_encode(array('status'=> false, 'errorMessage'=>'Không tìm thấy mã Nhân viên.')));
}

$UID = $_GET['id'];

require_once '../../DAO/UserDAO.php';
die(json_encode(getUserInfo($UID)));
