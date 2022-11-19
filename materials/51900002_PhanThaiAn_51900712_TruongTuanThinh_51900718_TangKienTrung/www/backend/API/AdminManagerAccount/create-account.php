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

    header('Content-Type: application/json; charset=UTF-8');

    if ( $_SERVER['REQUEST_METHOD'] != 'POST' ){
        http_response_code(405);
        die(json_encode(array('status' => 4, 'errorMessage' => 'This API only support PUT Request Method !!!')));
    };
    $user_input_data = json_decode(file_get_contents('php://input'));

    if ( is_null($user_input_data) ){
        die(json_encode(array('status' => 2, 'errorMessage' => 'This API only support JSON input data type !!!')));
    }

    if ( !property_exists($user_input_data, 'username') ){
        http_response_code(400);
        die(json_encode(array('status' => 1, 'errorMessage' => 'Missing parameters username!!!')));
    }
    if ( !property_exists($user_input_data, 'fullname') ){
        http_response_code(400);
        die(json_encode(array('status' => 1, 'errorMessage' => 'Missing parameters fullname!!!')));
    }
    if ( !property_exists($user_input_data, 'email')){
        http_response_code(400);
        die(json_encode(array('status' => 1, 'errorMessage' => 'Missing parameters email!!!')));
    }
    if ( !property_exists($user_input_data, 'dob') ){
        http_response_code(400);
        die(json_encode(array('status' => 1, 'errorMessage' => 'Missing parameters dob!!!')));
    }
    if ( !property_exists($user_input_data, 'phonenumber') ){
        http_response_code(400);
        die(json_encode(array('status' => 1, 'errorMessage' => 'Missing parameters phonenumber!!!')));
    }
    if ( !property_exists($user_input_data, 'gender') ){
        http_response_code(400);
        die(json_encode(array('status' => 1, 'errorMessage' => 'Missing parameters gender!!!')));
    }

    if ( !property_exists($user_input_data, 'department') ){
        http_response_code(400);
        die(json_encode(array('status' => 1, 'errorMessage' => 'Missing parameters department!!!')));
    }

    require_once '../../DAO/AccountDAO.php';
    require_once '../../DAO/DepartmentDAO.php';
    require_once '../../SupportedFunction/ValidateUserInput.php';
  
    $username = validateInput($user_input_data->username);
    $fullname = validateInput($user_input_data->fullname);
    $email = validateInput($user_input_data->email);
    $dob = validateInput($user_input_data->dob);
    $phonenumber = validateInput($user_input_data->phonenumber);
    $department = validateInput($user_input_data->department);
    $gender = validateInput($user_input_data->gender);

    if ( empty($username) || empty($fullname) 
    || empty($email) || empty($phonenumber) || empty($dob) 
    || empty($department) || empty($gender)){
        die(json_encode(array('status' => false, 'errorMessage' => 'Found empty parameters !!!')));
    }

    // check if e-mail address is well-formed
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die(json_encode(array('status' => false, 'errorMessage' => 'Email không hợp lệ !!!')));
    }

    if ( !isPhoneNumber($phonenumber) ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Số điện thoại không hợp lệ !!!')));
    }

    $dobToTime = strtotime(date("Y-m-d H:i:s")) - strtotime($dob);
    
    if ( $dobToTime <= 0){
        die(json_encode(array('status' => false, 'errorMessage' => 'Ngày sinh không hợp lệ !!!')));
    }

    if ( $gender != 'Nam' && $gender != 'Nữ' ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Giới tính không đúng định dạng !!!')));
    }

    if ( json_decode(getDepartmentByID($department),true)['status'] == 0 ){
        return die(getDepartmentByID($department));
    }

    die(createAccount($username, $fullname, $email, $dob, $phonenumber, $department,$gender));
?>