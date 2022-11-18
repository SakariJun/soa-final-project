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

    if ( $_SERVER['REQUEST_METHOD'] != 'POST' ){
        http_response_code(405);
        die(json_encode(array('status' => false, 'errorMessage' => 'This API only support POST Request Method !!!')));
    }

    if ( !isset($_FILES["avatarUploaded"]) ){
        die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng chọn tập tin cần upload !!!')));
    }

    if( empty($_FILES["avatarUploaded"]["name"])) {
        die(json_encode(array('status'=>false, 'errorMessage'=>"Vui lòng chọn tập tin cần upload")));
    }

    // Check file size
    if ($_FILES["avatarUploaded"]["size"] > 1024 * 1024 * 5) {
        die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng chọn ảnh nhỏ hơn 5MB')));
    }

    if($_FILES["avatarUploaded"]["error"] != UPLOAD_ERR_OK) {
        die(json_encode(array('status'=>false, 'errorMessage'=>"Có lỗi xảy ra khi upload".$_FILES['avatarUploaded']['error'])));
    }
    
    // Lưu ảnh vào www/app/users/[Mã user]/tên ảnh
    $avatarPath = "../../../app/users/". $_SESSION['userID'] . '/';

    if (!file_exists($avatarPath)) {
        mkdir($avatarPath, 0777, true);
    }

    $avatarPath_File = $avatarPath . basename($_FILES["avatarUploaded"]["name"]);
    $avatarExtension = strtolower(pathinfo($avatarPath_File,PATHINFO_EXTENSION));

    // Check if image file is a actual image or fake image
    $check = getimagesize($_FILES["avatarUploaded"]["tmp_name"]);

    if(!$check) {
        die(json_encode(array('status' => false, 'errorMessage' => 'File này không phải là hình ảnh!!!')));
    }

    // Check if file already exists
    if (file_exists($avatarPath_File)) {
        die(json_encode(array('status' => false, 'errorMessage' => 'File đã tồn tại !!!')));
    }

    // Allow certain file formats
    if($avatarExtension != "jpg" && $avatarExtension != "png" && $avatarExtension != "jpeg") {
        die(json_encode(array('status' => false, 'errorMessage' => 'Chỉ hỗ trợ file với định dạng là JPG, JPEG, PNG !!!')));
    }   

    $checkDefault = explode("/",$_SESSION['avatar']);

    // if ( $checkDefault[count($checkDefault)-1] != 'Male_Default.png' && $checkDefault[count($checkDefault)-1]  != 'Female_Default.png.png' ){
    //     // Path tới avatar cũ
    //     $old_avatar = $_SESSION['avatar'];

    //     if (!unlink($old_avatar)) { 
    //         die(json_encode(array('status' => false, 'errorMessage' => 'Có lỗi trong quá trình xóa hình cũ !!!')));
    //     }
    // }

    $newFilename = 'avatar.'. $avatarExtension;

    if (!move_uploaded_file($_FILES["avatarUploaded"]["tmp_name"], $avatarPath . $newFilename)) {
        die(json_encode(array('status' => false, 'errorMessage' => 'Có lỗi trong quá trình upload file !!!')));
    }

    require_once '../../DAO/UserDAO.php';
    require_once '../../SupportedFunction/ValidateUserInput.php';

    die(json_encode(changeAvatar(validateInput($_SESSION['userID']),$newFilename)));
?>