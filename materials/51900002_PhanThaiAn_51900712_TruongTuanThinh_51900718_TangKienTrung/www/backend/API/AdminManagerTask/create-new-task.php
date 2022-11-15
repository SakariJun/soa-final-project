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

    header('Content-Type: application/json; charset=UTF-8');

    if ( $_SERVER['REQUEST_METHOD'] != 'POST' ){
        http_response_code(405);
        die(json_encode(array('status' =>false, 'errorMessage' => 'API này chỉ hỗ trợ phương thức POST')));
    };

    if( $_SESSION['role']!="Trưởng phòng") {
        header("/app/forbidden.php");
        exit();
    }

    $leaderID = $_SESSION['userID'];
    $staffID = isset($_POST['userID']) ? $_POST['userID'] : "";
    $title = isset($_POST['title']) ? $_POST['title'] : "";
    $desc = isset($_POST['desc']) ? $_POST['desc'] : "";
    $deadline = isset($_POST['deadline']) ? $_POST['deadline'] : "";

    if($leaderID==""){
        die(json_encode(array('status' =>false, 'errorMessage' => 'Mã Trưởng phòng không tồn tại')));
    }
    if($staffID==""){
        die(json_encode(array('status' =>false, 'errorMessage' => 'Vui lòng chọn nhân viên đảm nhiệm')));
    }
    if($title==""){
        die(json_encode(array('status' =>false, 'errorMessage' => 'Tiêu đề nhiệm vụ không được để trống')));
    }
    if($desc==""){
        die(json_encode(array('status' =>false, 'errorMessage' => 'Vui lòng điền mô tả nhiệm vụ')));
    }
    if($deadline==""){
        die(json_encode(array('status' =>false, 'errorMessage' => 'Thời hạn deadline không được để trống')));
    }

    require_once '../../DAO/DepartmentDAO.php';
    // Check phải leader hay không
    $checkIsLeader = isLeader($_SESSION['userID']);

    if ( !$checkIsLeader['status'] ){
        die(json_encode($checkIsLeader));
    }
    
    $departmentID = $checkIsLeader['result']['DepartmentID'];

    // Check mã nhân viên vừa chọn có thuộc về phòng ban mình quản lý không
    $isOfficerManagedByLeader = isOfficerManagedByLeader($staffID, $departmentID);

    if ( !$isOfficerManagedByLeader['status'] ){
        die(json_encode($isOfficerManagedByLeader));
    }

    $dateNow = strtotime(date('Y-m-d H:i:s'));
    $str_deadline = strtotime($deadline);
    
    if ($str_deadline < $dateNow){
        die(json_encode(array('status' => false, 'errorMessage' => 'Deadline không thể trước thời gian hiện tại.')));
    }

    require_once '../../DAO/TaskDAO.php';

    // check file attractments
    if ( isset($_FILES["attachment"]) ){
        $taskPath = "../../../app/tasks/". createNewTaskID() . "/attachments/";

        if (!file_exists($taskPath)) {
            mkdir($taskPath, 0777, true);
        }

        for ($i = 0; $i < count($_FILES["attachment"]['name']); $i++){
            // Nếu có đình kèm tập tin thì check
            if( empty($_FILES["attachment"]["name"][$i])) {
                die(json_encode(array('status'=>false, 'errorMessage'=>"Có tập tin bị mất")));
            }
        
            if($_FILES["attachment"]["error"][$i] != UPLOAD_ERR_OK) {
                die(json_encode(array('status'=>false, 'errorMessage'=>"Có lỗi xảy ra khi upload")));
            }

            $taskCreatedAttachmentPath_File = $taskPath . basename($_FILES["attachment"]["name"][$i]);
            $taskCreatedAttachmentExtension = strtolower(pathinfo($taskCreatedAttachmentPath_File,PATHINFO_EXTENSION));

            // Check if file already exists
            if (file_exists($taskCreatedAttachmentPath_File)) {
                // file đã tồn tại thì xóa để upload cái mới ( Override )
                unlink($taskCreatedAttachmentPath_File);
            }

            // Check file size
            if ($_FILES["attachment"]["size"][$i] > 1024* 1024 * 16) {
                die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng chọn file nhỏ hơn 16MB')));
            }

            require_once '../../SupportedFunction/SupportedUploadExtension.php';
            // Allow certain file formats
            if( !checkSupportedExtension($taskCreatedAttachmentExtension) ){
                die(json_encode(array('status' => false, 'errorMessage' => 'Định dạng ' .$taskCreatedAttachmentExtension. ' không được hỗ trợ')));
            }

            if (!move_uploaded_file($_FILES["attachment"]["tmp_name"][$i], $taskCreatedAttachmentPath_File)) {
                die(json_encode(array('status' => false, 'errorMessage' => 'Có lỗi trong quá trình upload tập tin')));
            }
        }
    };

    die(json_encode(createTask($leaderID, $staffID, $title, $desc, $deadline)));
?>