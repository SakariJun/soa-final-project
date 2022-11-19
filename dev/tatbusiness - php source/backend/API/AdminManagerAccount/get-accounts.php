<?php
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    if ( !isset($_SESSION['username']) || !isset($_SESSION['role']) || !isset($_SESSION['userID']) ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng đăng nhập trước khi thực hiện chức năng này')));
    }

    if ( $_SESSION['activated'] == 0 ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng đổi mật khẩu trước khi thực hiện chức năng này')));
    }

    if ( $_SESSION['role'] != 'Giám đốc' ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Chỉ giám đốc mới có thể thực hiện chức năng này')));
    }

    require_once '../../DAO/MixableDAO.php';
    header('Content-Type: application/json; charset=UTF-8');

    if($_SERVER['REQUEST_METHOD'] != 'GET'){
        http_response_code(405);
        die(json_encode(array('status'=> 4, 'message'=> 'This API only supports GET method')));
    }

    die(loadAllAccounts());
?>