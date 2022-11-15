<?php
    header('Content-Type: application/json; charset=UTF-8');

    if ( $_SERVER['REQUEST_METHOD'] != 'POST' ){
        http_response_code(405);
        die(json_encode(array('status' => false, 'errorMessage' => 'This API only support POST Request Method !!!')));
    };

    $user_input_data = json_decode(file_get_contents('php://input'));

    if ( is_null($user_input_data) ){
        die(json_encode(array('status' => false, 'errorMessage' => 'This API only support JSON input data type !!!')));
    };

    if ( !property_exists($user_input_data, 'username') || !property_exists($user_input_data, 'email') 
    || !property_exists($user_input_data, 'phoneNumber')){
        die(json_encode(array('status' => false, 'errorMessage' => 'Missing parameters !!!')));
    }
    
    require_once '../../SupportedFunction/ValidateUserInput.php';

    $username = validateInput($user_input_data->username);
    $email = validateInput($user_input_data->email);
    $phoneNumber = validateInput($user_input_data->phoneNumber);

    if ( empty($username) || empty($email) || empty($phoneNumber) ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Found empty parameters !!!')));
    }

    // check if e-mail address is well-formed
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die(json_encode(array('status' => false, 'errorMessage' => 'Email không hợp lệ !!!')));
    }

    if ( !isPhoneNumber($phoneNumber) ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Số điện thoại không hợp lệ !!!')));
    }

    require_once '../../DAO/UserDAO.php';

    $checkExist = checkExistsUserByPhoneNumberAndEmail($email,$phoneNumber);

    if ( !$checkExist['status'] ){
        die(json_encode($checkExist));
    }

    $userID = $checkExist['result'];

    if(isRequested($userID)){
        die(json_encode(array('status'=>false,'errorMessage'=> "Yêu cầu đặt lại mật khẩu đang chờ duyệt! Vui lòng chờ thông báo qua Email.")));
    }

    require_once '../../DAO/AccountDAO.php';

    // Observer pattern to notify Giám đốc 
    die(json_encode(requestResetPassword($username, $userID)));
?>