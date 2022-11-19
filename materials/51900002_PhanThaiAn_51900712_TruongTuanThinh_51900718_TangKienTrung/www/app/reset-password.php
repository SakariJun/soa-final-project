<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="shortcut icon" href="/assets/images/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="../style.css"> <!-- Sử dụng link tuyệt đối tính từ root, vì vậy có dấu / đầu tiên -->
    <title>Quên mật khẩu</title>
</head>

<body>
    <!-- Copy template từ file này này bắt đầu viết code -->
    <div class="container vh-100">
        <div class="row align-items-center justify-content-center h-100">
            <div class="d-none d-md-block position-absolute sticky-top mt-5">
                <img class="mt-5" src="/assets/images/logo_title.png">
            </div>
            <div class="col-md-8 col-lg-6">
                <div class="card overflow-hidden">
                    <div class="bg-primary">
                        <div class="p-4">
                            <h2 class="mb-4 text-white">Yêu cầu đặt lại mật khẩu</h2>
                            <h6 class="mb-4 text-white">Vui lòng điền đầy đủ thông tin để gửi yêu cầu và chờ Giám Đốc xác nhận.</h6>
                            <form method="POST" onsubmit="return sendResetPasswordRequest()">
                                <div class="row">
                                    <div class="col-lg-12 mb-2">
                                        <div class="form-group">
                                            <input name="username" id="username" type="text" class="form-control" placeholder=" ">
                                            <label class="floating-label" for="username">Tên người dùng</label>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 mb-2">
                                        <div class="form-group">
                                            <input name="email" id="email" type="email" class="form-control" placeholder=" ">
                                            <label class="floating-label" for="email">Email</label>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 mb-2">
                                        <div class="form-group">
                                            <input name="phoneNumber" id="phoneNumber" type="tel" class="form-control" placeholder=" ">
                                            <label class="floating-label" for="phoneNumber">Số điện thoại</label>
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <div id="responseMessage" role="alert">
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <a href="login.php" class="align-middle text-white">&#9668 Đăng nhập</a>
                                    </div>
                                    <div class="col-6 text-right">
                                        <button type="submit" class="btn btn-white">Gửi yêu cầu</button>
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