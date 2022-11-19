<?php
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

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
?>

<div class="container">
    <div class="card">
        <div class="card-body">
            <h1 class="text-uppercase text-center">Danh sách yêu cầu nghỉ phép</h1>
        </div>
    </div>

    <div class="card">
        <table class="table rounded table-hover mt-3 mb-0" id="absence-request-table">
            <thead>
                <tr>
                    <th style="border-top: None;" class="text-center text-uppercase">Mã yêu cầu</th>
                    <th style="border-top: None;" class="text-center text-uppercase">Mã nhân viên</th>
                    <th style="border-top: None;" class="text-center text-uppercase">Ngày bắt đầu</th>
                    <th style="border-top: None;" class="text-center text-uppercase">Ngày kết thúc</th>
                    <th style="border-top: None;" class="text-center text-uppercase">Trạng thái xử lý</th>
                    <th style="border-top: None;" class="text-center text-uppercase">Ngày gửi yêu cầu</th>
                </tr>
            </thead>
            <tbody id="absence-request-table-body">
                <!-- let js do its job -->
            <tbody>
        </table>
    </div>
</div>

<div id="absenceRequestResponse-modal-dialog" class="modal fade" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
        <!-- Modal content-->
        <div class="modal-content">

            <div class="modal-header">
                <h4 class="modal-title ">Thông báo</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <div class="modal-body">
                <p id="absenceRequestResponseMessage"></p>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Hủy</button>
                <button class="btn btn-danger" data-dismiss="modal">Xác nhận</button>
            </div>
        </div>
    </div>
</div>
