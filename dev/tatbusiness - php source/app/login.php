<?php
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    
    // Nếu đã đăng nhập thì vào index
    if (isset($_SESSION['username'])) {
        header('Location: ../index.php');
        exit();
    }

    $username = isset($_COOKIE['username']) ? $_COOKIE['username'] : "";

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="../assets/images/favicon.ico">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="../style.css"> <!-- Sử dụng link tuyệt đối tính từ root, vì vậy có dấu / đầu tiên -->
    <title>Đăng nhập - Website nội bộ</title>
</head>

<body>
    <!-- Copy template từ file này này bắt đầu viết code -->
    <!-- Start Loading -->
    <div id="loading">
        <img src=../assets/images/logo.png>
    </div>
    <!-- END Loading -->

    <!-- Content page  -->
    <div class="container vh-100">
        <div class="row align-items-center justify-content-center h-100">

            <div class="d-none d-md-block position-absolute sticky-top mt-5">
                <img class="mt-5" src="../assets/images/logo_title.png">
            </div>

            <div class="col-md-8 col-lg-6">
                <div class="card overflow-hidden">
                    <div class="bg-primary">
                        <div class="p-4">
                            <h2 class="mb-4 text-white text-center">ĐĂNG NHẬP</h2>
                            <h6 class="mb-4 text-white">Vui lòng đăng nhập để tiếp tục</h6>
                            <form method="POST" onsubmit="return validateLogin()" id="my-login-form">
                                <div class="row">
                                    <div class="col-lg-12 mb-2">
                                        <div class="form-group">
                                            <input class="form-control" value="<?= $username ?>" id="username" name="username" type="text" placeholder=" ">
                                            <label class="floating-label" for="username">Tên người dùng</label>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 mb-2">
                                        <div class="form-group">
                                            <input class="form-control" id="password" name="password" type="password" placeholder=" ">
                                            <label class="floating-label" for="password">Mật khẩu</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <label for="remember" class="custom-checkbox text-white">Nhớ tài khoản
                                            <input type="checkbox" id="remember" name="remember">
                                            <span class="checkmark"></span>
                                    </div>

                                    <div class="col-6 text-right">
                                        <a href="./reset-password.php" class="text-white">Quên mật khẩu?</a>
                                    </div>

                                    <div class="col-12">
                                        <div id="responseMessage" role="alert">
                                        </div>
                                    </div>
                                    <div class="col-12 text-right mt-2">
                                        <button type="submit" class="btn btn-white ml-auto ">Đăng nhập</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Page end  -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="../main.js"></script> <!-- Sử dụng link tuyệt đối tính từ root, vì vậy có dấu / đầu tiên -->
</body>

</html>