<?php
     
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    $ROLE = '';
    
    if(!isset($_POST['action'])){
        header('Location: forbidden.php');
        exit();
    }
    
    // Nếu chưa đăng nhập thì về trang login
    if (!isset($_SESSION['username'])) {
        header('Location: login.php');
        exit();
    }
    
    // Nếu chưa đổi mật khẩu khi đăng nhập lần đầu thì không cho vào trang này
    if ($_SESSION['activated'] == 0) {
        header('Location: set-new-password.php');
        exit();
    }

if (isset($_SESSION['role'])) {
    $ROLE = $_SESSION['role'];
    $ROLE = strtolower($ROLE);
    if ($ROLE != 'giám đốc') {
        echo '<h5 class="text-danger">Bạn không có quyền truy cập vào trang này, nhấn';
        echo ' <a href = "../index.php">vào đây</a> ';
        echo 'để trở về trang chủ hoặc truy cập trợ giúp<h5>';
        die();
    }
} else {
    header('Location: login.php');
    die();
}
?>

<div class="container" style="background-color: #F6F5F6; width:100%;">
    <div class="mt-5 px-0">
        <div class="mr-4">
            <div class="card mr-5 pt-2">
            <div class="card-body">
                <h3>Chi tiết người dùng</h3>
            </div>
        </div>
        </div>
  
        <div class="card col col-md-5 float-left mr-4  pt-3" id="">
            <div class="user-avatar">
                <img src="" alt="" id="avatar-detail">
            </div>
            <div class="card-body">
                <h4 id="name-detail"></h4>
                <div>
                    <i class="fas fa-certificate mr-3 my-2"></i>
                    <span id="department-detail"></span>
                </div>
                <div>
                    <i class="fas fa-birthday-cake mr-3 my-2"></i>
                    <span id="dob-detail"></span>
                </div>
                <div>
                    <i class="fas fa-phone mr-3 my-2"></i>
                    <span id="phone-number-detail"></span>
                </div>
                <div>
                    <i class="fas fa-envelope mr-3 my-2"></i>
                    <span id="email-detail"></span>
                </div>
            </div>
        </div>
        <div class="card col col-md-6 mr-0 float-left pr-4 pt-3">
            <div class="card-body">
                <div>
                    <i class="fas fa-i-cursor mr-3 my-3"></i>
                    <span><strong>Tên tài khoản&emsp;:</strong>&emsp;<span id="username-detail"></span></span>
                </div>
                <div>
                    <i class="fas fa-id-badge mr-3 my-3"></i>
                    <span><strong>Mã nhân viên&emsp;:</strong>&emsp;<span id="id-detail"></span></span>
                </div>

                <div>
                    <i class="fas fa-bookmark mr-3 my-3"></i>
                    <span><strong>Chức vụ&emsp;:</strong>&emsp;<span id="role-detail"></span></span>
                </div>
                <div>
                    <i class="fas mr-3 my-3" id="account-status-detail"></i>
                    <span><strong>Trạng thái tài khoản&emsp;:</strong>&emsp;<span id="activated-detail"></span></span>
                </div>
                <div>
                    <i class="fas fa-tag mr-3 my-3"></i>
                    <span><strong>Giới tính&emsp;:</strong>&emsp;<span id="gender-detail"></span></span>
                </div>
            </div>
        </div>
    </div>
</div>