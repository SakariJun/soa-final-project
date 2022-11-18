<?php 
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    if ( !isset($_SESSION['username']) || !isset($_SESSION['role']) || !isset($_SESSION['userID']) ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng đăng nhập trước khi thực hiện chức năng này !!!')));
    }

    if ( $_SESSION['activated'] == 1 ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Tài khoản đã đổi mật khẩu rồi !!!')));
    }

    header('Content-Type: application/json; charset=UTF-8');

    if ( $_SERVER['REQUEST_METHOD'] != 'POST' ){
        http_response_code(405);
        die(json_encode(array('status' => false, 'errorMessage' => 'This API only support POST Request Method !!!')));
    };

    $user_input_data = json_decode(file_get_contents('php://input'));

    if ( is_null($user_input_data) ){
        die(json_encode(array('status' => false, 'errorMessage' => 'This API only support JSON input data type !!!')));
    };

    if ( !property_exists($user_input_data, 'password') || !property_exists($user_input_data, 'password_confirm') ){
        http_response_code(400);
        die(json_encode(array('status' => false, 'errorMessage' => 'Missing parameters !!!')));
    }
    
    require_once '../../SupportedFunction/ValidateUserInput.php';

    $password = validateInput($user_input_data->password);
    $password_confirm = validateInput($user_input_data->password_confirm);

    if ( empty($password) || empty($password_confirm) ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Found empty parameters !!!')));
    }

    if ( strcmp($password,$password_confirm) != 0 ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Password does not match !!!')));
    }

    if ( strlen($password) < 6 ){
        die(json_encode(array('status' => false, 'errorMessage' => "Mật khẩu phải có ít nhất 6 ký tự !!!")));
    }

    if ( $password == $_SESSION['username'] ){
        die(json_encode(array('status' => false, 'errorMessage' => "Mật khẩu mới phải khác mật khẩu mặc định !!!")));
    }

    require_once '../../DAO/AccountDAO.php';

    die(json_encode(changePassword(validateInput($_SESSION['username']),$password)));
?>