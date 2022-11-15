<?php
    // Set username, role và tình trạng activated vào session
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    
    header('Content-Type: application/json; charset=UTF-8');

    if ( $_SERVER['REQUEST_METHOD'] != 'POST' ){
        http_response_code(405);
        die(json_encode(array('status' => false, 'errorMessage' => 'This API only support POST Request Method !!!')));
    };

    $user_input_data = json_decode(file_get_contents('php://input'));

    if ( is_null($user_input_data)){
        die(json_encode(array('status' => false, 'errorMessage' => 'This API only support JSON input data type !!!')));
    };

    if ( !property_exists($user_input_data, 'username') ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Missing parameters !!!')));
    }

    if ( empty($user_input_data->username) ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Found empty parameters !!!')));
    }

    // TODO: SELECT FROM DATABASE TO GET ACTIVATED AND ROLE 
    require_once '../../DAO/MixableDAO.php';
 
    die(json_encode(SetSession($user_input_data->username)));
?>