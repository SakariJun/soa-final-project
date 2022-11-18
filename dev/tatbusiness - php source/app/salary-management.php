<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
$ROLE = '';

if (!isset($_POST['action'])) {
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
            <h1 class="text-center text-uppercase">Lương - Thưởng Nhân viên</h1>
        </div>
    </div>
    <div class="col-12">
        <div id="responseMessage" role="alert">
        </div>
    </div>
    <div class="card">
        <div class="card-body table-responsive-lg table-hover">
            <table class="rounded  table " id="user-account-table ">
                <thead>
                    <tr>
                        <th style="border-top: None;" class="text-center text-uppercase">ID</th>
                        <th style="border-top: None;" class="text-center text-uppercase">Họ và Tên</th>
                        <th style="border-top: None;" class="text-center text-uppercase">Chức vụ</th>
                        <th style="border-top: None;" class="text-center text-uppercase">Lương cơ bản</th>
                        <th style="border-top: None;" class="text-center text-uppercase">Công việc giao/hoàn thành</th>
                        <th style="border-top: None;" class="text-center text-uppercase">Lương thưởng</th>
                    </tr>
                </thead>
                <tbody id="user-salary-table-body">
                    <!-- let js do its job -->
                <tbody>
            </table>
        </div>

    </div>
</div>

<div id="edit-salary-modal" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Điều chỉnh lương Nhân viên</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="salary-old">Mức lương cơ bản cũ</label>
                    <input id="salary-old" readonly type="number" class="form-control">
                </div>
                <div class="form-group">
                    <label for="salary">Mức lương cơ bản mới</label>
                    <input id="salary" name="salary" type="number" class="form-control" require>
                </div>
                <div class="form-group">
                    <div id="edit-salary-error" class="alert" role="alert">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Hủy</button>
                <button id="confirm-edit-salary" class="btn btn-primary">Xác nhận</button>
            </div>
        </div>
    </div>
</div>