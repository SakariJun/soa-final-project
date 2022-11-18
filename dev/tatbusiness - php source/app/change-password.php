<?php
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
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

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="/assets/images/favicon.ico">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="../style.css"> <!-- Sử dụng link tuyệt đối tính từ root, vì vậy có dấu / đầu tiên -->
    <title>Người dùng đổi mật khẩu</title>
</head>

<body>
    <!-- Copy template từ file này này bắt đầu viết code -->
    <div class="container vh-100">
        <div class="row align-items-center justify-content-center h-100">
            <div class="d-none d-md-block position-absolute sticky-top mt-5">
                <img class="mt-5" src="../assets/images/logo_title.png">
            </div>
            <div class="col-md-8 col-lg-6">
                <div class="card overflow-hidden">
                    <div class="bg-primary">
                        <div class="p-4">
                            <h2 class="mb-4 text-white">Đổi mật khẩu mới</h2>
                            <form method="POST" onsubmit="return userChangePassword()">
                                <div class="row">
                                    <div class="col-lg-12 mb-2">
                                        <div class="form-group">
                                            <input readonly value="<?= $_SESSION['username'] ?>" class="form-control" id="username" name="username" type="text" placeholder=" ">
                                            <label class="floating-label" for="username">Tên người dùng</label>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 mb-2">
                                        <div class="form-group">
                                            <input class="form-control" id="oldPassword" name="oldPassword" type="password" placeholder=" ">
                                            <label class="floating-label" for="oldPassword">Mật khẩu cũ</label>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 mb-2">
                                        <div class="form-group">
                                            <input class="form-control" id="newPassword" name="newPassword" type="password" placeholder=" ">
                                            <label class="floating-label" for="newPassword">Mật khẩu mới</label>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 mb-2">
                                        <div class="form-group">
                                            <input class="form-control" id="newPassword_confirm" name="newPassword_confirm" type="password" placeholder=" ">
                                            <label class="floating-label" for="newPassword_confirm">Nhập lại mật khẩu mới</label>
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <div id="responseMessage" role="alert">
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <a href="../index.php" class="align-middle text-white">&#9668 Quay lại</a>
                                    </div>
                                    <div class="col-6 text-right">
                                        <button type="submit" class="btn btn-white px-3">Đổi mật khẩu</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="../main.js"></script> <!-- Sử dụng link tuyệt đối tính từ root, vì vậy có dấu / đầu tiên -->
</body>

</html>