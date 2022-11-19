<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

if (!isset($_SESSION['username']) || !isset($_SESSION['role']) || !isset($_SESSION['userID'])) {
    die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng đăng nhập trước khi thực hiện chức năng này')));
}

if ($_SESSION['activated'] == 0) {
    die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng đổi mật khẩu trước khi thực hiện chức năng này !!!')));
}

if ($_SESSION['role'] == 'Giám đốc') {
    die(json_encode(array('status' => false, 'errorMessage' => 'Giám đốc không thể sử dụng chức năng này !!!')));
}

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    http_response_code(405);
    die(json_encode(array('status' => false, 'errorMessage' => 'API chỉ hỗ trợ phương thức POST')));
};

$taskID = isset($_GET['id']) ? $_GET['id'] : "";
$msg = isset($_POST['message']) ? $_POST['message'] : "";

if ($taskID == "") {
    die(json_encode(array('status' => false, 'errorMessage' => 'Mã Nhiệm vụ không tồn tại')));
}

if ($msg == "") {
    die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng thêm lời nhắn khi gửi báo cáo')));
}

// Update deadline - đặc quyền trưởng phòng
if ($_SESSION['role'] == 'Trưởng phòng') {
    $deadline = isset($_POST['deadline']) ? $_POST['deadline'] : "";

    if ($deadline == "") {
        die(json_encode(array('status' => false, 'errorMessage' => 'Thời hạn deadline không được để trống')));
    }

    require_once '../../DAO/TaskDAO.php';
    $task = getTaskByTaskID($taskID);

    if (!$task['status']) {
        die(json_encode($task));
    }

    $dateNow = strtotime(date('Y-m-d H:i:s'));
    $str_deadline = strtotime($deadline);
    $str_oldDeadline = strtotime($task['result']['Deadline']);

    if ($str_deadline < $str_oldDeadline) {
        die(json_encode(array('status' => false, 'errorMessage' => 'Thời gian gia hạn phải sau thời hạn cũ.')));
    }

    if ($str_deadline != $str_oldDeadline && $str_deadline < $dateNow) {
        die(json_encode(array('status' => false, 'errorMessage' => 'Thời gian gia hạn không thể trước thời gian hiện tại.')));
    }
}

require_once '../../DAO/TaskConversationDAO.php';
$id = getNewTaskConversationID($taskID);

if (!$id['status']) {
    die(json_encode(array('status' => false, 'errorMessage' => "Có lỗi xảy ra khi upload")));
}

$id = $id['result'];

if (isset($_FILES["attachment"])) {

    $taskPath = "../../../app/tasks/$taskID/conversations/" . $id . "/";

    if (!file_exists($taskPath)) {
        mkdir($taskPath, 0777, true);
    }

    for ($i = 0; $i < count($_FILES["attachment"]['name']); $i++) {
        // Nếu có đình kèm tập tin thì check
        if (empty($_FILES["attachment"]["name"][$i])) {
            die(json_encode(array('status' => false, 'errorMessage' => "Có tập tin bị mất")));
        }

        if ($_FILES["attachment"]["error"][$i] != UPLOAD_ERR_OK) {
            die(json_encode(array('status' => false, 'errorMessage' => "Có lỗi xảy ra khi upload")));
        }

        $taskCreatedAttachmentPath_File = $taskPath . basename($_FILES["attachment"]["name"][$i]);
        $taskCreatedAttachmentExtension = strtolower(pathinfo($taskCreatedAttachmentPath_File, PATHINFO_EXTENSION));

        // Check if file already exists
        if (file_exists($taskCreatedAttachmentPath_File)) {
            // file đã tồn tại thì xóa để upload cái mới ( Override )
            unlink($taskCreatedAttachmentPath_File);
        }

        // Check file size
        if ($_FILES["attachment"]["size"][$i] > 1024 * 1024 * 16) {
            die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng chọn file nhỏ hơn 16MB')));
        }

        require_once '../../SupportedFunction/SupportedUploadExtension.php';
        // Allow certain file formats
        if (!checkSupportedExtension($taskCreatedAttachmentExtension)) {
            die(json_encode(array('status' => false, 'errorMessage' => 'Định dạng ' . $taskCreatedAttachmentExtension . ' không được hỗ trợ')));
        }

        if (!move_uploaded_file($_FILES["attachment"]["tmp_name"][$i], $taskCreatedAttachmentPath_File)) {
            die(json_encode(array('status' => false, 'errorMessage' => 'Có lỗi trong quá trình upload tập tin')));
        }
    }
};

require_once '../../DAO/TaskDAO.php';
if(isset($deadline)) {
    $result = rejectTask($taskID, $deadline);
} else {
    $result = submitTask($taskID);
}

if(!$result['status']){
    die(json_encode($result));
}

die(json_encode(createTaskConversation($id, $taskID, $_SESSION['userID'], $msg)));
