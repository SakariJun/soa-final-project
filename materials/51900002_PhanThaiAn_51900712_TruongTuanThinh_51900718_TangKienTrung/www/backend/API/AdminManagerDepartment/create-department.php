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
    // add account
    // code = 4: wrong method 
    // code = 2: wrong input type 
    // code = 1: missing parameter 
    // code = 0: empty parameter
    // code = 3: cannot excute
    // code = 5: not exist
    // code = 6: success

    
    require_once '../../DAO/DepartmentDAO.php';
    require_once '../../SupportedFunction/ValidateUserInput.php';

    header('Content-Type: application/json; charset=UTF-8');

    if ( $_SERVER['REQUEST_METHOD'] != 'POST' ){
        http_response_code(405);
        die(json_encode(array('status' => 4, 'errorMessage' => 'This API only support POST Request Method !!!')));
    };
    $user_input_data = json_decode(file_get_contents('php://input'));

    if ( is_null($user_input_data) ){
        die(json_encode(array('status' => 2, 'errorMessage' => 'This API only support JSON input data type !!!')));
    }
    if(!property_exists($user_input_data,'name')){
        http_response_code(400);
        die(json_encode(array('status' => 1, 'errorMessage' => 'Missing parameter name !!!')));
    }
    if(!property_exists($user_input_data,'room')){
        http_response_code(400);
        die(json_encode(array('status' => 1, 'errorMessage' => 'Missing parameter room !!!')));
    }
    if(!property_exists($user_input_data,'desc')){
        http_response_code(400);
        die(json_encode(array('status' => 1, 'errorMessage' => 'Missing parameter desc !!!')));
    }
    $name = validateInput($user_input_data->name);
    $room = validateInput($user_input_data->room);
    $desc = validateInput($user_input_data->desc);

    die(createNewDepartment($name, $room, $desc));
?>