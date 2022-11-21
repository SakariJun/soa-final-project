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
            <h1 class="text-center text-uppercase">Danh sách phòng ban</h1>
        </div>
    </div>
    <div class="card">
        <div class="card-body table-responsive-lg">
            <table class="rounded  table " id="department-table ">
                <thead>
                    <tr>
                        <th style="border-top: None;" class="text-center">ID</th>
                        <th style="border-top: None;">Tên phòng ban</th>
                        <th style="border-top: None;">Mô tả</th>
                        <th style="border-top: None;">Trưởng phòng</th>
                    </tr>
                </thead>
                <tbody id="department-table-body">
                    <!-- let js do its job -->
                <tbody>
            </table>
        </div>
    </div>
</div>
</div>