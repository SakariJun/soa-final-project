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
<div class="container">
    <div class="card">
        <div class="card-body">
            <h1 class="text-center text-uppercase">Danh sách nhân sự công ty</h1>
        </div>
    </div>
    <div class="card">
        <div class="card-body table-responsive-lg">
        <table class="rounded  table " id="user-account-table ">
            <thead>
                <tr>
                    <th style="border-top: None;" class="text-center text-uppercase">ID</th>
                    <th style="border-top: None;" class="text-center text-uppercase">Họ và Tên</th>
                    <th style="border-top: None;" class="text-center text-uppercase">Tên tài khoản</th>
                    <th style="border-top: None;" class="text-center text-uppercase">Chức vụ</th>
                    <th style="border-top: None;" class="text-center text-uppercase">Email</th>
                    <th style="border-top: None;" class="text-center text-uppercase">Trạng thái</th>
                </tr>
            </thead>
            <tbody id="user-account-table-body">
                <!-- let js do its job -->
            <tbody>
        </table>
        </div>
        
    </div>
</div>

<div id="resetPasswordModal" class="modal fade" role="dialog">
    <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">

            <div class="modal-header">
                <h4 class="modal-title">Xác nhận reset mật khẩu</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Xác nhận reset mật khẩu cho người dùng <strong id="inf"></strong> về giá trị mặc định? Người dùng buộc phải thay đổi mật khẩu cho lần đăng nhập kế tiếp</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary"  data-dismiss="modal">Hủy</button>
                <button id="confirm-reset" class="btn btn-danger" data-dismiss="modal">Xác nhận</button>
            </div>

        </div>

    </div>
</div>
<div id="add-success-alert" class="modal fade mt-5" role="dialog">
    <div class="modal-dialog mt-5">
        <div class="modal-content mt-5">
            <div class="modal-header">
                <h3 class="modal-title text-success">Thành công</h3>
            </div>
            <div class="modal-body">
                <p>Thông tin về người dùng đã được thêm thành công vào hệ thống, người dùng sẽ phải bắt buộc đổi mật khẩu ở lần đăng nhập tiếp theo.</p>
            </div>
        </div>
    </div>
</div>

<div id="password-reset-success-alert" class="modal fade mt-5" role="dialog">
    <div class="modal-dialog mt-5">
        <div class="modal-content mt-5">
            <div class="modal-header">
                <h3 class="modal-title text-success">Thành công</h3>
            </div>
            <div class="modal-body">
                <p>Mật khẩu đã được reset về giá trị mặc định, người dùng sẽ phải bắt buộc đổi mật khẩu ở lần đăng nhập tiếp theo.</p>
            </div>
        </div>
    </div>
</div>