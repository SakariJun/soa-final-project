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

    header('Content-Type: application/json; charset=UTF-8');

    if ( $_SERVER['REQUEST_METHOD'] != 'POST' ){
        http_response_code(405);
        die(json_encode(array('status' => false, 'errorMessage' => 'This API only support POST Request Method !!!')));
    };

    $user_input_data = json_decode(file_get_contents('php://input'));

    if ( is_null($user_input_data) ){
        die(json_encode(array('status' => false, 'errorMessage' => 'This API only support JSON input data type !!!')));
    };

    if ( !property_exists($user_input_data, 'oldPassword') 
    || !property_exists($user_input_data, 'newPassword') 
    || !property_exists($user_input_data, 'newPassword_confirm') ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Missing parameters !!!')));
    }
    
    require_once '../../SupportedFunction/ValidateUserInput.php';

    $oldPassword = validateInput($user_input_data->oldPassword);
    $newPassword = validateInput($user_input_data->newPassword);
    $newPassword_confirm = validateInput($user_input_data->newPassword_confirm);

    if ( empty($oldPassword) || empty($newPassword) || empty($newPassword_confirm) ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Found empty parameters !!!')));
    }

    if ( strcmp($newPassword,$newPassword_confirm) != 0 ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Mật khẩu xác nhận không trùng khớp !!!')));
    }

    if ( strlen($newPassword) < 6 ){
        die(json_encode(array('status' => false, 'errorMessage' => "Mật khẩu phải có ít nhất 6 ký tự !!!")));
    }

    if ( $oldPassword == $newPassword ){
        die(json_encode(array('status' => false, 'errorMessage' => "Mật khẩu mới phải khác mật khẩu cũ !!!")));
    }

    require_once '../../DAO/AccountDAO.php';

    die(json_encode(userChangePassword(validateInput($_SESSION['username']),$oldPassword, $newPassword)));
?>