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

    require_once '../../DAO/DepartmentDAO.php';
    require_once '../../SupportedFunction/ValidateUserInput.php';

    header('Content-Type: application/json; charset=utf-8');

    if($_SERVER['REQUEST_METHOD'] != 'PUT'){
        http_response_code(405);
        die(json_encode(array('status'=> 4, 'message'=> 'This API only supports PUT method')));
    }

    if(isset($_GET['department'])){
        $departmentID = $_GET['department'];
        $input = json_decode(file_get_contents('php://input'));

        if ( is_null($input) ){
            die(json_encode(array('status' => 2, 'errorMessage' => 'This API only support JSON input data type !!!')));
        }

        if(!property_exists($input,'name')){
            http_response_code(400);
            die(json_encode(array('status' => 1, 'errorMessage' => 'Missing parameters !!!')));
        }
        if(!property_exists($input,'room')){
            http_response_code(400);
            die(json_encode(array('status' => 1, 'errorMessage' => 'Missing parameters !!!')));
        }
        if(!property_exists($input,'desc')){
            http_response_code(400);
            die(json_encode(array('status' => 1, 'errorMessage' => 'Missing parameters !!!')));
        }

        $name = validateInput($input->name);
        $room = validateInput($input->room);
        $desc = validateInput($input->desc);

        die(updateDepartment($departmentID, $name, $room, $desc));
    }else{
        die(json_encode(array('code' => 0,'message' => 'Missing input parameters.')));
    }
?>