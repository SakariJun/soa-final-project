<?php 
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    if ( !isset($_SESSION['username']) || !isset($_SESSION['role']) || !isset($_SESSION['userID']) ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng đăng nhập trước khi thực hiện chức năng này !!!')));
    }

    if ( $_SESSION['activated'] == 0 ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng đổi mật khẩu trước khi thực hiện chức năng này !!!')));
    }

    if ( $_SESSION['role'] == 'Giám đốc' ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Giám đốc không thể sử dụng chức năng này !!!')));
    }

    header('Content-Type: application/json; charset=UTF-8');

    if ( $_SERVER['REQUEST_METHOD'] != 'GET' ){
        http_response_code(405);
        die(json_encode(array('status' => false, 'errorMessage' => 'This API only support GET Request Method !!!')));
    };

    require_once '../../DAO/AbsenceDAO.php';

    die(json_encode(getAbsenceInfo($_SESSION['userID'])));
?>