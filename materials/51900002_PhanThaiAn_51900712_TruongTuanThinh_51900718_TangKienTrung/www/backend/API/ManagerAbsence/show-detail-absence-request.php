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

    if ( $_SERVER['REQUEST_METHOD'] != 'GET' ){
        http_response_code(405);
        die(json_encode(array('status' => false, 'errorMessage' => 'This API only support GET Request Method !!!')));
    };

    if ( !isset($_GET['absenceRequestID']) ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Missing parameters !!!')));
    }

    $absenceRequestID = $_GET['absenceRequestID'];

    if ( empty($absenceRequestID) ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Found empty parameters !!!')));
    }

    require_once '../../DAO/AbsenceRequestDAO.php';

    $detailAbsenceRequest = showDetailAbsenceRequest($absenceRequestID);

    if ( !$detailAbsenceRequest['status'] ){
        die(json_encode($detailAbsenceRequest));
    }

    // TODO đọc list file
    $absenceAttachmentPath = "../../../app/users/". $detailAbsenceRequest['result']['UserID'] ."/AbsenceRequestAttachment/AbsenceRequestID_" . $absenceRequestID ."/";

    // Đọc danh sách file đính kèm trong đơn yêu cầu nghỉ phép nếu có
    if ( file_exists($absenceAttachmentPath) || is_dir($absenceAttachmentPath) ){
        require_once '../../SupportedFunction/SupportedUploadExtension.php';

        $list_File = readFolder($absenceAttachmentPath);
        $detailAbsenceRequest['listFile'] = $list_File;
    }

    die(json_encode($detailAbsenceRequest));
?>