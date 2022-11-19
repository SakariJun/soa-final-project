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
      // session_destroy();
      // echo $_SESSION['role'];
    require_once '../backend/DAO/DepartmentDAO.php';

    if(isset($_SESSION['role'])){
        if($_SESSION['role'] != 'Giám đốc'){
            echo '<h5 class="text-danger">Bạn không có quyền truy cập vào trang này, nhấn';
            echo ' <a href = "../index.php">vào đây</a> ';
            echo 'để trở về trang chủ hoặc truy cập trợ giúp<h5>';
            die();
        }
    }else{
        header('Location: login.php');
        die();
    }

    $data = loadAllDepartments();
    $departments = json_decode($data);
    $departments =  $departments->data;       
?>
<div>
    <div class="mt-5 ">
        <div class="row">
            <div class=" mx-auto card col center col-md-10 mr-5 pt-3 ml-5 col-lg-8 col-md-9 col-sm-10">
                <div class ="card-header">
                    <h1 class="text-center text-uppercase">Thêm phòng ban mới</h1>
                </div>
                <div class="card-body" >
                    <form action="" method="post" name="add-department-form" onsubmit ="return validateAddDepartment()"  id="add-department-form">
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="department-name-add"><strong>Tên phòng ban: </strong></label>
                                <input  type="text" class="form-control" placeholder="Nhập tên phòng ban" id="department-name-add" name="department-name-add">
                                
                                <div class="text-secondary small">
                                    <p>Các loại phòng ban có thể thêm của công ty</p>    
                                    <ul>
                                        <li>Phòng kế toán</li>
                                        <li>Phòng hành chính</li>
                                        <li>Phòng chăm sóc khách hàng</li>
                                        <li>Phòng nhân sự</li>
                                        <li>Phòng marketing</li>
                                        <li>Phòng quản trị</li>
                                        <li>Phòng kinh doanh</li>
                                        <li>Phòng công nghệ thông tin</li>
                                        <li>Phòng ban khác (đặt tên tùy ý)</li>
                                    </ul>
                                    <p><strong>Lưu ý: </strong>trên đây là một số loại phòng ban có thể đặt tên trong công ty. Tên phòng bàn phải bắt đầu bằng loại phòng ban, nếu trùng thì có thể thêm thành phần phía sau.</p>
                                </div>
                            </div>

                            <div class="form-group col-md-6">
                                <label for="department-room-add"><strong>Số phòng: </strong></label>
                                <input type="text" class="form-control" placeholder="Bắt đầu bằng chữ P vd:'P001'" id="department-room-add" name="department-room-add">
                            </div>
                        </div>
                       
                        <div class="form-group">
                            <label for="department-desc-add"><strong>Mô tả: </strong></label>
                            <textarea  class="form-control" placeholder="Nhập mô tả phòng ban" id="department-desc-add" name="department-desc-add" ></textarea>
                        </div> 
                        
                    
                        <div id="message-add" class="alert alert-danger" hidden="true"></div>
                        
                        <button type="submit" class="btn btn-primary" id="submit-add-button">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="add-department-modal" class="modal fade"  role="dialog">
        <div class="modal-dialog">

            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <hp class="modal-title">Xác nhận thêm</hp>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>

                <div class="modal-body">
                    <p>Xác nhận thêm phòng ban:</p> 
                    <strong id="add-name"></strong> - <strong id="add-room"></strong> - <strong id="add-desc"></strong>
                </div>
                
                <div class="modal-footer">
                    <button type="button"class="btn btn-secondary"  data-dismiss="modal">Hủy</button>
                    <button id="confirm-add" class="btn btn-success"  data-dismiss="modal">Xác nhận</button>
                </div>
            </div>
        </div>
    </div>
</div>
