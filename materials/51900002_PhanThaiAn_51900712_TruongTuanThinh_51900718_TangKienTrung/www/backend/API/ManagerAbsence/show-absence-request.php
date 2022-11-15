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

    if ( $_SESSION['role'] == 'Nhân viên' ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Nhân viên không thể sử dụng chức năng này !!!')));
    }

    header('Content-Type: application/json; charset=UTF-8');

    if ( $_SERVER['REQUEST_METHOD'] != 'GET' ){
        http_response_code(405);
        die(json_encode(array('status' => false, 'errorMessage' => 'This API only support GET Request Method !!!')));
    };

    require_once '../../DAO/AbsenceRequestDAO.php';
    
    if ( $_SESSION['role'] == "Giám đốc" ){
        // Giám đốc lấy danh sách nghỉ phép của trưởng phòng theo thứ tự thời giản gửi yêu cầu nghỉ phép giảm dần
        die(json_encode(showAbsenceRequestByDirector()));
    } else if ( $_SESSION['role'] == "Trưởng phòng" ){
        require_once '../../DAO/DepartmentDAO.php';

        $checkIsLeader = isLeader($_SESSION['userID']);

        if ( !$checkIsLeader['status'] ){
            die(json_encode($checkIsLeader));
        }

        die(json_encode(showAbsenceRequestByLeader($checkIsLeader['result']['DepartmentID'])));
    }

    die(json_encode(array('status' => false, 'errorMessage' => 'Không tìm được danh sách yêu cầu nghỉ phép !!!')));
?>