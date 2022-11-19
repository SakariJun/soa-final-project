<?php 
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
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

    if ( !property_exists($user_input_data, 'username') || !property_exists($user_input_data, 'password') ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Missing parameters !!!')));
    }
    
    require_once '../../SupportedFunction/ValidateUserInput.php';
    // Validate invalid syntax
    $username = validateInput($user_input_data->username);
    $password = validateInput($user_input_data->password);

    if ( empty($username) || empty($password) ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Found empty parameters !!!')));
    }

    if ( strlen($password) < 6 ){
        die(json_encode(array('status'=> false,'errorMessage'=> "Mật khẩu phải có ít nhất 6 ký tự !!!")));
    }

    require_once '../../DAO/AccountDAO.php';

    die(json_encode(login($username,$password)));
?>