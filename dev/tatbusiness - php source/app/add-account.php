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

require_once '../backend/DAO/DepartmentDAO.php';

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
$data = loadAllDepartments();
$departments = json_decode($data);
$departments =  $departments->data;
?>
<div>
  <div class="mt-5 ">
    <div class="row">
      <div class=" mx-auto card col center col-md-10 mr-5 pt-3 ml-5 col-lg-8 col-md-9 col-sm-10">
        <div class="card-header">
          <h1 class="text-center text-uppercase">Thêm nhân viên mới</h1>
        </div>
        <div class="card-body">
          <form action="" method="post" name="addUserForm" onsubmit="return validateAddUser()" id="add-account-form">
            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="fullname-add"><strong>Họ và tên: </strong></label>
                <input type="text" class="form-control" placeholder="Nhập họ và tên" id="fullname-add" name="fullname-add">
              </div>
              <div class="form-group col-md-6">
                <label for="username-add"><strong>Tên tài khoản: </strong></label>
                <input type="text" class="form-control" placeholder="Nhập username" id="username-add" name="username-add">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="email-add"><strong>Email: </strong></label>
                <input type="text" class="form-control" placeholder="Nhập email" id="email-add" name="email-add">
              </div>
              <div class="form-group col-md-6">
                <label for="dob-add"><strong>Ngày sinh: </strong></label>
                <input type="date" class="form-control" placeholder="Chọn ngày sinh" id="dob-add" name="dob-add">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-5">
                <label for="phone-add"><strong>Số điện thoại: </strong></label>
                <input type="text" class="form-control" placeholder="Nhập số điện thoại" id="phone-add" name="phone-add">
              </div>
              <div class="form-group col-md-5">
                <label for="salary-add"><strong>Mức lương: </strong></label>
                <input type="number" class="form-control" placeholder="Nhập lương căn bản" id="salary-add" name="salary-add">
              </div>
              <div class="form-group col-md-2">
                <label for="gender-add"><strong>Giới tính: </strong></label>

                <div class="form-check">
                  <input type="radio" name="gender-add" value="Nam" id="male-add">
                  <label class="form-check-label" for="male-add">
                    <strong> Nam <i class="fas fa-male"></i></strong>
                  </label>
                </div>

                <div class="form-check">
                  <input type="radio" name="gender-add" value="Nữ" id="female-add">
                  <label class="form-check-label" for="female-add">
                    <strong> Nữ <i class="fas fa-female"></i></strong>
                  </label>
                </div>
              </div>

            </div>
            <div class="form-row">
              <div class="form-group col-md-12">
                <label for="department-add"><strong>Phòng ban: </strong></label>
                <select class="form-control" id="department-add" name="department-add">
                  <option selected disabled>Chọn phòng ban</option>
                  <?php
                  foreach ($departments as $department) {
                    echo "<option value =" . $department[0] . ">" . $department[1] . "</option>";
                  }
                  ?>
                </select>
              </div>
            </div>
            <div id="message-add" class="alert alert-danger" hidden="true"></div>
            <button type="submit" class="btn btn-primary" id="submit-add-button">Thêm</button>
          </form>
        </div>
      </div>
    </div>

    <div id="addUserModal" class="modal fade" role="dialog">
      <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            <hp class="modal-title">Xác nhận thêm</hp>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body">
            <p>Xác nhận thêm người dùng:</p>
            <p><strong id="add-name"></strong> - <strong id="add-username"></strong></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Hủy</button>
            <button id="confirm-add" class="btn btn-success" data-dismiss="modal">Xác nhận</button>
          </div>
        </div>
      </div>
    </div>
  </div>