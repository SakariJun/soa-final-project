<?php
    header('Content-Type: application/json; charset=UTF-8');

    if ( $_SERVER['REQUEST_METHOD'] != 'POST' ){
        http_response_code(405);
        die(json_encode(array('status' => false, 'errorMessage' => 'This API only support PUT Request Method !!!')));
    };
    $user_input_data = json_decode(file_get_contents('php://input'));

    if ( is_null($user_input_data) ){
        die(json_encode(array('status' => false, 'errorMessage' => 'This API only support JSON input data type !!!')));
    }

    if ( !property_exists($user_input_data, 'username') ){
        http_response_code(400);
        die(json_encode(array('status' => false, 'errorMessage' => 'Missing parameters username!!!')));
    }

    require_once 'ValidateUserInput.php';

    $username = validateInput($user_input_data->username);

    if ( !empty($username)){
        setcookie('username', $username, time() + 3600);
        die(json_encode(array('status' => true, 'message' => 'Set cookie thành công!!!')));
    }
?>