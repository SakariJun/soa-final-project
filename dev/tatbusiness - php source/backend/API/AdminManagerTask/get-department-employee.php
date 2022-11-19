<?php
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    if ( !isset($_SESSION['username']) || !isset($_SESSION['role']) || !isset($_SESSION['userID']) ){
        die(json_encode(array('status' => 100, 'errorMessage' => 'Vui lòng đăng nhập trước khi thực hiện chức năng này')));
    }

    if ( $_SESSION['activated'] == 0 ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng đổi mật khẩu trước khi thực hiện chức năng này')));
    }

    header('Content-Type: application/json; charset=UTF-8');

    if ( $_SERVER['REQUEST_METHOD'] != 'GET' ){
        http_response_code(405);
        die(json_encode(array('status' =>false, 'errorMessage' => 'API này chỉ hỗ trợ phương thức GET')));
    };

    if( $_SESSION['role']!="Trưởng phòng") {
        header("/app/forbidden.php");
        exit();
    }

    require_once '../../DAO/UserDAO.php';

    die(json_encode(getEmployeeByLeaderID($_SESSION['userID'])));
?>