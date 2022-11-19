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

    if ( $_SERVER['REQUEST_METHOD'] != 'PUT' ){
        http_response_code(405);
        die(json_encode(array('status' => false, 'errorMessage' => 'This API only support PUT Request Method !!!')));
    };

    $user_input_data = json_decode(file_get_contents('php://input'));

    if ( is_null($user_input_data) ){
        die(json_encode(array('status' => false, 'errorMessage' => 'This API only support JSON input data type !!!')));
    };

    if ( !property_exists($user_input_data, 'status') ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Không tìm thấy tình trạng duyệt đơn !!!')));
    }

    if ( !property_exists($user_input_data, 'absenceRequestID') ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Không tìm thấy tình mã yêu cầu nghỉ phép !!!')));
    }

    if ( !property_exists($user_input_data, 'responseMessage') ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Không tìm thấy tin nhắn phản hồi !!!')));
    }

    date_default_timezone_set('Asia/Ho_Chi_Minh');
    
    require_once '../../SupportedFunction/ValidateUserInput.php';

    $status = validateInput($user_input_data->status);
    $responseMessage = validateInput($user_input_data->responseMessage);

    if ( empty($status) ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng chọn tình trạng duyệt đơn !!!')));
    } 

    if ( empty($user_input_data->absenceRequestID) ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Mã yêu cầu nghỉ phép rỗng !!!')));
    }

    if ($status != "Approved" && $status != "Refused" ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Lỗi tình trạng duyệt đơn nghỉ phép sai định dạng !!!')));
    }

    require_once '../../DAO/AbsenceRequestDAO.php';

    // Lấy chi tiết yêu cầu nghỉ phép = mã nghỉ phép
    $detailAbsenceRequest = showDetailAbsenceRequest($user_input_data->absenceRequestID);

    if ( !$detailAbsenceRequest['status'] ){
        die(json_encode($detailAbsenceRequest));
    }

    if ( $detailAbsenceRequest['result']['UserID'] == $_SESSION['userID'] ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Không thể tự duyệt đơn của chính mình !!!')));
    }

    if ( $_SESSION['role'] == 'Giám đốc' ){
        if ( $detailAbsenceRequest['result']['Role'] != 'Trưởng phòng' ){
            die(json_encode(array('status' => false, 'errorMessage' => 'Giám đốc chỉ có thể duyệt đơn xin nghỉ phép của Trưởng phòng !!!')));
        }
    } else if ( $_SESSION['role'] == 'Trưởng phòng' ){
        if ( $detailAbsenceRequest['result']['Role'] != 'Nhân viên' ){
            die(json_encode(array('status' => false, 'errorMessage' => 'Trưởng phòng chỉ có thể duyệt đơn xin nghỉ phép của Nhân viên !!!')));
        }

        if ( $_SESSION['userID'] != $detailAbsenceRequest['result']['LeaderID'] ){
            die(json_encode(array('status' => false, 'errorMessage' => 'Chỉ có thể duyệt đơn xin nghỉ phép của Nhân viên nằm trong phòng ban mình làm Trưởng phòng !!!')));
        }
    }
    
    // Check nếu đơn đã được duyệt thì k duyệt nữa
    if ( $detailAbsenceRequest['result']['Status'] != "Waiting" ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Đơn xin nghỉ phép đã được duyệt không thể thay đổi !!!')));
    }

    // Duyệt đơn
    $setStatus = setAbsenceRequestStatus($user_input_data->absenceRequestID, $status, $responseMessage, date("Y-m-d H:i:s"));

    // Trừ số ngày nghỉ vào số ngày nghỉ còn lại của người lao động nếu đơn được duyệt cho phép nghỉ
    if ( $status == "Approved" && $setStatus['status'] ){
        require_once '../../DAO/AbsenceDAO.php';

        $date_Begin = new DateTime($detailAbsenceRequest['result']['DateBegin']);
        $date_End = new DateTime($detailAbsenceRequest['result']['DateEnd']);
        $interval = $date_End->diff($date_Begin);

        $daysAbsence = $date_Begin == $date_End ? 1 : intval($interval->days) + 1; 
        $daysAbsence = intval($daysAbsence) + intval($detailAbsenceRequest['result']['DayAbsence']); 
        
        $setDayAbsence = setDayAbsence($detailAbsenceRequest['result']['UserID'], $daysAbsence);

        if ( !$setDayAbsence['status'] ){
            die(json_encode($setDayAbsence));
        }
    }

    die(json_encode($setStatus));
?>