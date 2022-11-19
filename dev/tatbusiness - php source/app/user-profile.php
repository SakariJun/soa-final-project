<?php
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
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
?>
<!-- Copy template từ file này này bắt đầu viết code -->
<div class="container">
    <div class="card">
        <div class="card-body">
            <h3 class="">Thông tin nhân viên</h3>
        </div>
    </div>
    <div class="card">
        <!-- <div class="card-header">
            <h3 class="">Thông tin nhân viên</h3>
        </div> -->
        <div class="">
            <div class="p-4">
                <div class="row">
                    <div class="col-12 mb-2 text-center">
                        <form class="mb-3" id="changeAvatarForm" action="" method="post" enctype="multipart/form-data">
                            <div class="user-avatar mb-3">
                                <img id='userAvatar' src="" alt="Avatar">
                                <label class="avatar-upload" for="avatarUploaded">
                                    <input class="" type="file" accept="image/png, image/gif, image/jpeg" name="avatarUploaded" id="avatarUploaded">
                                    <i class="fas fa-pen"></i>
                                </label>
                            </div>
                            <div id="responseMessage" role="alert">
                            </div>
                            <button id="setNewAvatar" type="button" class="btn btn-primary" disabled>Lưu ảnh đại diện</button>
                        </form>
                    </div>
                    <label class="col-7 mb-3 card-title">
                        <h5>Tài khoản</h5>
                    </label>
                    <div class="col-md-6 mb-2">
                        <div class="form-group">
                            <label for="userprofile_userID">Mã số nhân viên</label>
                            <input readonly value="" id="userprofile_userID" class="form-control">
                        </div>
                    </div>
                    <div class="col-md-6 mb-2">
                        <div class="form-group">
                            <label for="userprofile_username">Tên tài khoản</label>
                            <input readonly value="" id="userprofile_username" class="form-control">
                        </div>
                    </div>
                    <label class="col-7 mb-3 card-title">
                        <h5>Cá nhân</h5>
                    </label>
                    <div class="col-md-6 mb-2">
                        <div class="form-group">
                            <label for="userprofile_fullName">Họ và Tên</label>
                            <input readonly value="" id="userprofile_fullName" class="form-control">
                        </div>
                    </div>
                    <div class="col-md-6 mb-2">
                        <div class="form-group">
                            <label for="userprofile_gender">Giới tính</label>
                            <input readonly value="" id="userprofile_gender" class="form-control">
                        </div>
                    </div>

                    <div class="col-md-6 mb-2">
                        <div class="form-group">
                            <label for="userprofile_DOB">Ngày sinh</label>
                            <input readonly value="" id="userprofile_DOB" class="form-control">
                        </div>
                    </div>

                    <div class="col-md-6 mb-2">
                        <div class="form-group">
                            <label for="userprofile_phoneNumber">Số điện thoại</label>
                            <input readonly value="" id="userprofile_phoneNumber" class="form-control">
                        </div>
                    </div>

                    <div class="col-md-6 mb-2">
                        <div class="form-group">
                            <label for="userprofile_email">Email cá nhân</label>
                            <input readonly value="" id="userprofile_email" class="form-control">
                        </div>
                    </div>
                    <div class="col-md-6 mb-2">
                        <div class="form-group">
                            <label for="userprofile_role">Chức vụ</label>
                            <input readonly value="" id="userprofile_role" class="form-control">
                        </div>
                    </div>
                    <?php 
                    
                        if ($_SESSION['role'] != 'Giám đốc'){
                    ?>
                        <label class="col-7 mb-3 card-title">
                            <h5>Phòng ban</h5>
                        </label>

                        <div class="col-md-6 mb-2">
                            <div class="form-group">
                                <label for="userprofile_departmentID">Mã phòng ban</label>
                                <input readonly value="" id="userprofile_departmentID" class="form-control">
                            </div>
                        </div>

                        <div class="col-md-6 mb-2">
                            <div class="form-group">
                                <label for="userprofile_departmentRoomID">Văn phòng</label>
                                <input readonly value="" id="userprofile_departmentRoomID" class="form-control">
                            </div>
                        </div>

                        <div class="col-12 mb-2">
                            <div class="form-group">
                                <label for="userprofile_departmentName">Tên phòng ban</label>
                                <input readonly value="" id="userprofile_departmentName" class="form-control">
                            </div>
                        </div>

                        <?php
                            if ($_SESSION['role'] != 'Trưởng phòng'){
                        ?>

                        <label class="col-7 mb-3 card-title">
                            <h5>Trưởng phòng</h5>
                        </label>

                        <div class="col-md-6 mb-2">
                            <div class="form-group">
                                <label for="userprofile_leaderID">Mã số trưởng phòng</label>
                                <input readonly value="" id="userprofile_leaderID" class="form-control">
                            </div>
                        </div>

                        <div class="col-md-6 mb-2">
                            <div class="form-group">
                                <label for="userprofile_leaderID">Họ và Tên</label>
                                <input readonly value="" id="userprofile_leaderName" class="form-control">
                            </div>
                        </div>

                        <div class="col-md-6 mb-2">
                            <div class="form-group">
                                <label for="userprofile_leaderID">Email</label>
                                <input readonly value="" id="userprofile_leaderEmail" class="form-control">
                            </div>
                        </div>

                        <div class="col-md-6 mb-2">
                            <div class="form-group">
                                <label for="userprofile_leaderID">Số điện thoại</label>
                                <input readonly value="" id="userprofile_leaderPhone" class="form-control">
                            </div>
                        </div>
                    <?php
                        } }
                    ?>
                </div>
            </div>
        </div>
    </div>
</div>