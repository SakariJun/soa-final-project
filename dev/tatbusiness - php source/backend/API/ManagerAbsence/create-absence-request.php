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

    if ( $_SESSION['role'] == 'Giám đốc' ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Giám đốc không thể sử dụng chức năng này !!!')));
    }

    header('Content-Type: application/json; charset=UTF-8');

    if ( $_SERVER['REQUEST_METHOD'] != 'POST' ){
        http_response_code(405);
        die(json_encode(array('status' => false, 'errorMessage' => 'This API only support POST Request Method !!!')));
    };

    $date_Begin = isset($_POST['date_Begin']) ? $_POST['date_Begin'] : "";
    $date_End = isset($_POST['date_End']) ? $_POST['date_End'] : "";
    $reason = isset($_POST['reason']) ? $_POST['reason'] : "";


    if($date_Begin==""){
        die(json_encode(array('status' =>false, 'errorMessage' => 'Vui lòng chọn ngày bắt đầu nghỉ.')));
    }
    if($date_End==""){
        die(json_encode(array('status' =>false, 'errorMessage' => 'Vui lòng chọn ngày kết thúc nghỉ.')));
    }
    if($reason==""){
        die(json_encode(array('status' =>false, 'errorMessage' => 'Vui lòng thêm lí do xin nghỉ phép.')));
    }

    date_default_timezone_set('Asia/Ho_Chi_Minh');

    $date_Begin = strtotime($date_Begin);
    $date_End =  strtotime($date_End);

    $tomorrow = strtotime('tomorrow');

    if ( $date_Begin < $tomorrow || $date_End < $tomorrow ){
        die(json_encode(array('status' => false, 'errorMessage' => "Không thể chọn ngày trong quá khứ hoặc hôm nay. Vui lòng chọn ngày nghỉ phép ít nhất sau ngày hôm nay !!!")));
    }

    if ($date_Begin > $date_End){
        die(json_encode(array('status' => false, 'errorMessage' => 'Ngày bắt đầu không thể lớn hơn ngày kết thúc !!!')));
    }

    require_once '../../DAO/AbsenceDAO.php';

    $userAbsenceInfo = getAbsenceInfo($_SESSION['userID']);

    if ( !$userAbsenceInfo['status'] ){
        die(json_encode($userAbsenceInfo));
    }
    
    $userAbsenceInfo = $userAbsenceInfo['result'];

    if ($userAbsenceInfo['LastRequest'] != null){
        $lastRequest = strtotime(date("Y-m-d H:i:s")) - (strtotime($userAbsenceInfo['LastRequest']) + ( 7 * 60 * 60 * 24));

        if ( $lastRequest < 0  ){
            die(json_encode(array('status' => false, 'errorMessage' => 'Không thể gửi yêu cầu ! Vui lòng đợi ít nhất 7 ngày kể từ lần gửi yêu cầu gần nhất để có thể gửi thêm yêu cầu !')));
        }
    }

    $daysAbsence = ($date_End - $date_Begin) / (60 * 60 * 24);

    if ( $daysAbsence > $userAbsenceInfo['MaxAbsenceDay'] - $userAbsenceInfo['DayAbsence'] ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Số ngày nghỉ vượt quá số ngày phép còn lại !!!')));
    }

    require_once '../../DAO/AbsenceRequestDAO.php';

    // check file attractments
    if ( isset($_FILES["absenceAttachment"]) ){
        $absenceAttachmentPath = "../../../app/users/". $_SESSION['userID'] ."/AbsenceRequestAttachment/AbsenceRequestID_" . getNewAbsenceRequestId()['result'] ."/";

        if (!file_exists($absenceAttachmentPath)) {
            mkdir($absenceAttachmentPath, 0777, true);
        }

        for ($i = 0; $i < count($_FILES["absenceAttachment"]['name']); $i++){
            // Nếu có đình kèm tập tin thì check
            if( empty($_FILES["absenceAttachment"]["name"][$i])) {
                die(json_encode(array('status'=>false, 'errorMessage'=>"Có tập tin bị mất")));
            }
        
            if($_FILES["absenceAttachment"]["error"][$i] != UPLOAD_ERR_OK) {
                die(json_encode(array('status'=>false, 'errorMessage'=>"Có lỗi xảy ra khi upload")));
            }

            $absenceAttachmentPath_File = $absenceAttachmentPath . basename($_FILES["absenceAttachment"]["name"][$i]);
            $absenceAttachmentPathExtension = strtolower(pathinfo($absenceAttachmentPath_File,PATHINFO_EXTENSION));

            // Check if file already exists
            if (file_exists($absenceAttachmentPath_File)) {
                // file đã tồn tại thì xóa để upload cái mới ( Override )
                unlink($absenceAttachmentPath_File);
            }

            // Check file size
            if ($_FILES["absenceAttachment"]["size"][$i] > 1024* 1024 * 16) {
                die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng chọn file nhỏ hơn 16MB')));
            }

            require_once '../../SupportedFunction/SupportedUploadExtension.php';
            // Allow certain file formats
            if( !checkSupportedExtension($absenceAttachmentPathExtension) ){
                die(json_encode(array('status' => false, 'errorMessage' => 'Định dạng ' .$absenceAttachmentPathExtension. ' không được hỗ trợ')));
            }

            if (!move_uploaded_file($_FILES["absenceAttachment"]["tmp_name"][$i], $absenceAttachmentPath_File)) {
                die(json_encode(array('status' => false, 'errorMessage' => 'Có lỗi trong quá trình upload tập tin')));
            }
        }
    };

    $createdAbsenceRequest = createAbsenceRequest($_SESSION['userID'],date('Y-m-d',$date_Begin),date('Y-m-d',$date_End), $reason, date('Y-m-d H:i:s'));
    
    if ( !$createdAbsenceRequest['status'] ){
        die(json_encode($createdAbsenceRequest));
    }

    // Nếu tạo yêu cầu nghỉ phép thành công thì cập nhật 
    // lần gửi yêu cầu gần nhất là thời điẻm tạo yêu cầu thành công cho nhân viên
    $updateLastRequest = updateLastRequest(date('Y-m-d H:i:s'),$_SESSION['userID']);

    if ( !$updateLastRequest['status'] ){
        die(json_encode($updateLastRequest));
    }

    die(json_encode($createdAbsenceRequest));
?>