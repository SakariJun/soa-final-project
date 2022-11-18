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
    die(json_encode(array('status' => false, 'errorMessage' => 'Chỉ giám đốc mới có thể thực hiện chức năng này')));
}

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] != 'PUT') {
    http_response_code(405);
    die(json_encode(array('status' => false, 'errorMessage' => 'This API only supports PUT method')));
}

if (!isset($_GET['id']) || empty($_GET['id'])) {
    die(json_encode(array('status' => false, 'errorMessage' => 'Không tìm thấy ID nhân viên.')));
}

$UID = $_GET['id'];

$input = json_decode(file_get_contents('php://input'));

if (is_null($input)) {
    die(json_encode(array('status' => false, 'errorMessage' => 'This API only support JSON input data type !!!')));
}

if (!property_exists($input, 'salary')) {
    http_response_code(400);
    die(json_encode(array('status' => false, 'errorMessage' => 'Thiếu dữ kiện.')));
}
$salary = $input->salary;

if($salary%1000!=0) {
    die(json_encode(array('status' => false, 'errorMessage' => 'Tiền Lương phải là bội số của 1000.')));
}

require_once '../../DAO/UserDAO.php';
die(json_encode(updateSalary($UID, $salary)));
