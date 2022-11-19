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

<div class="container" style="background-color: #F6F5F6;">
    <div class="mt-5">
        <div class="card col float-left mr-3" id="">
            <div class="card-header">
                <h1 class="text-center text-uppercase pt-3" >Chi tiết phòng ban</h1>
            </div>
            <div class="card-body">
                <div>
                    <i class="fas fa-cube mr-3 mb-2"></i>
                    <span><strong>Mã phòng ban&emsp;:</strong>&emsp;<span id="department-id-detail"></span></span>
            
                </div>
                <div>
                    <i class="fas fa-university mr-3 my-2"></i>
                    <span><strong>Tên phòng ban&emsp;:</strong>&emsp;<span id="department-name-detail"></span></span>
                </div>
                <div>
                    <i class="fas fa-map mr-3 my-2"></i>
                    <span><strong>Mô tả&emsp;:</strong>&emsp;<span id="department-desc-detail"></span></span>
                </div>
                <div>
                    <i class="fas fa-home mr-3 my-2"></i>
                    <span><strong>Số phòng&emsp;:</strong>&emsp;<span id="department-room-detail"></span></span>
                </div>
                <div id="message-edit" class="alert alert-danger my-2" hidden="true"></div>
                <div class="float-right" id = "edit-department">
                    <i class="fas fa-wrench" id="edit-icon"></i>
                    <span><strong id="edit-bt">Cập nhật</strong></span>
                    </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header border-bottom">
                <h5 class="pt-2">Trưởng phòng</h5>
            </div>
            <div class="card-body table-responsive-lg">
                <table  class="rounded table-hover table " >
                    <thead> 
                        <tr>
                        <th style="border-top: None;" class="text-center"></th>
                        <th style="border-top: None;">ID</th>
                        <th style="border-top: None;">Họ và tên</th>
                        <th style="border-top: None;">Số điện thoại</th>
                        <th style="border-top: None;">Email</th>
                        </tr>
                    </thead>
                    <tbody id="leader-table">

                    </tbody>
                </table>
 
            </div>
        </div>
        <div class="card mt-3">
            <div class="card-header border-bottom">
                    <h5 class="pt-2">Nhân viên</h5>
            </div>
            <div class="card-body table-responsive-lg">
                <table class="rounded table-hover table " id="list-user-by-department">
                    <thead> 
                        <tr>
                            <th style="border-top: None;" class="text-center"></th>
                            <th style="border-top: None;">ID</th>
                            <th style="border-top: None;">Họ và tên</th>
                            <th style="border-top: None;">Số điện thoại</th>
                            <th style="border-top: None;">Email</th>
                        </tr>
                    </thead> 
                    <tbody id="staff-table">

                    </tbody>
                </table>
            </div>
        </div> 
    </div>
</div>

<div id="editDepartmentModal" class="modal fade"  role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <hp class="modal-title">Xác nhận cập nhật</hp>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Xác nhận cập nhật thông tin phòng ban?</p> 
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary"  data-dismiss="modal">Hủy</button>
                    <button id="confirm-edit" class="btn btn-success"  data-dismiss="modal">Xác nhận</button>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="edit-department-success-alert" class="modal fade mt-5" role="dialog">
    <div class="modal-dialog mt-5">
        <div class="modal-content mt-5">
            <div class="modal-header">
                <h3 class="modal-title text-success">Thành công</h3>
            </div>
            <div class="modal-body">
                <h5>Thông tin phòng ban đã được cập nhật thành công!</h5>
            </div>
        </div>
    </div>
</div>