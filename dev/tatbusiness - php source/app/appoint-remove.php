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

    if (isset($_SESSION['role'])) {
        if ($_SESSION['role'] != 'Giám đốc') {
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
        <div class="card-header">
            <h1 class="text-center text-uppercase">Danh sách phòng ban đã có trưởng phòng</h1>
        </div>

        <div class="card-body table-responsive-lg">
            <table class="rounded table" id="leader-department-table">
                <thead>
                    <tr>
                        <th style="border-top: None;" class="text-center text-uppercase">Trưởng phòng</th>
                        <th style="border-top: None;" class="text-center text-uppercase">Mã phòng ban</th>
                        <th style="border-top: None;" class="text-center text-uppercase">Tên phòng ban</th>
                    </tr>
                </thead>
                <tbody id="leader-department-table-body">
                    <!-- let js do its job -->
                <tbody>
            </table>
        </div>
    </div>

    <div class="card">
        <div class="card-header">
            <h1 class="text-center text-uppercase">Danh sách phòng ban chưa có trưởng phòng</h1>
        </div>
        <div class="card-body table-responsive-lg">
            <table class="rounded  table " id="non-leader-department-table ">
                <thead>
                    <tr>
                        <th style="border-top: None;" class="text-center text-uppercase">Mã phòng ban</th>
                        <th style="border-top: None;" class="text-center text-uppercase">Tên phòng ban</th>
                        <th style="border-top: None;" class="text-center text-uppercase">Mô tả</th>
                    </tr>
                </thead>
                <tbody id="non-leader-department-table-body">
                    <!-- let js do its job -->
                <tbody>
            </table>
        </div>
    </div>
</div>

<div id="remove-leader" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <hp class="modal-title">Xác nhận cắt chức?</hp>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <div class="modal-body">
                <p>Xác nhận cắt chức trưởng phòng <strong id="leader-name"></strong> của phòng ban <strong id="de-name"></strong></p> 
                
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary"  data-dismiss="modal">Hủy</button>
                <button id="confirm-remove" class="btn btn-danger"  data-dismiss="modal">Xác nhận</button>
            </div>
        </div>
    </div>
</div>


<div id="confirm-leader" class="modal fade"  role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <hp class="modal-title">Xác nhận bổ nhiệm?</hp>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <div class="modal-body">
                <p>Xác nhận bổ nhiệm nhân viên <strong id="appoint-leader-name"></strong> làm trưởng phòng <strong id="new-de-name"></strong></p> 
            </div>

            <div class="modal-footer">
                <button type="button" id="cancel-appoint" class="btn btn-secondary"  data-dismiss="modal">Hủy</button>
                <button id="confirm-appoint" class="btn btn-danger"  data-dismiss="modal">Xác nhận</button>
            </div>
        </div>
    </div>
</div>

<div id="appoint-leader" class="modal fade"  role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Chọn trưởng phòng mới?</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            
            <div class="modal-body">
                <p>Vui lòng chọn một nhân viên của phòng <strong id="dep-name"></strong> để làm trưởng phòng: </p> 
                <select class="form-control" name="choose-leader" id="choose-leader">
                    
                </select>

                <a href="#" hidden="true" id="switch-to-add-staff">Thêm nhân viên mới</a>
                <div id="message-appoint" class="mt-2 alert alert-danger" hidden="true"></div>
            </div>
        
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Hủy</button>
                <button id="btn-appoint" class="btn btn-success">Bổ nhiệm</button>
            </div>
        </div>
    </div>
</div>

<div id="remove-success-alert" class="modal fade mt-5" role="dialog">
    <div class="modal-dialog mt-5">
        <div class="modal-content mt-5">
            <div class="modal-header">
                <h3 class="modal-title text-success">Thành công</h3>
            </div>
            <div class="modal-body">
                <p>Trưởng phòng đã được cắt chức.</p>
            </div>
        </div>
    </div>
</div>

<div id="appoint-success-alert" class="modal fade mt-5" role="dialog">
    <div class="modal-dialog mt-5">
        <div class="modal-content mt-5">
            <div class="modal-header">
                <h3 class="modal-title text-success">Thành công</h3>
            </div>
            <div class="modal-body">
                <p>Trưởng phòng <strong id="new-leader-name"></strong> đã được bổ nhiệm.</p>
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
                <p>Thông tin về phòng ban đã được thêm thành công vào hệ thống. Vui lòng bổ nhiệm các chức danh cần thiết cho phòng ban vừa tạo</p>
            </div>
        </div>
    </div>
</div>